import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from app.db.session import get_db
from app.models.user import User, CollectorProfile
from app.models.lot import ScrapLot, LotPhoto
from app.models.anomaly import AnomalyReport
from app.schemas.all_schemas import CreateLotRequest, ScrapLotResponse
from app.api.v1.endpoints.auth import get_current_user
from app.services.valuation import calculate_lot_valuation
from app.services.qr_service import generate_handover_token
from app.services.anomaly_detector import detect_lot_anomalies

router = APIRouter(prefix="/lots", tags=["Lots"])

@router.post("", response_model=ScrapLotResponse)
async def create_scrap_lot(
    req: CreateLotRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Fetch collector profile
    res_prof = await db.execute(select(CollectorProfile).where(CollectorProfile.user_id == current_user.id))
    profile = res_prof.scalars().first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only registered collectors can create scrap lots")

    # Idempotency check via client_uuid
    if req.client_uuid:
        existing = await db.execute(select(ScrapLot).where(ScrapLot.client_uuid == req.client_uuid))
        existing_lot = existing.scalars().first()
        if existing_lot:
            return ScrapLotResponse(
                id=existing_lot.id,
                collector_id=existing_lot.collector_id,
                category=existing_lot.category,
                condition=existing_lot.condition,
                weight_kg=existing_lot.weight_kg,
                unit_price=existing_lot.unit_price,
                estimated_payout=existing_lot.estimated_payout,
                final_payout=existing_lot.final_payout,
                confidence_score=existing_lot.confidence_score,
                status=existing_lot.status,
                verification_status=existing_lot.verification_status,
                latitude=existing_lot.latitude,
                longitude=existing_lot.longitude,
                location_name=existing_lot.location_name,
                client_uuid=existing_lot.client_uuid,
                matched_recycler_id=existing_lot.matched_recycler_id,
                qr_token=existing_lot.qr_token,
                fallback_code=existing_lot.fallback_code,
                notes=existing_lot.notes,
                created_at=existing_lot.created_at,
                updated_at=existing_lot.updated_at,
                photo_urls=req.photo_urls
            )

    lot_id = str(uuid.uuid4())
    unit_price, estimated_payout, _ = calculate_lot_valuation(
        category=req.category,
        weight_kg=req.weight_kg,
        condition=req.condition
    )

    qr_token, fallback_code = generate_handover_token(lot_id=lot_id, collector_id=profile.id)

    # Anomaly evaluation
    is_anomaly, risk_level, violations, details = detect_lot_anomalies({
        "category": req.category,
        "condition": req.condition,
        "weight_kg": req.weight_kg,
        "unit_price": unit_price
    })

    verification_status = "ANOMALY_DETECTED" if is_anomaly else "AI_VERIFIED"
    lot_status = "FLAGGED_ANOMALY" if is_anomaly and risk_level in ["HIGH", "CRITICAL"] else "PENDING"

    lot = ScrapLot(
        id=lot_id,
        collector_id=profile.id,
        category=req.category.upper(),
        condition=req.condition.upper(),
        weight_kg=req.weight_kg,
        unit_price=unit_price,
        estimated_payout=estimated_payout,
        confidence_score=req.confidence_score,
        status=lot_status,
        verification_status=verification_status,
        latitude=req.latitude or profile.current_latitude,
        longitude=req.longitude or profile.current_longitude,
        location_name=req.location_name or profile.operating_city,
        client_uuid=req.client_uuid,
        matched_recycler_id=req.matched_recycler_id,
        qr_token=qr_token,
        fallback_code=fallback_code,
        notes=req.notes
    )
    db.add(lot)
    await db.flush()

    # Photos
    for idx, url in enumerate(req.photo_urls):
        p_hash = req.photo_hashes[idx] if idx < len(req.photo_hashes) else None
        photo = LotPhoto(
            id=str(uuid.uuid4()),
            lot_id=lot.id,
            photo_url=url,
            photo_hash=p_hash,
            is_primary=(idx == 0)
        )
        db.add(photo)

    # If flagged, record anomaly report
    if is_anomaly:
        report = AnomalyReport(
            id=str(uuid.uuid4()),
            lot_id=lot.id,
            risk_level=risk_level,
            rule_violation=", ".join(violations),
            details=details
        )
        db.add(report)

    await db.commit()
    await db.refresh(lot)

    return ScrapLotResponse(
        id=lot.id,
        collector_id=lot.collector_id,
        category=lot.category,
        condition=lot.condition,
        weight_kg=lot.weight_kg,
        unit_price=lot.unit_price,
        estimated_payout=lot.estimated_payout,
        final_payout=lot.final_payout,
        confidence_score=lot.confidence_score,
        status=lot.status,
        verification_status=lot.verification_status,
        latitude=lot.latitude,
        longitude=lot.longitude,
        location_name=lot.location_name,
        client_uuid=lot.client_uuid,
        matched_recycler_id=lot.matched_recycler_id,
        qr_token=lot.qr_token,
        fallback_code=lot.fallback_code,
        notes=lot.notes,
        created_at=lot.created_at,
        updated_at=lot.updated_at,
        photo_urls=req.photo_urls
    )

@router.get("", response_model=List[ScrapLotResponse])
async def list_collector_lots(
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res_prof = await db.execute(select(CollectorProfile).where(CollectorProfile.user_id == current_user.id))
    profile = res_prof.scalars().first()

    query = select(ScrapLot).options(selectinload(ScrapLot.photos)).order_by(desc(ScrapLot.created_at)).limit(limit).offset(offset)
    if profile:
        query = query.where(ScrapLot.collector_id == profile.id)

    res = await db.execute(query)
    lots = res.scalars().all()

    response = []
    for lot in lots:
        p_urls = [p.photo_url for p in lot.photos]
        response.append(
            ScrapLotResponse(
                id=lot.id,
                collector_id=lot.collector_id,
                category=lot.category,
                condition=lot.condition,
                weight_kg=lot.weight_kg,
                unit_price=lot.unit_price,
                estimated_payout=lot.estimated_payout,
                final_payout=lot.final_payout,
                confidence_score=lot.confidence_score,
                status=lot.status,
                verification_status=lot.verification_status,
                latitude=lot.latitude,
                longitude=lot.longitude,
                location_name=lot.location_name,
                client_uuid=lot.client_uuid,
                matched_recycler_id=lot.matched_recycler_id,
                qr_token=lot.qr_token,
                fallback_code=lot.fallback_code,
                notes=lot.notes,
                created_at=lot.created_at,
                updated_at=lot.updated_at,
                photo_urls=p_urls
            )
        )
    return response

@router.get("/{lot_id}", response_model=ScrapLotResponse)
async def get_lot_by_id(lot_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(ScrapLot).options(selectinload(ScrapLot.photos)).where(ScrapLot.id == lot_id))
    lot = res.scalars().first()
    if not lot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scrap lot not found")

    p_urls = [p.photo_url for p in lot.photos]
    return ScrapLotResponse(
        id=lot.id,
        collector_id=lot.collector_id,
        category=lot.category,
        condition=lot.condition,
        weight_kg=lot.weight_kg,
        unit_price=lot.unit_price,
        estimated_payout=lot.estimated_payout,
        final_payout=lot.final_payout,
        confidence_score=lot.confidence_score,
        status=lot.status,
        verification_status=lot.verification_status,
        latitude=lot.latitude,
        longitude=lot.longitude,
        location_name=lot.location_name,
        client_uuid=lot.client_uuid,
        matched_recycler_id=lot.matched_recycler_id,
        qr_token=lot.qr_token,
        fallback_code=lot.fallback_code,
        notes=lot.notes,
        created_at=lot.created_at,
        updated_at=lot.updated_at,
        photo_urls=p_urls
    )
