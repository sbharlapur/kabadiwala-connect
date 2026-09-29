import asyncio
import os
import sys
import uuid
from datetime import datetime, timedelta

# Add server to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "server"))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select, text
from app.db.session import Base
from app.models.user import User, CollectorProfile, RecyclerFacility
from app.models.price import PriceRecord, PriceHistory
from app.models.lot import ScrapLot, LotPhoto
from app.models.handover import HandoverTransaction
from app.core.security import get_password_hash, generate_handover_qr_token, generate_fallback_code
from app.core.config import settings

async def setup_and_seed():
    print("=" * 60)
    print("KABADIWALA CONNECT - DATABASE SETUP & SEEDING")
    print("=" * 60)

    db_url = settings.DATABASE_URL
    print(f"Connecting to database: {db_url}")

    engine = None
    try:
        engine = create_async_engine(db_url, echo=False)
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        print("[OK] Connected to primary database.")
    except Exception as e:
        print(f"[WARN] Failed to connect to primary DB ({e}). Falling back to SQLite...")
        sqlite_url = "sqlite+aiosqlite:///./kabadiwala.db"
        engine = create_async_engine(sqlite_url, echo=False)

    # Create all tables
    print("Creating database schema & tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[OK] Schema synchronized.")

    session_maker = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with session_maker() as session:
        # 1. Seed Prices
        print("\nSeeding CPCB & MSP Scrap Price Board (7 Categories)...")
        price_data = [
            {
                "category": "PCB",
                "name_hi": "सर्किट बोर्ड (PCB)",
                "name_en": "Circuit Board / Motherboards",
                "base": 280.0,
                "min": 240.0,
                "max": 320.0,
                "cpcb_floor": 220.0,
                "trend": "UP",
                "trend_pct": 4.5,
                "desc": "High-grade FR4 and paper-phenolic printed circuit boards from computers and mobile phones."
            },
            {
                "category": "CABLES",
                "name_hi": "तांबे के तार (Cables)",
                "name_en": "Copper & Aluminum Cables",
                "base": 450.0,
                "min": 410.0,
                "max": 490.0,
                "cpcb_floor": 390.0,
                "trend": "UP",
                "trend_pct": 2.8,
                "desc": "Insulated and uninsulated copper wires, electrical flex, and transmission core."
            },
            {
                "category": "BATTERIES",
                "name_hi": "बैटरी स्क्रैप (Batteries)",
                "name_en": "Lead-Acid & Lithium Batteries",
                "base": 95.0,
                "min": 85.0,
                "max": 115.0,
                "cpcb_floor": 80.0,
                "trend": "STABLE",
                "trend_pct": 0.0,
                "desc": "Inverter batteries, UPS lead-acid units, and cylindrical Li-ion cells."
            },
            {
                "category": "CRT_TV",
                "name_hi": "पुराना टीवी (CRT TV)",
                "name_en": "Cathode Ray Tube Screens",
                "base": 35.0,
                "min": 25.0,
                "max": 45.0,
                "cpcb_floor": 22.0,
                "trend": "DOWN",
                "trend_pct": -3.2,
                "desc": "Heavy leaded glass cathode ray displays requiring specialized decontamination."
            },
            {
                "category": "LCD_LED",
                "name_hi": "एलसीडी / एलईडी (LCD / LED)",
                "name_en": "Flat Panel Monitors & Displays",
                "base": 120.0,
                "min": 100.0,
                "max": 140.0,
                "cpcb_floor": 95.0,
                "trend": "UP",
                "trend_pct": 1.5,
                "desc": "CCFL and LED backlit displays, laptop screens, and smart TV panels."
            },
            {
                "category": "MOTORS_MAGNETS",
                "name_hi": "मोटर / मैग्नेट (Motors)",
                "name_en": "Compressor Motors & Magnets",
                "base": 85.0,
                "min": 75.0,
                "max": 100.0,
                "cpcb_floor": 70.0,
                "trend": "STABLE",
                "trend_pct": 0.5,
                "desc": "Refrigerator compressors, washing machine induction motors, and neodymium scrap."
            },
            {
                "category": "MIXED_PLASTICS",
                "name_hi": "प्लास्टिक बॉडी (Plastics)",
                "name_en": "E-Waste Polymer Casing",
                "base": 28.0,
                "min": 22.0,
                "max": 35.0,
                "cpcb_floor": 18.0,
                "trend": "STABLE",
                "trend_pct": 0.0,
                "desc": "ABS, polycarbonate, and flame-retardant computer housing shells."
            }
        ]

        for p in price_data:
            existing = await session.execute(select(PriceRecord).where(PriceRecord.category == p["category"]))
            if not existing.scalars().first():
                rec = PriceRecord(
                    id=str(uuid.uuid4()),
                    category=p["category"],
                    category_name_hi=p["name_hi"],
                    category_name_en=p["name_en"],
                    base_rate_per_kg=p["base"],
                    min_rate_per_kg=p["min"],
                    max_rate_per_kg=p["max"],
                    cpcb_floor_price=p["cpcb_floor"],
                    trend=p["trend"],
                    trend_percentage=p["trend_pct"],
                    description=p["desc"]
                )
                session.add(rec)

                # Add price history
                for days_ago in range(7, 0, -1):
                    hist = PriceHistory(
                        id=str(uuid.uuid4()),
                        category=p["category"],
                        rate_per_kg=p["base"] + (days_ago % 3 - 1) * 3,
                        recorded_at=datetime.utcnow() - timedelta(days=days_ago)
                    )
                    session.add(hist)

        # 2. Seed Recyclers
        print("Seeding CPCB/SPCB Authorized Recycler Facilities...")
        existing_rec = await session.execute(select(User).where(User.email == "recycler@delhi-ewaste.gov.in"))
        if not existing_rec.scalars().first():
            rec_user1 = User(
                id=str(uuid.uuid4()),
                name="EcoRecycle Green Hub",
                email="recycler@delhi-ewaste.gov.in",
                phone="9811002233",
                hashed_password=get_password_hash("recycler123"),
                role="RECYCLER",
                language="hi"
            )
            session.add(rec_user1)
            await session.flush()

            facility1 = RecyclerFacility(
                id=str(uuid.uuid4()),
                user_id=rec_user1.id,
                facility_name="EcoRecycle North Delhi Hub",
                cpcb_reg_number="CPCB-REG-2026-DEL-089",
                spcb_noc_valid_until=datetime.utcnow() + timedelta(days=730),
                facility_type="DISMANTLER",
                address="Plot 42, Okhla Industrial Area Phase III",
                city="Delhi NCR",
                state="Delhi",
                pincode="110020",
                latitude=28.5355,
                longitude=77.2610,
                accepted_categories="PCB,CABLES,BATTERIES,CRT_TV,LCD_LED,MOTORS_MAGNETS,MIXED_PLASTICS",
                capacity_kg_per_day=10000.0,
                current_stock_kg=2450.0,
                phone="011-26987451",
                is_cpcb_verified=True,
                pickup_available=True
            )
            session.add(facility1)

            # Facility 2 User
            rec_user2 = User(
                id=str(uuid.uuid4()),
                name="GreenVolt Safe Battery Recovery",
                email="greenvolt@noida-recycling.in",
                phone="9811004455",
                hashed_password=get_password_hash("recycler123"),
                role="RECYCLER",
                language="hi"
            )
            session.add(rec_user2)
            await session.flush()

            facility2 = RecyclerFacility(
                id=str(uuid.uuid4()),
                user_id=rec_user2.id,
                facility_name="GreenVolt Safe Battery Recovery",
                cpcb_reg_number="CPCB-REG-2026-NOI-142",
                spcb_noc_valid_until=datetime.utcnow() + timedelta(days=365),
                facility_type="RECYCLER",
                address="Sector 63, Block B-12",
                city="Noida",
                state="Uttar Pradesh",
                pincode="201301",
                latitude=28.6280,
                longitude=77.3780,
                accepted_categories="BATTERIES,PCB,CABLES",
                capacity_kg_per_day=5000.0,
                current_stock_kg=1200.0,
                phone="0120-4567890",
                is_cpcb_verified=True,
                pickup_available=True
            )
            session.add(facility2)

        # 3. Seed Demo Collector
        print("Seeding Demo Collector Profile (Ramesh Kumar - 9876543210)...")
        existing_col = await session.execute(select(User).where(User.phone == "9876543210"))
        col_user = existing_col.scalars().first()
        if not col_user:
            col_user = User(
                id=str(uuid.uuid4()),
                name="रमेश कुमार (Ramesh)",
                phone="9876543210",
                pin_hash=get_password_hash("1234"),
                role="COLLECTOR",
                language="hi"
            )
            session.add(col_user)
            await session.flush()

            col_prof = CollectorProfile(
                id=str(uuid.uuid4()),
                user_id=col_user.id,
                badge_number="DL-KBD-04821",
                experience_years=8,
                vehicle_type="ई-रिक्शा (E-Rickshaw)",
                vehicle_reg_no="DL-1ER-4821",
                operating_city="Delhi NCR",
                current_latitude=28.6139,
                current_longitude=77.2090,
                total_kg_recycled=340.0,
                total_earnings=18500.0,
                rating=4.95,
                is_verified=True
            )
            session.add(col_prof)
            await session.flush()

            # Add demo lots
            demo_lot_id = str(uuid.uuid4())
            qr_tok = generate_handover_qr_token(demo_lot_id, col_prof.id)
            fall_code = generate_fallback_code(demo_lot_id)

            demo_lot = ScrapLot(
                id=demo_lot_id,
                collector_id=col_prof.id,
                category="PCB",
                condition="GOOD",
                weight_kg=15.5,
                unit_price=280.0,
                estimated_payout=4340.0,
                confidence_score=0.96,
                status="MATCHED",
                verification_status="AI_VERIFIED",
                latitude=28.6139,
                longitude=77.2090,
                location_name="Connaught Place, New Delhi",
                qr_token=qr_tok,
                fallback_code=fall_code,
                notes="Grade-A Green Motherboards collected from Nehru Place"
            )
            session.add(demo_lot)

            demo_photo = LotPhoto(
                id=str(uuid.uuid4()),
                lot_id=demo_lot.id,
                photo_url="https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
                photo_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                is_primary=True
            )
            session.add(demo_photo)

        await session.commit()
        print("\n[SUCCESS] Database initialization & seeding completed successfully!")
        print("Demo Credentials:")
        print("  - Collector Phone: 9876543210 (PIN: 1234 or instant OTP)")
        print("  - Recycler Email: recycler@delhi-ewaste.gov.in (Password: recycler123)")
        print("=" * 60)

if __name__ == "__main__":
    asyncio.run(setup_and_seed())
