from typing import Dict, Any, List, Tuple
from app.services.valuation import CATEGORY_BASE_RATES

# Typical single-batch weight bounds (kg)
TYPICAL_WEIGHT_RANGES = {
    "PCB": (0.1, 80.0),
    "CABLES": (0.5, 200.0),
    "BATTERIES": (1.0, 300.0),
    "CRT_TV": (5.0, 150.0),
    "LCD_LED": (2.0, 100.0),
    "MOTORS_MAGNETS": (1.0, 250.0),
    "MIXED_PLASTICS": (1.0, 500.0)
}

def detect_lot_anomalies(lot_data: Dict[str, Any]) -> Tuple[bool, str, List[str], str]:
    """
    Evaluates scrap lot for fraud, tampering, or misclassification:
    Returns (is_flagged, risk_level, violations, explanation)
    """
    violations = []
    category = lot_data.get("category", "").upper()
    weight = float(lot_data.get("weight_kg", 0))
    unit_price = float(lot_data.get("unit_price", 0))

    # 1. Weight Outlier Check
    if category in TYPICAL_WEIGHT_RANGES:
        min_w, max_w = TYPICAL_WEIGHT_RANGES[category]
        if weight > max_w * 2:
            violations.append(f"Excessive Weight: {weight}kg exceeds 2x typical threshold ({max_w}kg) for category {category}")
        elif weight < min_w:
            violations.append(f"Sub-minimum Weight: {weight}kg is suspiciously low for category {category}")

    # 2. Price Deviation Check
    expected_base = CATEGORY_BASE_RATES.get(category, 50.0)
    if unit_price > expected_base * 1.5:
        violations.append(f"Price Inflation: ₹{unit_price}/kg is >50% above CPCB benchmark ₹{expected_base}/kg")
    elif unit_price < expected_base * 0.4:
        violations.append(f"Price Deflation: ₹{unit_price}/kg is >60% below baseline ₹{expected_base}/kg")

    # 3. Hazardous Battery Burnt Condition Flag
    condition = lot_data.get("condition", "GOOD").upper()
    if category == "BATTERIES" and condition == "BURNT":
        violations.append("Hazard Alert: Burnt lead/lithium battery indicates active electrolyte breach or thermal runaway hazard")

    if not violations:
        return False, "LOW", [], "No anomaly detected. Compliant with CPCB standard metrics."

    # Determine risk level
    if any("Hazard" in v or "Excessive Weight" in v for v in violations):
        risk_level = "HIGH"
    elif len(violations) > 1:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    explanation = f"Flagged with {len(violations)} rule check(s): " + "; ".join(violations)
    return True, risk_level, violations, explanation
