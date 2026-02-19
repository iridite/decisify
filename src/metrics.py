"""
Performance Metrics - Collect and track system performance indicators
"""

import time
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Optional


@dataclass
class MetricsCollector:
    """
    Collects and aggregates performance metrics for monitoring.
    Uses a sliding window to track recent performance.
    """

    window_size: int = 100

    # Decision cycle metrics
    decision_latencies: deque = field(default_factory=lambda: deque(maxlen=100))
    decision_count: int = 0

    # Sensor metrics
    sensor_failures: Dict[str, int] = field(default_factory=dict)
    sensor_latencies: Dict[str, deque] = field(default_factory=dict)
    sensor_success_count: Dict[str, int] = field(default_factory=dict)

    # Safety gate metrics
    safety_overrides: int = 0
    safety_passes: int = 0

    # API metrics
    api_request_count: int = 0
    api_latencies: deque = field(default_factory=lambda: deque(maxlen=100))

    def __post_init__(self):
        """Initialize deques with correct maxlen."""
        self.decision_latencies = deque(maxlen=self.window_size)
        self.api_latencies = deque(maxlen=self.window_size)

    def record_decision_latency(self, latency_ms: float) -> None:
        """Record a decision cycle latency."""
        self.decision_latencies.append(latency_ms)
        self.decision_count += 1

    def record_sensor_success(self, source: str, latency_ms: float) -> None:
        """Record a successful sensor fetch."""
        if source not in self.sensor_latencies:
            self.sensor_latencies[source] = deque(maxlen=self.window_size)
            self.sensor_success_count[source] = 0

        self.sensor_latencies[source].append(latency_ms)
        self.sensor_success_count[source] += 1

    def record_sensor_failure(self, source: str) -> None:
        """Record a sensor failure."""
        if source not in self.sensor_failures:
            self.sensor_failures[source] = 0
        self.sensor_failures[source] += 1

    def record_safety_override(self) -> None:
        """Record a safety gate override."""
        self.safety_overrides += 1

    def record_safety_pass(self) -> None:
        """Record a safety gate pass."""
        self.safety_passes += 1

    def record_api_request(self, latency_ms: float) -> None:
        """Record an API request."""
        self.api_latencies.append(latency_ms)
        self.api_request_count += 1

    def get_decision_stats(self) -> Dict[str, float]:
        """Get decision cycle statistics."""
        if not self.decision_latencies:
            return {"count": 0, "avg_latency_ms": 0.0, "max_latency_ms": 0.0, "min_latency_ms": 0.0}

        latencies = list(self.decision_latencies)
        return {
            "count": self.decision_count,
            "avg_latency_ms": sum(latencies) / len(latencies),
            "max_latency_ms": max(latencies),
            "min_latency_ms": min(latencies),
        }

    def get_sensor_stats(self) -> Dict[str, Dict]:
        """Get sensor statistics for all sources."""
        stats = {}
        for source in set(list(self.sensor_latencies.keys()) + list(self.sensor_failures.keys())):
            success_count = self.sensor_success_count.get(source, 0)
            failure_count = self.sensor_failures.get(source, 0)
            total = success_count + failure_count

            latencies = list(self.sensor_latencies.get(source, []))
            avg_latency = sum(latencies) / len(latencies) if latencies else 0.0

            stats[source] = {
                "success_count": success_count,
                "failure_count": failure_count,
                "success_rate": success_count / total if total > 0 else 0.0,
                "avg_latency_ms": avg_latency,
            }

        return stats

    def get_safety_stats(self) -> Dict[str, float]:
        """Get safety gate statistics."""
        total = self.safety_passes + self.safety_overrides
        return {
            "passes": self.safety_passes,
            "overrides": self.safety_overrides,
            "override_rate": self.safety_overrides / total if total > 0 else 0.0,
        }

    def get_api_stats(self) -> Dict[str, float]:
        """Get API statistics."""
        if not self.api_latencies:
            return {"request_count": self.api_request_count, "avg_latency_ms": 0.0}

        latencies = list(self.api_latencies)
        return {
            "request_count": self.api_request_count,
            "avg_latency_ms": sum(latencies) / len(latencies),
        }

    def get_all_stats(self) -> Dict:
        """Get all metrics in a single dictionary."""
        return {
            "decision": self.get_decision_stats(),
            "sensors": self.get_sensor_stats(),
            "safety": self.get_safety_stats(),
            "api": self.get_api_stats(),
            "timestamp": datetime.now().isoformat(),
        }


# Global metrics instance
metrics = MetricsCollector()


def get_metrics() -> MetricsCollector:
    """Get the global metrics collector instance."""
    return metrics


class Timer:
    """Context manager for timing operations."""

    def __init__(self):
        self.start_time: Optional[float] = None
        self.elapsed_ms: float = 0.0

    def __enter__(self):
        self.start_time = time.perf_counter()
        return self

    def __exit__(self, *args):
        if self.start_time is not None:
            self.elapsed_ms = (time.perf_counter() - self.start_time) * 1000
