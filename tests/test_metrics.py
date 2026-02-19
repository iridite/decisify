"""Tests for metrics collection."""

import pytest

from src.metrics import MetricsCollector, Timer


def test_metrics_collector_initialization():
    """Test metrics collector initialization."""
    collector = MetricsCollector(window_size=50)
    
    assert collector.window_size == 50
    assert len(collector.decision_latencies) == 0
    assert len(collector.get_sensor_stats()) == 0


def test_record_decision_latency():
    """Test recording decision latencies."""
    collector = MetricsCollector()
    
    collector.record_decision_latency(100)
    collector.record_decision_latency(150)
    collector.record_decision_latency(120)
    
    stats = collector.get_decision_stats()
    
    assert stats["count"] == 3
    assert stats["avg_latency_ms"] == pytest.approx(123.33, rel=0.01)
    assert stats["max_latency_ms"] == 150
    assert stats["min_latency_ms"] == 100


def test_decision_latency_window():
    """Test that decision latencies respect window size."""
    collector = MetricsCollector(window_size=3)
    
    collector.record_decision_latency(100)
    collector.record_decision_latency(200)
    collector.record_decision_latency(300)
    collector.record_decision_latency(400)  # Should push out 100
    
    stats = collector.get_decision_stats()
    
    # Count tracks total decisions, not window size
    assert stats["count"] == 4
    assert stats["min_latency_ms"] == 200
    assert stats["max_latency_ms"] == 400


def test_record_sensor_success():
    """Test recording sensor success."""
    collector = MetricsCollector()
    
    collector.record_sensor_success("twitter", latency_ms=50)
    collector.record_sensor_success("twitter", latency_ms=60)
    collector.record_sensor_failure("twitter")
    
    stats = collector.get_sensor_stats()
    
    assert "twitter" in stats
    assert stats["twitter"]["success_count"] == 2
    assert stats["twitter"]["failure_count"] == 1
    assert stats["twitter"]["success_rate"] == pytest.approx(0.667, rel=0.01)
    assert stats["twitter"]["avg_latency_ms"] == pytest.approx(55.0, rel=0.01)


def test_record_safety_gate():
    """Test recording safety gate results."""
    collector = MetricsCollector()
    
    collector.record_safety_pass()
    collector.record_safety_pass()
    collector.record_safety_override()
    
    stats = collector.get_safety_stats()
    
    assert stats["passes"] == 2
    assert stats["overrides"] == 1
    assert stats["override_rate"] == pytest.approx(0.333, rel=0.01)


def test_record_api_request():
    """Test recording API request latencies."""
    collector = MetricsCollector()
    
    collector.record_api_request(10)
    collector.record_api_request(20)
    collector.record_api_request(30)
    
    stats = collector.get_api_stats()
    
    assert stats["request_count"] == 3
    assert stats["avg_latency_ms"] == pytest.approx(20.0, rel=0.01)


def test_timer_context_manager():
    """Test Timer context manager."""
    import time
    
    timer = Timer()
    
    with timer:
        time.sleep(0.01)  # Sleep for 10ms
    
    assert timer.elapsed_ms >= 10  # At least 10ms


def test_get_all_metrics():
    """Test getting all metrics at once."""
    collector = MetricsCollector()
    
    collector.record_decision_latency(100)
    collector.record_sensor_success("twitter", latency_ms=50)
    collector.record_safety_pass()
    collector.record_api_request(10)
    
    metrics = collector.get_all_stats()
    
    assert "decision" in metrics
    assert "sensors" in metrics
    assert "safety" in metrics
    assert "api" in metrics
    assert "timestamp" in metrics


def test_empty_metrics():
    """Test metrics with no data."""
    collector = MetricsCollector()
    
    decision_stats = collector.get_decision_stats()
    assert decision_stats["count"] == 0
    assert decision_stats["avg_latency_ms"] == 0
    
    sensor_stats = collector.get_sensor_stats()
    assert len(sensor_stats) == 0
    
    safety_stats = collector.get_safety_stats()
    assert safety_stats["passes"] == 0
    assert safety_stats["overrides"] == 0


def test_multiple_sensors():
    """Test tracking multiple sensors."""
    collector = MetricsCollector()
    
    collector.record_sensor_success("twitter", latency_ms=50)
    collector.record_sensor_success("market", latency_ms=30)
    collector.record_sensor_failure("news")
    
    stats = collector.get_sensor_stats()
    
    assert len(stats) == 3
    assert "twitter" in stats
    assert "market" in stats
    assert "news" in stats
    assert stats["news"]["success_rate"] == 0.0
