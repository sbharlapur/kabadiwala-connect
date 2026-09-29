import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, Boolean, Integer
from sqlalchemy.orm import relationship
from app.db.session import Base

class ScrapLot(Base):
    __tablename__ = "scrap_lots"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    collector_id = Column(String(36), ForeignKey("collector_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False) # PCB, CABLES, BATTERIES, CRT_TV, LCD_LED, MOTORS_MAGNETS, MIXED_PLASTICS
    condition = Column(String(20), default="GOOD") # GOOD, BROKEN, BURNT
    weight_kg = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    estimated_payout = Column(Float, nullable=False)
    final_payout = Column(Float, nullable=True)
    confidence_score = Column(Float, default=0.95)
    status = Column(String(30), default="PENDING") # PENDING, MATCHED, IN_TRANSIT, VERIFIED, COMPLETED, REJECTED, FLAGGED_ANOMALY
    verification_status = Column(String(30), default="AI_VERIFIED") # UNVERIFIED, AI_VERIFIED, PHYSICAL_CONFIRMED, ANOMALY_DETECTED
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_name = Column(String(200), nullable=True)
    client_uuid = Column(String(100), nullable=True, unique=True, index=True)
    matched_recycler_id = Column(String(36), ForeignKey("recycler_facilities.id", ondelete="SET NULL"), nullable=True)
    qr_token = Column(String(100), nullable=True, index=True)
    fallback_code = Column(String(10), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    collector = relationship("CollectorProfile", back_populates="lots")
    matched_recycler = relationship("RecyclerFacility", foreign_keys=[matched_recycler_id])
    photos = relationship("LotPhoto", back_populates="lot", cascade="all, delete-orphan")
    handovers = relationship("HandoverTransaction", back_populates="lot")
    anomalies = relationship("AnomalyReport", back_populates="lot")

class LotPhoto(Base):
    __tablename__ = "lot_photos"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lot_id = Column(String(36), ForeignKey("scrap_lots.id", ondelete="CASCADE"), nullable=False, index=True)
    photo_url = Column(Text, nullable=False)
    photo_hash = Column(String(64), nullable=True) # SHA-256 hash for anti-tamper
    is_primary = Column(Boolean, default=False)
    captured_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    lot = relationship("ScrapLot", back_populates="photos")
