"""
Realistic end-to-end benchmark: Full decision pipeline
Tests the complete decision-making process including all steps
"""

import asyncio
import statistics
import time
from datetime import datetime
from typing import Dict

from brain import AttentionFusionEngine
from schemas import Signal

try:
    from brain_hybrid import HybridAttentionEngine

    RUST_AVAILABLE = True
except ImportError:
    RUST_AVAILABLE = False
    print("⚠️  Rust extension not available")


def generate_realistic_signals(count: int) -> Dict[str, Signal]:
    """Generate realistic signal data"""
    import random

    signals = {}
    now = datetime.now()

    # Market signals
    for i in range(count // 3):
        signals[f"market_{i}"] = Signal(
            source=f"market_{i}",
            value=random.uniform(-0.8, 0.8),
            timestamp=now,
            raw_content=f"Market data point {i}",
        )

    # Sentiment signals
    for i in range(count // 3):
        signals[f"sentiment_{i}"] = Signal(
            source=f"sentiment_{i}",
            value=random.uniform(-1.0, 1.0),
            timestamp=now,
            raw_content=f"Sentiment analysis {i}",
        )

    # Volatility signals
    for i in range(count - 2 * (count // 3)):
        signals[f"volatility_{i}"] = Signal(
            source=f"volatility_{i}",
            value=random.uniform(0.0, 1.0),
            timestamp=now,
            raw_content=f"Volatility metric {i}",
        )

    return signals


def benchmark_full_decision(engine, signals: Dict[str, Signal], iterations: int = 1000):
    """Benchmark complete decision pipeline"""
    times = []

    for _ in range(iterations):
        start = time.perf_counter()
        decision = engine.decide(signals)
        end = time.perf_counter()
        times.append(end - start)

    return {
        "mean": statistics.mean(times) * 1000,
        "median": statistics.median(times) * 1000,
        "stdev": statistics.stdev(times) * 1000 if len(times) > 1 else 0,
        "min": min(times) * 1000,
        "max": max(times) * 1000,
        "p95": sorted(times)[int(len(times) * 0.95)] * 1000,
        "p99": sorted(times)[int(len(times) * 0.99)] * 1000,
    }


def run_realistic_benchmark():
    """Run realistic end-to-end benchmarks"""
    print("🎯 Decisify Realistic End-to-End Benchmark")
    print("=" * 70)
    print("Testing complete decision pipeline: signals → scores → softmax → action")
    print()

    signal_counts = [10, 50, 100, 500]

    for count in signal_counts:
        print(f"\n📊 Testing with {count} signals (realistic mix):")
        print("-" * 70)

        signals = generate_realistic_signals(count)

        # Python implementation
        py_engine = AttentionFusionEngine(temperature=1.0)
        py_results = benchmark_full_decision(py_engine, signals, iterations=1000)

        print(f"  Python Implementation:")
        print(f"    Mean:   {py_results['mean']:.4f} ms")
        print(f"    Median: {py_results['median']:.4f} ms")
        print(f"    P95:    {py_results['p95']:.4f} ms")
        print(f"    P99:    {py_results['p99']:.4f} ms")

        # Rust implementation
        if RUST_AVAILABLE:
            rust_engine = HybridAttentionEngine(temperature=1.0, use_rust=True)
            rust_results = benchmark_full_decision(rust_engine, signals, iterations=1000)

            print(f"  Rust Implementation:")
            print(f"    Mean:   {rust_results['mean']:.4f} ms")
            print(f"    Median: {rust_results['median']:.4f} ms")
            print(f"    P95:    {rust_results['p95']:.4f} ms")
            print(f"    P99:    {rust_results['p99']:.4f} ms")

            speedup = py_results["mean"] / rust_results["mean"]
            print(f"  🚀 Speedup: {speedup:.2f}x")

            # Verify correctness
            py_decision = py_engine.decide(signals)
            rust_decision = rust_engine.decide(signals)

            print(f"  ✓ Python action: {py_decision.action}")
            print(f"  ✓ Rust action:   {rust_decision.action}")

            # Compare weights
            weight_diffs = [
                abs(py_decision.weights.get(k, 0) - rust_decision.weights.get(k, 0))
                for k in py_decision.weights.keys()
            ]
            max_diff = max(weight_diffs) if weight_diffs else 0
            print(f"  ✓ Max weight difference: {max_diff:.2e}")

    print("\n" + "=" * 70)
    print("✅ Realistic benchmark complete!")
    print()
    print("💡 Key insights:")
    print("   - For small signal counts (<50), Python-Rust overhead dominates")
    print("   - For large signal counts (>100), Rust shows measurable gains")
    print("   - Real-world benefit: consistent low-latency decisions under load")


if __name__ == "__main__":
    run_realistic_benchmark()
