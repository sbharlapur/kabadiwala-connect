import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Float, DateTime, ForeignKey, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = Column(String(20), unique=True, index=True, nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=True)
    pin_hash = Column(String(255), nullable=True)
    name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False, default="COLLECTOR") # COLLECTOR, RECYCLER, ADMIN
    language = Column(String(10), default="hi")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    collector_profile = relationship("CollectorProfile", back_populates="user", uselist=False)
    recycler_facility = relationship("RecyclerFacility", back_populates="user", uselist=False)

class CollectorProfile(Base):
    __tablename__ = "collector_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    experience_years = Column(Integer, default=1)
    vehicle_type = Column(String(50), default="Cycle-Cart / रिक्शा")
    vehicle_reg_no = Column(String(50), nullable=True)
    badge_number = Column(String(50), unique=True, nullable=False)
    is_verified = Column(Boolean, default=True)
    current_latitude = Column(Float, nullable=True, default=28.6139)
    current_longitude = Column(Float, nullable=True, default=77.2090)
    operating_city = Column(String(100), default="Delhi NCR")
    upi_id = Column(String(100), nullable=True)
    total_kg_recycled = Column(Float, default=0.0)
    total_earnings = Column(Float, default=0.0)
    rating = Column(Float, default=4.9)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="collector_profile")
    lots = relationship("ScrapLot", back_populates="collector")

class RecyclerFacility(Base):
    __tablename__ = "recycler_facilities"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    facility_name = Column(String(150), nullable=False)
    cpcb_reg_number = Column(String(100), unique=True, nullable=False, index=True)
    spcb_noc_valid_until = Column(DateTime, nullable=True)
    facility_type = Column(String(50), default="DISMANTLER") # COLLECTION_POINT, DISMANTLER, RECYCLER, PRO
    address = Column(Text, nullable=False)
    city = Column(String(100), default="Delhi NCR")
    state = Column(String(100), default="Delhi")
    pincode = Column(String(20), default="110020")
    latitude = Column(Float, nullable=False, default=28.5355)
    longitude = Column(Float, nullable=False, default=77.2610)
    accepted_categories = Column(Text, default="PCB,CABLES,BATTERIES,CRT_TV,LCD_LED,MOTORS_MAGNETS,MIXED_PLASTICS")
    capacity_kg_per_day = Column(Float, default=5000.0)
    current_stock_kg = Column(Float, default=1200.0)
    phone = Column(String(20), nullable=False)
    is_cpcb_verified = Column(Boolean, default=True)
    pickup_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="recycler_facility")
    handovers = relationship("HandoverTransaction", back_populates="recycler")
