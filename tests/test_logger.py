"""Tests for logger module."""

import logging
import tempfile
from pathlib import Path

import pytest

from src.logger import setup_logger


def test_setup_logger_default():
    """Test logger setup with default settings."""
    logger = setup_logger("test_logger")

    assert logger.name == "test_logger"
    assert logger.level == logging.INFO
    assert len(logger.handlers) > 0


def test_setup_logger_custom_level():
    """Test logger with custom log level."""
    logger = setup_logger("test_debug", level="DEBUG")

    assert logger.level == logging.DEBUG


def test_setup_logger_with_file():
    """Test logger with file output."""
    with tempfile.TemporaryDirectory() as tmpdir:
        log_file = Path(tmpdir) / "test.log"

        logger = setup_logger("test_file", log_file=str(log_file))
        logger.info("Test message")

        assert log_file.exists()
        content = log_file.read_text()
        assert "Test message" in content


def test_logger_levels():
    """Test different log levels."""
    logger = setup_logger("test_levels", level="DEBUG")

    # Should not raise any exceptions
    logger.debug("Debug message")
    logger.info("Info message")
    logger.warning("Warning message")
    logger.error("Error message")
    logger.critical("Critical message")


def test_logger_singleton():
    """Test that same logger name returns same instance."""
    logger1 = setup_logger("singleton_test")
    logger2 = setup_logger("singleton_test")

    assert logger1 is logger2


def test_logger_format():
    """Test logger output format."""
    with tempfile.TemporaryDirectory() as tmpdir:
        log_file = Path(tmpdir) / "format_test.log"

        logger = setup_logger("format_test", log_file=str(log_file))
        logger.info("Format test message")

        content = log_file.read_text()

        # Check format includes timestamp, name, level, message
        assert "format_test" in content
        assert "INFO" in content
        assert "Format test message" in content


def test_invalid_log_level():
    """Test handling of invalid log level."""
    # Should raise AttributeError for invalid level
    with pytest.raises(AttributeError):
        _ = setup_logger("invalid_level", level="INVALID")
