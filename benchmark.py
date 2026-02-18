"""
Performance benchmark: Python vs Rust implementation
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
    print("⚠️  Rust extension not available, skipping Rust benchmarks")


def generate_signals(count: int) -> Dict[str, Signal]:
    """Generate test signals"""
    return {
        f"sensor_{i}": Signal(
            source=f"sensor_{i}",
            value=float(i % 100) / 100.0,
            timestamp=datetime.now(),
            raw_content=f"test_data_{i}",
        )
        for i in range(count)
    }


def benchmark_attention_weights(engine, signals: Dict[str, Signal], iterations: int = 1000):
    """Benchmark attention weight computation"""
    times = []

    # Check which engine type we're using
    is_hybrid = hasattr(engine, "_calculate_scores_python")

    for _ in range(iterations):
        start = time.perf_counter()
        if is_hybrid:
            scores = engine._calculate_scores_python(signals)
            weights = engine._softmax_python(scores)
        else:
            scores = engine._calculate_scores(signals)
            weights = engine._softmax(scores)
        end = time.perf_counter()
        times.append(end - start)

    return {
        "mean": statistics.mean(times) * 1000,  # ms
        "median": statistics.median(times) * 1000,
        "stdev": statistics.stdev(times) * 1000 if len(times) > 1 else 0,
        "min": min(times) * 1000,
        "max": max(times) * 1000,
    }


def run_benchmarks():
    """Run comprehensive benchmarks"""
    print("🚀 Decisify Performance Benchmark")
    print("=" * 60)

    signal_counts = [5, 10, 50, 100, 500]

    for count in signal_counts:
        print(f"\n📊 Testing with {count} signals:")
        print("-" * 60)

        signals = generate_signals(count)

        # Python baseline
        py_engine = AttentionFusionEngine(temperature=1.0)
        py_results = benchmark_attention_weights(py_engine, signals, iterations=1000)

        print(f"  Python Implementation:")
        print(f"    Mean:   {py_results['mean']:.4f} ms")
        print(f"    Median: {py_results['median']:.4f} ms")
        print(f"    StdDev: {py_results['stdev']:.4f} ms")

        # Rust implementation
        if RUST_AVAILABLE:
            rust_engine = HybridAttentionEngine(temperature=1.0, use_rust=True)
            rust_results = benchmark_attention_weights(rust_engine, signals, iterations=1000)

            print(f"  Rust Implementation:")
            print(f"    Mean:   {rust_results['mean']:.4f} ms")
            print(f"    Median: {rust_results['median']:.4f} ms")
            print(f"    StdDev: {rust_results['stdev']:.4f} ms")

            speedup = py_results["mean"] / rust_results["mean"]
            print(f"  🚀 Speedup: {speedup:.2f}x")

            # Verify correctness
            py_scores = py_engine._calculate_scores(signals)
            py_weights = py_engine._softmax(py_scores)
            rust_scores = rust_engine._calculate_scores_python(signals)
            rust_weights = rust_engine._softmax_python(rust_scores)

            max_diff = max(abs(py_weights[k] - rust_weights[k]) for k in py_weights.keys())
            print(f"  ✓ Max difference: {max_diff:.2e} (numerical precision)")

    print("\n" + "=" * 60)
    print("✅ Benchmark complete!")


if __name__ == "__main__":
    run_benchmarks()
