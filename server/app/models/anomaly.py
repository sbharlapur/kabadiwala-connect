import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.session import Base

class AnomalyReport(Base):
    __tablename__ = "anomaly_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lot_id = Column(String(36), ForeignKey("scrap_lots.id", ondelete="CASCADE"), nullable=False, index=True)
    risk_level = Column(String(20), default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    rule_violation = Column(String(100), nullable=False)
    details = Column(Text, nullable=False)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationship
    lot = relationship("ScrapLot", back_populates="anomalies")
