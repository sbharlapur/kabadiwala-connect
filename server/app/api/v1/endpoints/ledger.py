from datetime import datetime, timedelta
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.db.session import get_db
from app.models.user import User, CollectorProfile, RecyclerFacility
from app.models.lot import ScrapLot
from app.models.handover import HandoverTransaction
from app.schemas.all_schemas import HandoverTransactionResponse, DailyLedgerSummary
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter(prefix="/ledger", tags=["Ledger"])

@router.get("/collector")
async def get_collector_ledger(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res_prof = await db.execute(select(CollectorProfile).where(CollectorProfile.user_id == current_user.id))
    profile = res_prof.scalars().first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Collector profile not found")

    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    # Today's lots
    res_today = await db.execute(
        select(ScrapLot).where(
            ScrapLot.collector_id == profile.id,
            ScrapLot.created_at >= today_start
        )
    )
    today_lots = res_today.scalars().all()

    today_kg = sum(l.weight_kg for l in today_lots)
    today_payout = sum(l.final_payout or l.estimated_payout for l in today_lots)
    completed_today = sum(1 for l in today_lots if l.status == "COMPLETED")

    today_summary = DailyLedgerSummary(
        date=today_start.strftime("%Y-%m-%d"),
        total_lots=len(today_lots),
        total_kg=round(today_kg, 1),
        total_payout=round(today_payout, 2),
        completed_handover_count=completed_today
    )

    # Recent transactions
    res_tx = await db.execute(
        select(HandoverTransaction)
        .where(HandoverTransaction.collector_id == profile.id)
        .order_by(desc(HandoverTransaction.created_at))
        .limit(10)
    )
    txs = res_tx.scalars().all()

    return {
        "today": today_summary,
        "total_stats": {
            "total_kg_recycled": profile.total_kg_recycled,
            "total_earnings": profile.total_earnings,
            "rating": profile.rating,
            "badge_number": profile.badge_number
        },
        "recent_transactions": [
            HandoverTransactionResponse(
                id=t.id,
                lot_id=t.lot_id,
                collector_id=t.collector_id,
                recycler_id=t.recycler_id,
                category=t.category,
                weight_kg=t.weight_kg,
                unit_price=t.unit_price,
                total_payout=t.total_payout,
                status=t.status,
                qr_token=t.qr_token,
                fallback_code=t.fallback_code,
                tamper_check_passed=t.tamper_check_passed,
                scanned_at=t.scanned_at,
                verified_at=t.verified_at,
                completed_at=t.completed_at,
                created_at=t.created_at,
                notes=t.notes
            )
            for t in txs
        ]
    }

@router.get("/recycler/dashboard/stats")
async def get_recycler_stats(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res_fac = await db.execute(select(RecyclerFacility).where(RecyclerFacility.user_id == current_user.id))
    facility = res_fac.scalars().first()
    facility_id = facility.id if facility else None

    query = select(HandoverTransaction).order_by(desc(HandoverTransaction.created_at))
    if facility_id:
        query = query.where(HandoverTransaction.recycler_id == facility_id)

    res_tx = await db.execute(query.limit(50))
    txs = res_tx.scalars().all()

    total_intake_kg = sum(t.weight_kg for t in txs if t.status == "COMPLETED")
    total_disbursed = sum(t.total_payout for t in txs if t.status == "COMPLETED")
    pending_count = sum(1 for t in txs if t.status in ["PENDING", "MATCHED"])

    category_breakdown: Dict[str, float] = {}
    for t in txs:
        if t.status == "COMPLETED":
            category_breakdown[t.category] = round(category_breakdown.get(t.category, 0) + t.weight_kg, 1)

    return {
        "facility_name": facility.facility_name if facility else "CPCB Authorized Central Hub",
        "cpcb_reg_number": facility.cpcb_reg_number if facility else "CPCB-REG-2026-DEL-089",
        "capacity_kg_per_day": facility.capacity_kg_per_day if facility else 5000.0,
        "current_stock_kg": facility.current_stock_kg if facility else 1240.0,
        "total_intake_kg": round(total_intake_kg, 1),
        "total_disbursed": round(total_disbursed, 2),
        "pending_handover_count": pending_count,
        "category_breakdown": category_breakdown,
        "recent_transactions": [
            HandoverTransactionResponse(
                id=t.id,
                lot_id=t.lot_id,
                collector_id=t.collector_id,
                recycler_id=t.recycler_id,
                category=t.category,
                weight_kg=t.weight_kg,
                unit_price=t.unit_price,
                total_payout=t.total_payout,
                status=t.status,
                qr_token=t.qr_token,
                fallback_code=t.fallback_code,
                tamper_check_passed=t.tamper_check_passed,
                scanned_at=t.scanned_at,
                verified_at=t.verified_at,
                completed_at=t.completed_at,
                created_at=t.created_at
            )
            for t in txs[:15]
        ]
    }
