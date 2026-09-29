import uuid
import asyncio
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.models.user import User, CollectorProfile, RecyclerFacility
from app.models.lot import ScrapLot
from app.models.handover import HandoverTransaction, AuditLog
from app.schemas.all_schemas import (
    InitiateHandoverRequest,
    VerifyHandoverRequest,
    HandoverTransactionResponse
)
from app.api.v1.endpoints.auth import get_current_user
from app.services.qr_service import verify_handover_token
from app.services.sse_service import sse_broadcaster
from app.services.valuation import calculate_lot_valuation

router = APIRouter(prefix="/handovers", tags=["Handovers"])

@router.post("/initiate", response_model=HandoverTransactionResponse)
async def initiate_handover(
    req: InitiateHandoverRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res_lot = await db.execute(select(ScrapLot).where(ScrapLot.id == req.lot_id))
    lot = res_lot.scalars().first()
    if not lot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scrap lot not found")

    res_rec = await db.execute(select(RecyclerFacility).where(RecyclerFacility.id == req.recycler_id))
    recycler = res_rec.scalars().first()
    if not recycler:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recycler facility not found")

    # Update lot
    lot.matched_recycler_id = recycler.id
    lot.status = "MATCHED"

    tx_id = str(uuid.uuid4())
    tx = HandoverTransaction(
        id=tx_id,
        lot_id=lot.id,
        collector_id=lot.collector_id,
        recycler_id=recycler.id,
        category=lot.category,
        weight_kg=lot.weight_kg,
        unit_price=lot.unit_price,
        total_payout=lot.estimated_payout,
        status="MATCHED",
        qr_token=lot.qr_token,
        fallback_code=lot.fallback_code,
        tamper_check_passed=True
    )
    db.add(tx)

    # Audit log
    audit = AuditLog(
        id=str(uuid.uuid4()),
        entity_type="HANDOVER",
        entity_id=tx_id,
        action="INITIATE",
        actor_id=current_user.id,
        actor_role=current_user.role,
        new_state="MATCHED"
    )
    db.add(audit)

    await db.commit()
    await db.refresh(tx)

    return HandoverTransactionResponse(
        id=tx.id,
        lot_id=tx.lot_id,
        collector_id=tx.collector_id,
        recycler_id=tx.recycler_id,
        category=tx.category,
        weight_kg=tx.weight_kg,
        unit_price=tx.unit_price,
        total_payout=tx.total_payout,
        status=tx.status,
        qr_token=tx.qr_token,
        fallback_code=tx.fallback_code,
        tamper_check_passed=tx.tamper_check_passed,
        created_at=tx.created_at
    )

@router.post("/verify", response_model=HandoverTransactionResponse)
async def verify_handover(
    req: VerifyHandoverRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Search for matching lot by qr_token or fallback_code
    query = select(ScrapLot).where(
        (ScrapLot.qr_token == req.qr_token) | (ScrapLot.fallback_code == req.fallback_code)
    )
    res_lot = await db.execute(query)
    lot = res_lot.scalars().first()

    if not lot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching lot found for provided QR token or code")

    # Verification token authenticity check
    token_valid = verify_handover_token(req.qr_token, lot.id, lot.collector_id) or (req.fallback_code and req.fallback_code == lot.fallback_code)

    if not token_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="HMAC signature verification failed. Possible counterfeit token.")

    # Calculate final settlement if actual weight or condition adjusted
    final_weight = req.actual_weight_kg or lot.weight_kg
    final_cond = req.actual_condition or lot.condition
    unit_p, final_payout, _ = calculate_lot_valuation(lot.category, final_weight, final_cond)

    now = datetime.utcnow()
    lot.status = "COMPLETED"
    lot.verification_status = "PHYSICAL_CONFIRMED"
    lot.weight_kg = final_weight
    lot.condition = final_cond
    lot.final_payout = final_payout

    # Find or update HandoverTransaction
    res_tx = await db.execute(select(HandoverTransaction).where(HandoverTransaction.lot_id == lot.id))
    tx = res_tx.scalars().first()

    # Find recycler profile of current user if recycler
    res_rec = await db.execute(select(RecyclerFacility).where(RecyclerFacility.user_id == current_user.id))
    facility = res_rec.scalars().first()
    facility_id = facility.id if facility else lot.matched_recycler_id

    if not tx:
        tx = HandoverTransaction(
            id=str(uuid.uuid4()),
            lot_id=lot.id,
            collector_id=lot.collector_id,
            recycler_id=facility_id or "default-facility",
            category=lot.category,
            weight_kg=final_weight,
            unit_price=unit_p,
            total_payout=final_payout,
            status="COMPLETED",
            qr_token=lot.qr_token,
            fallback_code=lot.fallback_code,
            tamper_check_passed=True,
            scanned_at=now,
            verified_at=now,
            completed_at=now,
            notes=req.notes
        )
        db.add(tx)
    else:
        tx.status = "COMPLETED"
        tx.weight_kg = final_weight
        tx.total_payout = final_payout
        tx.scanned_at = now
        tx.verified_at = now
        tx.completed_at = now
        tx.notes = req.notes
        if facility_id:
            tx.recycler_id = facility_id

    # Update collector stats
    res_prof = await db.execute(select(CollectorProfile).where(CollectorProfile.id == lot.collector_id))
    prof = res_prof.scalars().first()
    if prof:
        prof.total_kg_recycled += final_weight
        prof.total_earnings += final_payout

    # Update facility stats
    if facility:
        facility.current_stock_kg += final_weight

    # Audit log
    audit = AuditLog(
        id=str(uuid.uuid4()),
        entity_type="HANDOVER",
        entity_id=tx.id,
        action="VERIFY_COMPLETE",
        actor_id=current_user.id,
        actor_role=current_user.role,
        new_state="COMPLETED"
    )
    db.add(audit)

    await db.commit()
    await db.refresh(tx)

    # Broadcast real-time SSE notification
    await sse_broadcaster.broadcast_event(lot.id, {
        "event": "HANDOVER_CONFIRMED",
        "lot_id": lot.id,
        "tx_id": tx.id,
        "status": "COMPLETED",
        "payout": final_payout,
        "weight_kg": final_weight,
        "recycler_name": facility.facility_name if facility else "Authorized Recycler",
        "timestamp": now.isoformat()
    })

    return HandoverTransactionResponse(
        id=tx.id,
        lot_id=tx.lot_id,
        collector_id=tx.collector_id,
        recycler_id=tx.recycler_id,
        category=tx.category,
        weight_kg=tx.weight_kg,
        unit_price=tx.unit_price,
        total_payout=tx.total_payout,
        status=tx.status,
        qr_token=tx.qr_token,
        fallback_code=tx.fallback_code,
        tamper_check_passed=tx.tamper_check_passed,
        scanned_at=tx.scanned_at,
        verified_at=tx.verified_at,
        completed_at=tx.completed_at,
        created_at=tx.created_at,
        notes=tx.notes
    )

@router.get("/stream/{lot_id}")
async def stream_lot_events(lot_id: str):
    queue = sse_broadcaster.subscribe(lot_id)

    async def event_generator():
        try:
            # Yield initial connect ping
            yield f"data: {{\"event\": \"CONNECTED\", \"lot_id\": \"{lot_id}\"}}\n\n"
            while True:
                data = await queue.get()
                yield f"data: {data}\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            sse_broadcaster.unsubscribe(lot_id, queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
