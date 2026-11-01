"""Configuration management for ORCHESTRA backend."""

import os
from functools import lru_cache
from typing import List
try:
    from pydantic_settings import BaseSettings
except ImportError:
    class BaseSettings:
        pass


class Settings:
    """Application configuration settings."""

    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "t")
    PROJECT_NAME: str = "ORCHESTRA — AI Business Operations Platform"
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./orchestra.db",
    )
    DATABASE_POOL_SIZE: int = int(os.getenv("DATABASE_POOL_SIZE", "10"))
    DATABASE_MAX_OVERFLOW: int = int(os.getenv("DATABASE_MAX_OVERFLOW", "20"))
    DATABASE_ECHO: bool = os.getenv("DATABASE_ECHO", "false").lower() in ("true", "1", "t")

    # Security & OIDC Auth
    OIDC_ISSUER_URL: str = os.getenv("OIDC_ISSUER_URL", "https://auth.orchestra.internal")
    OIDC_AUDIENCE: str = os.getenv("OIDC_AUDIENCE", "orchestra-api")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "RS256")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "dev-insecure-secret-key-change-in-prod-32-chars")
    TOKEN_EXPIRE_MINUTES: int = int(os.getenv("TOKEN_EXPIRE_MINUTES", "1440"))

    # Temporal
    TEMPORAL_HOST: str = os.getenv("TEMPORAL_HOST", "localhost:7233")
    TEMPORAL_NAMESPACE: str = os.getenv("TEMPORAL_NAMESPACE", "orchestra-default")
    TEMPORAL_TASK_QUEUE: str = os.getenv("TEMPORAL_TASK_QUEUE", "orchestra-workflow-queue")

    # CORS
    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173",
        ).split(",")
        if origin.strip()
    ]

    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    JSON_LOGS: bool = os.getenv("JSON_LOGS", "true").lower() in ("true", "1", "t")


@lru_cache()
def get_settings() -> Settings:
    """Return cached application settings."""
    return Settings()
