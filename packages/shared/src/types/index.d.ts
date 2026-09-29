export type UserRole = 'COLLECTOR' | 'RECYCLER' | 'ADMIN';
export type MaterialCategory = 'PCB' | 'CABLES' | 'BATTERIES' | 'CRT_TV' | 'LCD_LED' | 'MOTORS_MAGNETS' | 'MIXED_PLASTICS';
export type ConditionGrade = 'GOOD' | 'BROKEN' | 'BURNT';
export type HandoverStatus = 'DRAFT' | 'PENDING' | 'MATCHED' | 'IN_TRANSIT' | 'VERIFIED' | 'COMPLETED' | 'REJECTED' | 'FLAGGED_ANOMALY';
export type VerificationStatus = 'UNVERIFIED' | 'AI_VERIFIED' | 'PHYSICAL_CONFIRMED' | 'ANOMALY_DETECTED';
export type AnomalyRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export interface User {
    id: string;
    phone: string;
    name: string;
    role: UserRole;
    language: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export interface CollectorProfile {
    id: string;
    user_id: string;
    experience_years?: number;
    vehicle_type?: string;
    vehicle_reg_no?: string;
    badge_number: string;
    is_verified: boolean;
    current_latitude?: number;
    current_longitude?: number;
    operating_city: string;
    upi_id?: string;
    total_kg_recycled: number;
    total_earnings: number;
    rating: number;
}
export interface RecyclerFacility {
    id: string;
    user_id: string;
    facility_name: string;
    cpcb_reg_number: string;
    spcb_noc_valid_until?: string;
    facility_type: 'COLLECTION_POINT' | 'DISMANTLER' | 'RECYCLER' | 'PRO';
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    accepted_categories: MaterialCategory[];
    capacity_kg_per_day: number;
    current_stock_kg: number;
    phone: string;
    is_cpcb_verified: boolean;
    distance_km?: number;
    pickup_available?: boolean;
}
export interface PriceRecord {
    id: string;
    category: MaterialCategory;
    category_name_hi: string;
    category_name_en: string;
    base_rate_per_kg: number;
    min_rate_per_kg: number;
    max_rate_per_kg: number;
    cpcb_floor_price: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
    trend_percentage: number;
    last_updated: string;
    unit: string;
}
export interface ScrapLot {
    id: string;
    collector_id: string;
    category: MaterialCategory;
    condition: ConditionGrade;
    weight_kg: number;
    unit_price: number;
    estimated_payout: number;
    final_payout?: number;
    confidence_score: number;
    photo_urls: string[];
    photo_hashes: string[];
    status: HandoverStatus;
    verification_status: VerificationStatus;
    latitude?: number;
    longitude?: number;
    location_name?: string;
    created_at: string;
    updated_at: string;
    offline_created?: boolean;
    client_uuid?: string;
    matched_recycler_id?: string;
    matched_recycler?: RecyclerFacility;
    qr_token?: string;
    fallback_code?: string;
    notes?: string;
}
export interface HandoverTransaction {
    id: string;
    lot_id: string;
    collector_id: string;
    recycler_id: string;
    category: MaterialCategory;
    weight_kg: number;
    unit_price: number;
    total_payout: number;
    status: HandoverStatus;
    qr_token: string;
    fallback_code: string;
    scanned_at?: string;
    verified_at?: string;
    completed_at?: string;
    created_at: string;
    notes?: string;
    tamper_check_passed: boolean;
    collector_name?: string;
    recycler_name?: string;
}
export interface AnomalyReport {
    id: string;
    lot_id: string;
    risk_level: AnomalyRiskLevel;
    rule_violation: string;
    details: string;
    created_at: string;
    is_resolved: boolean;
}
export interface DailyLedgerSummary {
    date: string;
    total_lots: number;
    total_kg: number;
    total_payout: number;
    completed_handover_count: number;
}
