import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Text, Enum as SQLEnum
from app.db.session import Base

class PriceRecord(Base):
    __tablename__ = "price_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category = Column(String(50), unique=True, index=True, nullable=False)
    category_name_hi = Column(String(100), nullable=False)
    category_name_en = Column(String(100), nullable=False)
    base_rate_per_kg = Column(Float, nullable=False)
    min_rate_per_kg = Column(Float, nullable=False)
    max_rate_per_kg = Column(Float, nullable=False)
    cpcb_floor_price = Column(Float, nullable=False)
    trend = Column(String(20), default="STABLE") # UP, DOWN, STABLE
    trend_percentage = Column(Float, default=0.0)
    unit = Column(String(20), default="₹ / kg")
    description = Column(Text, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PriceHistory(Base):
    __tablename__ = "price_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category = Column(String(50), index=True, nullable=False)
    rate_per_kg = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow, index=True)
