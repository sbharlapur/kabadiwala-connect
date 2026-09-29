from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

# User & Auth
class CollectorLoginRequest(BaseModel):
    phone: str
    pin: Optional[str] = None
    otp: Optional[str] = None
    name: Optional[str] = "कबाड़ी मित्र"
    language: Optional[str] = "hi"

class RecyclerLoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    role: str
    language: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class CollectorProfileResponse(BaseModel):
    id: str
    user_id: str
    badge_number: str
    experience_years: Optional[int] = 1
    vehicle_type: Optional[str] = None
    vehicle_reg_no: Optional[str] = None
    is_verified: bool
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    operating_city: str
    upi_id: Optional[str] = None
    total_kg_recycled: float
    total_earnings: float
    rating: float

    class Config:
        from_attributes = True

class RecyclerFacilityResponse(BaseModel):
    id: str
    user_id: str
    facility_name: str
    cpcb_reg_number: str
    facility_type: str
    address: str
    city: str
    state: str
    pincode: str
    latitude: float
    longitude: float
    accepted_categories: List[str]
    capacity_kg_per_day: float
    current_stock_kg: float
    phone: str
    is_cpcb_verified: bool
    pickup_available: bool

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    profile: Optional[dict] = None

# Prices
class PriceRecordResponse(BaseModel):
    id: str
    category: str
    category_name_hi: str
    category_name_en: str
    base_rate_per_kg: float
    min_rate_per_kg: float
    max_rate_per_kg: float
    cpcb_floor_price: float
    trend: str
    trend_percentage: float
    unit: str
    last_updated: datetime

    class Config:
        from_attributes = True

# Lots
class CreateLotRequest(BaseModel):
    category: str
    condition: str = "GOOD"
    weight_kg: float = Field(gt=0, le=5000)
    unit_price: Optional[float] = None
    confidence_score: float = Field(ge=0, le=100, default=0.95)
    photo_urls: List[str] = []
    photo_hashes: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None
    client_uuid: Optional[str] = None
    matched_recycler_id: Optional[str] = None
    notes: Optional[str] = None

class ScrapLotResponse(BaseModel):
    id: str
    collector_id: str
    category: str
    condition: str
    weight_kg: float
    unit_price: float
    estimated_payout: float
    final_payout: Optional[float] = None
    confidence_score: float
    status: str
    verification_status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None
    client_uuid: Optional[str] = None
    matched_recycler_id: Optional[str] = None
    qr_token: Optional[str] = None
    fallback_code: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    photo_urls: List[str] = []

    class Config:
        from_attributes = True

# Match
class RecyclerMatchRequest(BaseModel):
    category: str
    weight_kg: float
    latitude: Optional[float] = 28.6139
    longitude: Optional[float] = 77.2090
    max_distance_km: Optional[float] = 25.0

class RecyclerMatchResult(BaseModel):
    facility: RecyclerFacilityResponse
    distance_km: float
    rate_per_kg: float
    estimated_gross_payout: float
    transport_subsidy: float
    net_payout: float
    pickup_available: bool
    match_rank: int

# Handover
class InitiateHandoverRequest(BaseModel):
    lot_id: str
    recycler_id: str

class VerifyHandoverRequest(BaseModel):
    qr_token: str
    fallback_code: Optional[str] = None
    actual_weight_kg: Optional[float] = None
    actual_condition: Optional[str] = None
    notes: Optional[str] = None

class HandoverTransactionResponse(BaseModel):
    id: str
    lot_id: str
    collector_id: str
    recycler_id: str
    category: str
    weight_kg: float
    unit_price: float
    total_payout: float
    status: str
    qr_token: str
    fallback_code: str
    tamper_check_passed: bool
    scanned_at: Optional[datetime] = None
    verified_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    notes: Optional[str] = None
    collector_name: Optional[str] = None
    recycler_name: Optional[str] = None

    class Config:
        from_attributes = True

# Ledger
class DailyLedgerSummary(BaseModel):
    date: str
    total_lots: int
    total_kg: float
    total_payout: float
    completed_handover_count: int

# AI & Anomaly
class AnomalyEvaluationRequest(BaseModel):
    category: str
    condition: str
    weight_kg: float
    unit_price: float
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class AnomalyEvaluationResponse(BaseModel):
    is_flagged: bool
    risk_level: str
    violations: List[str]
    explanation: str
