import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.user import User, CollectorProfile, RecyclerFacility
from app.schemas.all_schemas import (
    CollectorLoginRequest,
    RecyclerLoginRequest,
    AuthResponse,
    UserResponse,
    CollectorProfileResponse,
    RecyclerFacilityResponse
)
from app.core.security import (
    create_access_token,
    decode_access_token,
    verify_password,
    get_password_hash
)

router = APIRouter(prefix="/auth", tags=["Auth"])

async def get_current_user(
    authorization: str = Header(None),
    db: AsyncSession = Depends(get_db)
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token"
        )
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalid or expired"
        )

    user_id = payload["sub"]
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@router.post("/collector/login", response_model=AuthResponse)
async def collector_login(req: CollectorLoginRequest, db: AsyncSession = Depends(get_db)):
    # Look for existing user by phone
    res = await db.execute(select(User).where(User.phone == req.phone))
    user = res.scalars().first()

    if not user:
        # Auto-register collector for friction-free onboarding
        user = User(
            id=str(uuid.uuid4()),
            phone=req.phone,
            name=req.name or "कबाड़ी मित्र",
            role="COLLECTOR",
            language=req.language or "hi",
            is_active=True
        )
        db.add(user)
        await db.flush()

        badge_num = f"DL-KBD-{int(datetime.utcnow().timestamp()) % 100000:05d}"
        profile = CollectorProfile(
            id=str(uuid.uuid4()),
            user_id=user.id,
            badge_number=badge_num,
            operating_city="Delhi NCR",
            total_kg_recycled=42.0,
            total_earnings=2450.0,
            rating=4.9
        )
        db.add(profile)
        await db.commit()
        await db.refresh(user)
    else:
        # Load profile
        res_prof = await db.execute(select(CollectorProfile).where(CollectorProfile.user_id == user.id))
        profile = res_prof.scalars().first()

    token = create_access_token(subject=user.id, role=user.role)

    prof_data = None
    if profile:
        prof_data = {
            "id": profile.id,
            "user_id": profile.user_id,
            "badge_number": profile.badge_number,
            "operating_city": profile.operating_city,
            "total_kg_recycled": profile.total_kg_recycled,
            "total_earnings": profile.total_earnings,
            "rating": profile.rating,
            "is_verified": profile.is_verified
        }

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
        profile=prof_data
    )

@router.post("/recycler/login", response_model=AuthResponse)
async def recycler_login(req: RecyclerLoginRequest, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.email == req.email))
    user = res.scalars().first()

    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    res_fac = await db.execute(select(RecyclerFacility).where(RecyclerFacility.user_id == user.id))
    facility = res_fac.scalars().first()

    token = create_access_token(subject=user.id, role=user.role)

    fac_data = None
    if facility:
        fac_data = {
            "id": facility.id,
            "user_id": facility.user_id,
            "facility_name": facility.facility_name,
            "cpcb_reg_number": facility.cpcb_reg_number,
            "facility_type": facility.facility_type,
            "address": facility.address,
            "city": facility.city,
            "state": facility.state,
            "pincode": facility.pincode,
            "latitude": facility.latitude,
            "longitude": facility.longitude,
            "accepted_categories": facility.accepted_categories.split(",") if facility.accepted_categories else [],
            "capacity_kg_per_day": facility.capacity_kg_per_day,
            "current_stock_kg": facility.current_stock_kg,
            "phone": facility.phone,
            "is_cpcb_verified": facility.is_cpcb_verified,
            "pickup_available": facility.pickup_available
        }

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
        profile=fac_data
    )

@router.get("/me")
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    profile_data = None
    if current_user.role == "COLLECTOR":
        res = await db.execute(select(CollectorProfile).where(CollectorProfile.user_id == current_user.id))
        prof = res.scalars().first()
        if prof:
            profile_data = {
                "id": prof.id,
                "badge_number": prof.badge_number,
                "operating_city": prof.operating_city,
                "total_kg_recycled": prof.total_kg_recycled,
                "total_earnings": prof.total_earnings,
                "rating": prof.rating,
                "is_verified": prof.is_verified
            }
    elif current_user.role == "RECYCLER":
        res = await db.execute(select(RecyclerFacility).where(RecyclerFacility.user_id == current_user.id))
        fac = res.scalars().first()
        if fac:
            profile_data = {
                "id": fac.id,
                "facility_name": fac.facility_name,
                "cpcb_reg_number": fac.cpcb_reg_number,
                "city": fac.city,
                "capacity_kg_per_day": fac.capacity_kg_per_day,
                "current_stock_kg": fac.current_stock_kg,
                "is_cpcb_verified": fac.is_cpcb_verified
            }

    return {
        "user": UserResponse.model_validate(current_user),
        "profile": profile_data
    }
