import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User, CollectorProfile, RecyclerFacility
from app.models.price import PriceRecord
from app.core.security import get_password_hash

async def seed_initial_data(db: AsyncSession):
    # 1. Seed Demo Recycler Users
    res_rec = await db.execute(select(User).where(User.email == "delhi@ecorecycle.in"))
    rec_user = res_rec.scalars().first()

    if not rec_user:
        hashed_pw = get_password_hash("demo")
        rec_user = User(
            id="u-rec-1",
            email="delhi@ecorecycle.in",
            name="Harish Mehta (EcoRecycle)",
            hashed_password=hashed_pw,
            role="RECYCLER",
            language="en",
            is_active=True
        )
        db.add(rec_user)
        await db.flush()

        facility = RecyclerFacility(
            id="rec-1",
            user_id=rec_user.id,
            facility_name="EcoRecycle Solutions Hub (Mayapuri)",
            cpcb_reg_number="CPCB/EW/2024/DEL-0891",
            facility_type="RECYCLER",
            address="Plot 42, Mayapuri Industrial Phase II, New Delhi",
            city="Delhi",
            state="Delhi",
            pincode="110064",
            latitude=28.6289,
            longitude=77.2065,
            accepted_categories="PCB,CABLES,BATTERIES,LCD_LED,CRT_TV,MOTORS_MAGNETS,MIXED_PLASTICS",
            capacity_kg_per_day=5000.0,
            current_stock_kg=1840.0,
            phone="9811223344",
            is_cpcb_verified=True,
            pickup_available=True
        )
        db.add(facility)

    # Second facility
    res_rec2 = await db.execute(select(User).where(User.email == "info@greenearthrefiners.in"))
    if not res_rec2.scalars().first():
        hashed_pw2 = get_password_hash("demo")
        rec_user2 = User(
            id="u-rec-2",
            email="info@greenearthrefiners.in",
            name="Vikram Singh (GreenEarth)",
            hashed_password=hashed_pw2,
            role="RECYCLER",
            language="en",
            is_active=True
        )
        db.add(rec_user2)
        await db.flush()

        facility2 = RecyclerFacility(
            id="rec-2",
            user_id=rec_user2.id,
            facility_name="GreenEarth Metal & E-Waste Refiners",
            cpcb_reg_number="CPCB/EW/2023/DEL-0142",
            facility_type="DISMANTLER",
            address="Kirti Nagar Recycling Cluster, New Delhi",
            city="Delhi",
            state="Delhi",
            pincode="110015",
            latitude=28.6500,
            longitude=77.2300,
            accepted_categories="PCB,CABLES,BATTERIES,LCD_LED",
            capacity_kg_per_day=3500.0,
            current_stock_kg=920.0,
            phone="9822334455",
            is_cpcb_verified=True,
            pickup_available=False
        )
        db.add(facility2)

    # 2. Seed Collector User
    res_col = await db.execute(select(User).where(User.phone == "9876543210"))
    if not res_col.scalars().first():
        col_user = User(
            id="u-col-1",
            phone="9876543210",
            name="रमेश कुमार (Ramesh Kumar)",
            role="COLLECTOR",
            language="hi",
            is_active=True
        )
        db.add(col_user)
        await db.flush()

        col_prof = CollectorProfile(
            id="cp-demo-1",
            user_id=col_user.id,
            badge_number="DEL-KAB-0042",
            operating_city="Delhi NCR",
            total_kg_recycled=348.5,
            total_earnings=28450.0,
            rating=4.9,
            is_verified=True,
            upi_id="ramesh.kumar@okhdfcbank"
        )
        db.add(col_prof)

    # 3. Seed Price Board Records
    res_prices = await db.execute(select(PriceRecord))
    if not res_prices.scalars().first():
        from app.api.v1.endpoints.prices import DEFAULT_PRICES
        for item in DEFAULT_PRICES:
            p_rec = PriceRecord(
                id=str(uuid.uuid4()),
                category=item["category"],
                category_name_hi=item["category_name_hi"],
                category_name_en=item["category_name_en"],
                base_rate_per_kg=item["base_rate_per_kg"],
                min_rate_per_kg=item["min_rate_per_kg"],
                max_rate_per_kg=item["max_rate_per_kg"],
                cpcb_floor_price=item["cpcb_floor_price"],
                trend=item["trend"],
                trend_percentage=item["trend_percentage"],
                unit="kg",
                last_updated=datetime.utcnow()
            )
            db.add(p_rec)

    await db.commit()
