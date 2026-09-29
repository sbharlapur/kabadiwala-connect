import os
import secrets
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Kabadiwala Connect API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Database URL - default to SQLite for zero-setup local dev/test or PostgreSQL if configured
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite+aiosqlite:///./kabadiwala.db"
    )

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY") or secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    QR_HMAC_SECRET: str = os.getenv("QR_HMAC_SECRET") or secrets.token_urlsafe(32)

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "*"
    ]

    # Economics & Logistics
    TRANSPORT_SUBSIDY_PER_KM: float = 3.50  # Rs 3.5 per km green mobility subsidy
    MAX_MATCH_RADIUS_KM: float = 25.0
    CPCB_COMPLIANCE_BONUS_PERCENT: float = 5.0  # 5% bonus for certified CPCB channel

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
