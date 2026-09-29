from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.user import RecyclerFacility
from app.models.price import PriceRecord
from app.schemas.all_schemas import (
    RecyclerFacilityResponse,
    RecyclerMatchRequest,
    RecyclerMatchResult
)
from app.services.geo import haversine_distance, calculate_transport_subsidy
from app.services.valuation import calculate_lot_valuation

router = APIRouter(prefix="/recyclers", tags=["Recyclers"])

@router.get("", response_model=List[RecyclerFacilityResponse])
async def list_recyclers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RecyclerFacility).order_by(RecyclerFacility.facility_name))
    facilities = result.scalars().all()

    response = []
    for f in facilities:
        cats = f.accepted_categories.split(",") if f.accepted_categories else []
        response.append(
            RecyclerFacilityResponse(
                id=f.id,
                user_id=f.user_id,
                facility_name=f.facility_name,
                cpcb_reg_number=f.cpcb_reg_number,
                facility_type=f.facility_type,
                address=f.address,
                city=f.city,
                state=f.state,
                pincode=f.pincode,
                latitude=f.latitude,
                longitude=f.longitude,
                accepted_categories=cats,
                capacity_kg_per_day=f.capacity_kg_per_day,
                current_stock_kg=f.current_stock_kg,
                phone=f.phone,
                is_cpcb_verified=f.is_cpcb_verified,
                pickup_available=f.pickup_available
            )
        )
    return response

@router.post("/match", response_model=List[RecyclerMatchResult])
async def match_recyclers(req: RecyclerMatchRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RecyclerFacility))
    facilities = result.scalars().all()

    # Get baseline price for category
    res_price = await db.execute(select(PriceRecord).where(PriceRecord.category == req.category.upper()))
    price_rec = res_price.scalars().first()
    base_rate = price_rec.base_rate_per_kg if price_rec else 280.0

    matches = []
    user_lat = req.latitude or 28.6139
    user_lon = req.longitude or 77.2090

    for f in facilities:
        cats = [c.strip().upper() for c in f.accepted_categories.split(",")] if f.accepted_categories else []
        if req.category.upper() not in cats:
            continue

        dist_km = haversine_distance(user_lat, user_lon, f.latitude, f.longitude)
        if req.max_distance_km and dist_km > req.max_distance_km:
            continue

        # Calculate economics
        unit_rate = base_rate
        gross_payout = round(unit_rate * req.weight_kg, 2)
        subsidy = calculate_transport_subsidy(dist_km)
        net_payout = round(gross_payout + subsidy, 2)

        matches.append({
            "facility": f,
            "distance_km": dist_km,
            "rate_per_kg": unit_rate,
            "estimated_gross_payout": gross_payout,
            "transport_subsidy": subsidy,
            "net_payout": net_payout,
            "pickup_available": f.pickup_available,
            "score": net_payout - (dist_km * 2) # Weighted ranking formula
        })

    # Sort descending by ranking score
    matches.sort(key=lambda m: m["score"], reverse=True)

    match_results = []
    for rank, m in enumerate(matches, 1):
        f = m["facility"]
        fac_resp = RecyclerFacilityResponse(
            id=f.id,
            user_id=f.user_id,
            facility_name=f.facility_name,
            cpcb_reg_number=f.cpcb_reg_number,
            facility_type=f.facility_type,
            address=f.address,
            city=f.city,
            state=f.state,
            pincode=f.pincode,
            latitude=f.latitude,
            longitude=f.longitude,
            accepted_categories=f.accepted_categories.split(",") if f.accepted_categories else [],
            capacity_kg_per_day=f.capacity_kg_per_day,
            current_stock_kg=f.current_stock_kg,
            phone=f.phone,
            is_cpcb_verified=f.is_cpcb_verified,
            pickup_available=f.pickup_available
        )
        match_results.append(
            RecyclerMatchResult(
                facility=fac_resp,
                distance_km=m["distance_km"],
                rate_per_kg=m["rate_per_kg"],
                estimated_gross_payout=m["estimated_gross_payout"],
                transport_subsidy=m["transport_subsidy"],
                net_payout=m["net_payout"],
                pickup_available=m["pickup_available"],
                match_rank=rank
            )
        )

    return match_results
