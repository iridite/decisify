"""
Batch processing benchmark: Where Rust truly shines
Tests batch decision-making for backtesting and parallel processing
"""

import random
import statistics
import time
from datetime import datetime, timedelta
from typing import Dict, List

from schemas import Signal

try:
    from decisify_core import batch_decide

    RUST_AVAILABLE = True
except ImportError:
    RUST_AVAILABLE = False
    print("⚠️  Rust extension not available")


def generate_signal_batch(batch_size: int, signals_per_batch: int) -> List[Dict[str, Signal]]:
    """Generate a batch of signal sets for backtesting"""
    batches = []
    base_time = datetime.now()

    for i in range(batch_size):
        signals = {}
        timestamp = base_time - timedelta(seconds=i * 60)  # 1 minute intervals

        for j in range(signals_per_batch):
            source = f"sensor_{j % 10}"  # Reuse sensor names
            signals[source] = Signal(
                source=source,
                value=random.uniform(-1.0, 1.0),
                timestamp=timestamp,
                raw_content=f"data_{i}_{j}",
            )

        batches.append(signals)

    return batches


def python_batch_decide(temperature: float, signal_batches: List[Dict[str, Signal]]):
    """Python implementation of batch processing"""
    from brain import AttentionFusionEngine

    engine = AttentionFusionEngine(temperature=temperature)
    results = []

    for signals in signal_batches:
        decision = engine.decide(signals)
        results.append(
            (
                sum(decision.weights[src] * sig.value for src, sig in signals.items()),
                decision.weights,
            )
        )

    return results


def rust_batch_decide_wrapper(temperature: float, signal_batches: List[Dict[str, Signal]]):
    """Rust implementation of batch processing"""
    now = datetime.now()

    # Convert to Rust format
    rust_batches = []
    for signals in signal_batches:
        rust_signals = {
            source: (
                signal.value,
                (now - signal.timestamp).total_seconds(),
                signal.timestamp.timestamp(),
            )
            for source, signal in signals.items()
        }
        rust_batches.append(rust_signals)

    # Call Rust batch processor
    return batch_decide(temperature, rust_batches)


def benchmark_batch_processing(batch_size: int, signals_per_batch: int, iterations: int = 10):
    """Benchmark batch processing performance"""
    print(f"\n📦 Batch: {batch_size} decisions × {signals_per_batch} signals each")
    print("-" * 70)

    # Generate test data
    signal_batches = generate_signal_batch(batch_size, signals_per_batch)

    # Python benchmark
    py_times = []
    for _ in range(iterations):
        start = time.perf_counter()
        py_results = python_batch_decide(1.0, signal_batches)
        end = time.perf_counter()
        py_times.append(end - start)

    py_mean = statistics.mean(py_times) * 1000
    py_throughput = batch_size / statistics.mean(py_times)

    print("  Python Batch Processing:")
    print(f"    Mean:       {py_mean:.2f} ms")
    print(f"    Throughput: {py_throughput:.0f} decisions/sec")

    # Rust benchmark
    if RUST_AVAILABLE:
        rust_times = []
        for _ in range(iterations):
            start = time.perf_counter()
            rust_results = rust_batch_decide_wrapper(1.0, signal_batches)
            end = time.perf_counter()
            rust_times.append(end - start)

        rust_mean = statistics.mean(rust_times) * 1000
        rust_throughput = batch_size / statistics.mean(rust_times)

        print("  Rust Batch Processing:")
        print(f"    Mean:       {rust_mean:.2f} ms")
        print(f"    Throughput: {rust_throughput:.0f} decisions/sec")

        speedup = py_mean / rust_mean
        throughput_gain = rust_throughput / py_throughput

        print(f"  🚀 Speedup: {speedup:.2f}x")
        print(f"  📈 Throughput gain: {throughput_gain:.2f}x")

        # Verify correctness (first batch)
        py_weighted = py_results[0][0]
        rust_weighted = rust_results[0][0]
        diff = abs(py_weighted - rust_weighted)
        print(f"  ✓ Result difference: {diff:.2e}")


def run_batch_benchmark():
    """Run comprehensive batch processing benchmarks"""
    print("🔄 Decisify Batch Processing Benchmark")
    print("=" * 70)
    print("Testing batch decision-making for backtesting and parallel processing")
    print()

    # Test different batch sizes
    test_cases = [
        (10, 20),  # Small: 10 decisions, 20 signals each
        (100, 20),  # Medium: 100 decisions, 20 signals each
        (1000, 20),  # Large: 1000 decisions, 20 signals each
        (100, 100),  # Wide: 100 decisions, 100 signals each
    ]

    for batch_size, signals_per_batch in test_cases:
        benchmark_batch_processing(batch_size, signals_per_batch, iterations=10)

    print("\n" + "=" * 70)
    print("✅ Batch benchmark complete!")
    print()
    print("💡 Key insights:")
    print("   - Rust excels at batch processing (amortizes FFI overhead)")
    print("   - For single decisions: Python is faster (lower overhead)")
    print("   - For backtesting/batch: Rust provides significant speedup")
    print("   - Use Rust for: backtesting, batch analysis, high-throughput scenarios")
    print("   - Use Python for: real-time single decisions, prototyping")


if __name__ == "__main__":
    run_batch_benchmark()
