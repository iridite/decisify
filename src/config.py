"""
Configuration Management - Centralized settings with environment variable support
"""

import os
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings with environment variable support.
    Values can be overridden via .env file or environment variables.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    app_name: str = "Decisify"
    app_version: str = "0.1.0"
    debug: bool = Field(default=False, validation_alias="DEBUG")

    # Server
    host: str = Field(default="0.0.0.0", validation_alias="HOST")
    port: int = Field(default=8000, validation_alias="PORT")
    reload: bool = Field(default=False, validation_alias="RELOAD")

    # Agent Orchestrator
    cycle_interval: float = Field(default=5.0, validation_alias="CYCLE_INTERVAL")
    agent_temperature: float = Field(default=1.0, validation_alias="AGENT_TEMPERATURE")

    # Safety Gate
    max_volatility_for_buy: float = Field(default=0.05, validation_alias="MAX_VOLATILITY_BUY")
    max_volatility_for_sell: float = Field(default=0.08, validation_alias="MAX_VOLATILITY_SELL")
    min_confidence_threshold: float = Field(default=0.15, validation_alias="MIN_CONFIDENCE")

    # Sensors
    sensor_timeout: float = Field(default=3.0, validation_alias="SENSOR_TIMEOUT")
    sensor_max_retries: int = Field(default=3, validation_alias="SENSOR_MAX_RETRIES")
    sensor_retry_delay: float = Field(default=0.5, validation_alias="SENSOR_RETRY_DELAY")

    # Logging
    log_level: str = Field(default="INFO", validation_alias="LOG_LEVEL")
    log_file: Optional[str] = Field(default=None, validation_alias="LOG_FILE")
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        validation_alias="LOG_FORMAT",
    )

    # CORS
    cors_origins: list[str] = Field(
        default=["http://localhost:5173", "http://localhost:3000", "https://iridite.github.io"],
        validation_alias="CORS_ORIGINS",
    )

    # API Rate Limiting
    rate_limit_enabled: bool = Field(default=True, validation_alias="RATE_LIMIT_ENABLED")
    rate_limit_requests: int = Field(default=100, validation_alias="RATE_LIMIT_REQUESTS")
    rate_limit_window: int = Field(default=60, validation_alias="RATE_LIMIT_WINDOW")

    # Performance Monitoring
    enable_metrics: bool = Field(default=True, validation_alias="ENABLE_METRICS")
    metrics_window_size: int = Field(default=100, validation_alias="METRICS_WINDOW_SIZE")


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """
    Dependency injection function for FastAPI.
    Returns the global settings instance.
    """
    return settings
