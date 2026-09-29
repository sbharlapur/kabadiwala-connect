import hmac
import hashlib
import time
from typing import Tuple, Optional
from app.core.config import settings

def generate_handover_token(lot_id: str, collector_id: str) -> Tuple[str, str]:
    """
    Generate dynamic HMAC QR token and 4-digit numeric fallback code.
    Format: KC:{lot_prefix}:{timestamp}:{signature_16}
    """
    ts = int(time.time())
    message = f"{lot_id}:{collector_id}:{ts}"
    signature = hmac.new(
        settings.QR_HMAC_SECRET.encode(),
        message.encode(),
        hashlib.sha256
    ).hexdigest()[:16]

    qr_token = f"KC:{lot_id[:8]}:{ts}:{signature}"

    # Fallback 4-digit code
    raw_hash = hmac.new(settings.QR_HMAC_SECRET.encode(), lot_id.encode(), hashlib.sha256).hexdigest()
    digits = "".join(c for c in raw_hash if c.isdigit())
    fallback_code = digits[:4] if len(digits) >= 4 else "9142"

    return qr_token, fallback_code

def verify_handover_token(qr_token: str, lot_id: str, collector_id: str) -> bool:
    """
    Verify HMAC signature from scanned QR code.
    """
    try:
        parts = qr_token.split(":")
        if len(parts) != 4 or parts[0] != "KC":
            return False

        lot_prefix, ts_str, signature = parts[1], parts[2], parts[3]
        if not lot_id.startswith(lot_prefix):
            return False

        ts = int(ts_str)
        message = f"{lot_id}:{collector_id}:{ts}"
        expected_sig = hmac.new(
            settings.QR_HMAC_SECRET.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()[:16]

        return hmac.compare_digest(signature, expected_sig)
    except Exception:
        return False
