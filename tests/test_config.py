"""Tests for configuration management."""

import os
from unittest.mock import patch

from src.config import Settings, get_settings


def test_settings_defaults():
    """Test default configuration values."""
    settings = Settings()

    assert settings.app_name == "Decisify"
    assert settings.app_version == "0.1.0"
    assert settings.debug is False
    assert settings.host == "0.0.0.0"
    assert settings.port == 8000
    assert settings.cycle_interval == 5.0
    assert settings.log_level == "INFO"


def test_settings_from_env():
    """Test configuration loading from environment variables."""
    with patch.dict(os.environ, {
        "APP_NAME": "TestApp",
        "DEBUG": "true",
        "PORT": "9000",
        "LOG_LEVEL": "DEBUG",
        "CYCLE_INTERVAL": "2.5"
    }):
        settings = Settings()

        assert settings.app_name == "TestApp"
        assert settings.debug is True
        assert settings.port == 9000
        assert settings.log_level == "DEBUG"
        assert settings.cycle_interval == 2.5


def test_safety_gate_config():
    """Test safety gate configuration."""
    settings = Settings()

    assert settings.max_volatility_for_buy == 0.05
    assert settings.max_volatility_for_sell == 0.08
    assert settings.min_confidence_threshold == 0.15


def test_sensor_config():
    """Test sensor configuration."""
    settings = Settings()

    assert settings.sensor_timeout == 3.0
    assert settings.sensor_max_retries == 3
    assert settings.sensor_retry_delay == 0.5


def test_cors_origins_parsing():
    """Test CORS origins parsing from JSON string."""
    import json
    with patch.dict(os.environ, {
        "CORS_ORIGINS": json.dumps(["http://localhost:3000", "http://localhost:5173", "https://example.com"])
    }):
        settings = Settings()

        assert len(settings.cors_origins) == 3
        assert "http://localhost:3000" in settings.cors_origins
        assert "https://example.com" in settings.cors_origins


def test_get_settings_singleton():
    """Test that get_settings returns the same instance."""
    settings1 = get_settings()
    settings2 = get_settings()

    assert settings1 is settings2


def test_metrics_config():
    """Test metrics configuration."""
    settings = Settings()

    assert settings.enable_metrics is True
    assert settings.metrics_window_size == 100
