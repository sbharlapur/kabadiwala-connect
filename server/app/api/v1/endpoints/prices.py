import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.db.session import get_db
from app.models.price import PriceRecord, PriceHistory
from app.schemas.all_schemas import PriceRecordResponse

router = APIRouter(prefix="/prices", tags=["Prices"])

DEFAULT_PRICES = [
    {
        "category": "PCB",
        "category_name_hi": "सर्किट बोर्ड",
        "category_name_en": "Printed Circuit Boards (PCB)",
        "base_rate_per_kg": 410.0,
        "min_rate_per_kg": 350.0,
        "max_rate_per_kg": 480.0,
        "cpcb_floor_price": 280.0,
        "trend": "UP",
        "trend_percentage": 4.8
    },
    {
        "category": "BATTERIES",
        "category_name_hi": "लिथियम / लेड बैटरी",
        "category_name_en": "Li-Ion & Lead Acid Batteries",
        "base_rate_per_kg": 185.0,
        "min_rate_per_kg": 160.0,
        "max_rate_per_kg": 220.0,
        "cpcb_floor_price": 140.0,
        "trend": "UP",
        "trend_percentage": 2.5
    },
    {
        "category": "CABLES",
        "category_name_hi": "तांबे के तार",
        "category_name_en": "Copper Wiring & Cables",
        "base_rate_per_kg": 290.0,
        "min_rate_per_kg": 260.0,
        "max_rate_per_kg": 330.0,
        "cpcb_floor_price": 220.0,
        "trend": "STABLE",
        "trend_percentage": 0.0
    },
    {
        "category": "CRT_TV",
        "category_name_hi": "पुराना टीवी / सीआरटी",
        "category_name_en": "CRT Monitors & TV Glass",
        "base_rate_per_kg": 45.0,
        "min_rate_per_kg": 35.0,
        "max_rate_per_kg": 60.0,
        "cpcb_floor_price": 30.0,
        "trend": "DOWN",
        "trend_percentage": -1.2
    },
    {
        "category": "LCD_LED",
        "category_name_hi": "एलसीडी / एलईडी डिस्प्ले",
        "category_name_en": "LCD & LED Screen Panels",
        "base_rate_per_kg": 140.0,
        "min_rate_per_kg": 110.0,
        "max_rate_per_kg": 175.0,
        "cpcb_floor_price": 95.0,
        "trend": "UP",
        "trend_percentage": 3.1
    },
    {
        "category": "MOTORS_MAGNETS",
        "category_name_hi": "मोटर व चुंबक",
        "category_name_en": "Motors, Compressors & Magnets",
        "base_rate_per_kg": 210.0,
        "min_rate_per_kg": 180.0,
        "max_rate_per_kg": 240.0,
        "cpcb_floor_price": 160.0,
        "trend": "STABLE",
        "trend_percentage": 0.5
    },
    {
        "category": "MIXED_PLASTICS",
        "category_name_hi": "कठोर प्लास्टिक",
        "category_name_en": "E-Waste Hard Plastics (ABS/HIPS)",
        "base_rate_per_kg": 35.0,
        "min_rate_per_kg": 25.0,
        "max_rate_per_kg": 48.0,
        "cpcb_floor_price": 20.0,
        "trend": "STABLE",
        "trend_percentage": 0.0
    }
]

@router.get("", response_model=List[PriceRecordResponse])
async def list_prices(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PriceRecord).order_by(PriceRecord.category))
    records = result.scalars().all()

    if not records:
        # Seed default prices
        for item in DEFAULT_PRICES:
            record = PriceRecord(
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
            db.add(record)
        await db.commit()
        result = await db.execute(select(PriceRecord).order_by(PriceRecord.category))
        records = result.scalars().all()

    return records

@router.get("/{category}", response_model=PriceRecordResponse)
async def get_price_by_category(category: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PriceRecord).where(PriceRecord.category == category.upper()))
    record = result.scalars().first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Price record for '{category}' not found")
    return record

@router.get("/{category}/history")
async def get_price_history(category: str, limit: int = 30, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PriceHistory)
        .where(PriceHistory.category == category.upper())
        .order_by(desc(PriceHistory.recorded_at))
        .limit(limit)
    )
    history = result.scalars().all()
    return [
        {"rate_per_kg": h.rate_per_kg, "recorded_at": h.recorded_at.isoformat()}
        for h in reversed(history)
    ]
