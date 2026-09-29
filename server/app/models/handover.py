import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.session import Base

class HandoverTransaction(Base):
    __tablename__ = "handover_transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lot_id = Column(String(36), ForeignKey("scrap_lots.id", ondelete="CASCADE"), nullable=False, index=True)
    collector_id = Column(String(36), ForeignKey("collector_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    recycler_id = Column(String(36), ForeignKey("recycler_facilities.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(50), nullable=False)
    weight_kg = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_payout = Column(Float, nullable=False)
    status = Column(String(30), default="PENDING") # PENDING, MATCHED, IN_TRANSIT, VERIFIED, COMPLETED, REJECTED, FLAGGED_ANOMALY
    qr_token = Column(String(100), nullable=False, index=True)
    fallback_code = Column(String(10), nullable=False)
    tamper_check_passed = Column(Boolean, default=True)
    scanned_at = Column(DateTime, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    lot = relationship("ScrapLot", back_populates="handovers")
    recycler = relationship("RecyclerFacility", back_populates="handovers")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    entity_type = Column(String(50), nullable=False) # LOT, HANDOVER, USER, PRICE
    entity_id = Column(String(36), nullable=False, index=True)
    action = Column(String(50), nullable=False) # CREATE, UPDATE, VERIFY, COMPLETE, FLAG_ANOMALY
    actor_id = Column(String(36), nullable=True)
    actor_role = Column(String(20), nullable=True)
    old_state = Column(Text, nullable=True)
    new_state = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
