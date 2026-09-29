import hmac
import hashlib
import time
import bcrypt
from datetime import datetime, timedelta
from typing import Optional, Any, Union
from jose import jwt
from .config import settings

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def create_access_token(subject: Union[str, Any], role: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "iat": datetime.utcnow()
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None

def generate_handover_qr_token(lot_id: str, collector_id: str, timestamp: Optional[int] = None) -> str:
    ts = timestamp or int(time.time())
    message = f"{lot_id}:{collector_id}:{ts}"
    sig = hmac.new(settings.QR_HMAC_SECRET.encode(), message.encode(), hashlib.sha256).hexdigest()[:16]
    return f"KC:{lot_id[:8]}:{ts}:{sig}"

def generate_fallback_code(lot_id: str) -> str:
    raw = hmac.new(settings.QR_HMAC_SECRET.encode(), lot_id.encode(), hashlib.sha256).hexdigest()
    digits = "".join(c for c in raw if c.isdigit())
    return (digits[:4] if len(digits) >= 4 else "7429")

def compute_sha256_hash(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()
