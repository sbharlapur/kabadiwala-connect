from typing import Dict, Tuple

CONDITION_MULTIPLIERS: Dict[str, float] = {
    "GOOD": 1.00,    # 100% full recovery value
    "BROKEN": 0.85,  # 85% partial recovery value
    "BURNT": 0.65    # 65% thermal damage / contamination risk discount
}

CATEGORY_BASE_RATES: Dict[str, float] = {
    "PCB": 280.0,            # High-grade printed circuit board (₹/kg)
    "CABLES": 450.0,         # Copper insulated / stripped cables
    "BATTERIES": 95.0,       # Lead-acid / Li-ion battery scrap
    "CRT_TV": 35.0,          # Cathode ray tube display unit
    "LCD_LED": 120.0,        # Flat panel screen assemblies
    "MOTORS_MAGNETS": 85.0,  # Compressor motors / neodymium magnets
    "MIXED_PLASTICS": 28.0   # Flame-retardant ABS / HIPS casing
}

def calculate_lot_valuation(
    category: str,
    weight_kg: float,
    condition: str = "GOOD",
    custom_base_rate: float = None
) -> Tuple[float, float, float]:
    """
    Calculate valuation:
    Returns (unit_price_per_kg, estimated_payout, condition_multiplier)
    """
    base_rate = custom_base_rate or CATEGORY_BASE_RATES.get(category.upper(), 50.0)
    multiplier = CONDITION_MULTIPLIERS.get(condition.upper(), 1.00)

    effective_unit_price = round(base_rate * multiplier, 2)
    estimated_payout = round(effective_unit_price * weight_kg, 2)

    return effective_unit_price, estimated_payout, multiplier
