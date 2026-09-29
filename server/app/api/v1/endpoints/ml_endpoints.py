from fastapi import APIRouter, Depends, UploadFile, File
from app.schemas.all_schemas import AnomalyEvaluationRequest, AnomalyEvaluationResponse
from app.services.anomaly_detector import detect_lot_anomalies

router = APIRouter(prefix="/ml", tags=["ML Engine"])

@router.post("/evaluate-anomaly", response_model=AnomalyEvaluationResponse)
async def evaluate_anomaly(req: AnomalyEvaluationRequest):
    is_anomaly, risk_level, violations, explanation = detect_lot_anomalies({
        "category": req.category,
        "condition": req.condition,
        "weight_kg": req.weight_kg,
        "unit_price": req.unit_price
    })

    return AnomalyEvaluationResponse(
        is_flagged=is_anomaly,
        risk_level=risk_level,
        violations=violations,
        explanation=explanation
    )

@router.post("/classify-image")
async def classify_image(file: UploadFile = File(None)):
    """
    Mock / Edge model endpoint for 7-class e-waste recognition:
    Returns predicted category, confidence score, and regional terminology.
    """
    # High-confidence default based on visual feature simulation
    return {
        "category": "PCB",
        "category_name_hi": "सर्किट बोर्ड",
        "category_name_en": "Printed Circuit Board (PCB)",
        "confidence_score": 0.96,
        "hazard_flag": False,
        "suggested_rate_per_kg": 280.0
    }
