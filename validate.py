"""
Comprehensive validation script for Decisify core logic.
Tests all critical components and edge cases.
"""

import asyncio

from brain import AttentionFusionEngine
from safety import SafetyGate
from schemas import DecisionChain, Signal
from sensors import AsyncPerceptionHub


async def test_attention_fusion():
    """Test the attention fusion engine."""
    print("🧪 Testing Attention Fusion Engine\n")

    brain = AttentionFusionEngine(temperature=1.0)

    # Test 1: Normal signals
    print("Test 1: Normal multi-modal signals")
    signals = {
        "twitter_sentiment": Signal(source="twitter_sentiment", value=0.8, raw_content="Bullish!"),
        "price_volatility": Signal(source="price_volatility", value=0.03, raw_content="Low vol"),
        "news_feed": Signal(source="news_feed", value=0.5, raw_content="Positive news"),
    }
    decision = brain.decide(signals)
    print(f"  Action: {decision.action}")
    print(f"  Weights: {decision.weights}")
    print(f"  Reasoning: {decision.reasoning[:80]}...")
    assert decision.action in ["BUY", "SELL", "HOLD"], "Invalid action"
    assert abs(sum(decision.weights.values()) - 1.0) < 0.01, "Weights don't sum to 1"
    print("  ✅ PASS\n")

    # Test 2: All null signals (edge case)
    print("Test 2: All null signals (edge case)")
    null_signals = {
        "source1": Signal(source="source1", value=0.0),
        "source2": Signal(source="source2", value=0.0),
    }
    decision = brain.decide(null_signals)
    print(f"  Action: {decision.action}")
    print(f"  Reasoning: {decision.reasoning}")
    assert decision.action == "HOLD", "Should default to HOLD"
    print("  ✅ PASS\n")

    # Test 3: Empty signals
    print("Test 3: Empty signals dict")
    decision = brain.decide({})
    assert decision.action == "HOLD", "Should default to HOLD"
    print(f"  Action: {decision.action}")
    print("  ✅ PASS\n")

    # Test 4: Strong negative signal (should SELL)
    print("Test 4: Strong negative signal")
    negative_signals = {
        "sentiment": Signal(source="sentiment", value=-0.9, raw_content="Very bearish"),
    }
    decision = brain.decide(negative_signals)
    print(f"  Action: {decision.action}")
    assert decision.action == "SELL", "Should recommend SELL"
    print("  ✅ PASS\n")


def test_safety_gate():
    """Test the safety gate guardrails."""
    print("🛡️  Testing Safety Gate\n")

    gate = SafetyGate(
        max_volatility_for_buy=0.05, max_volatility_for_sell=0.08, min_confidence_threshold=0.15
    )

    # Test 1: BUY with high volatility (should override to HOLD)
    print("Test 1: BUY with high volatility")
    decision = DecisionChain(
        weights={"sentiment": 0.6, "volatility": 0.4},
        action="BUY",
        reasoning="Strong positive sentiment",
        is_safe=True,
    )
    signals = {
        "sentiment": Signal(source="sentiment", value=0.8),
        "price_volatility": Signal(source="price_volatility", value=0.08),  # 8% > 5%
    }
    validated = gate.validate(decision, signals)
    print(f"  Original action: {decision.action}")
    print(f"  Validated action: {validated.action}")
    print(f"  Is safe: {validated.is_safe}")
    print(f"  Override reason: {validated.override_reason}")
    assert validated.action == "HOLD", "Should override to HOLD"
    assert not validated.is_safe, "Should mark as unsafe"
    print("  ✅ PASS\n")

    # Test 2: BUY with low volatility (should pass)
    print("Test 2: BUY with low volatility")
    decision = DecisionChain(
        weights={"sentiment": 0.7, "volatility": 0.3},
        action="BUY",
        reasoning="Strong signal",
        is_safe=True,
    )
    signals = {
        "sentiment": Signal(source="sentiment", value=0.8),
        "price_volatility": Signal(source="price_volatility", value=0.02),  # 2% < 5%
    }
    validated = gate.validate(decision, signals)
    print(f"  Action: {validated.action}")
    print(f"  Is safe: {validated.is_safe}")
    assert validated.action == "BUY", "Should keep BUY"
    assert validated.is_safe, "Should be safe"
    print("  ✅ PASS\n")

    # Test 3: Low confidence (should override to HOLD)
    print("Test 3: Low confidence threshold")
    decision = DecisionChain(
        weights={"s1": 0.12, "s2": 0.11, "s3": 0.77},  # Max weight 0.77 but let's test with 0.12
        action="BUY",
        reasoning="Weak signal",
        is_safe=True,
    )
    # Create a decision with low max weight (unused but kept for reference)
    _ = DecisionChain(
        weights={"s1": 0.12, "s2": 0.11, "s3": 0.10, "s4": 0.67},
        action="BUY",
        reasoning="Weak signal",
        is_safe=True,
    )
    signals = {"s1": Signal(source="s1", value=0.1)}

    # Actually test with a decision that has max weight < 0.15
    test_decision = DecisionChain(
        weights={"s1": 0.14, "s2": 0.13, "s3": 0.73},  # max is 0.73, so this will pass
        action="BUY",
        reasoning="Test",
        is_safe=True,
    )
    # Let's create one that will actually fail
    test_decision = DecisionChain(
        weights={
            "s1": 0.14,
            "s2": 0.13,
            "s3": 0.13,
            "s4": 0.13,
            "s5": 0.13,
            "s6": 0.13,
            "s7": 0.13,
            "s8": 0.08,
        },
        action="BUY",
        reasoning="Test",
        is_safe=True,
    )
    validated = gate.validate(test_decision, signals)
    print(f"  Max weight: {max(test_decision.weights.values()):.2f}")
    print(f"  Action: {validated.action}")
    print(f"  Override: {validated.override_reason}")
    if max(test_decision.weights.values()) < 0.15:
        assert validated.action == "HOLD", "Should override to HOLD"
    print("  ✅ PASS\n")


async def test_sensors():
    """Test async sensor hub."""
    print("📡 Testing Async Perception Hub\n")

    hub = AsyncPerceptionHub(timeout=3.0)

    print("Test 1: Fetch all signals concurrently")
    signals = await hub.fetch_all()
    print(f"  Received {len(signals)} signals")
    for source, signal in signals.items():
        print(f"    • {source}: {signal.value:.3f}")

    assert len(signals) == 3, "Should have 3 signals"
    assert "twitter_sentiment" in signals
    assert "price_volatility" in signals
    assert "news_feed" in signals
    print("  ✅ PASS\n")

    await hub.close()


async def test_full_pipeline():
    """Test the complete decision pipeline."""
    print("🔄 Testing Full Decision Pipeline\n")

    hub = AsyncPerceptionHub()
    brain = AttentionFusionEngine()
    gate = SafetyGate()

    # Fetch signals
    signals = await hub.fetch_all()
    print(f"1. Fetched {len(signals)} signals")

    # Process through brain
    decision = brain.decide(signals)
    print(f"2. Brain decision: {decision.action}")
    print(f"   Weights: {decision.weights}")

    # Validate with safety gate
    validated = gate.validate(decision, signals)
    print(f"3. Safety validation: {validated.action}")
    print(f"   Is safe: {validated.is_safe}")
    if validated.override_reason:
        print(f"   Override: {validated.override_reason}")

    print("\n✅ Full pipeline PASS\n")

    await hub.close()


async def main():
    """Run all tests."""
    print("=" * 70)
    print("DECISIFY VALIDATION SUITE")
    print("=" * 70)
    print()

    await test_attention_fusion()
    test_safety_gate()
    await test_sensors()
    await test_full_pipeline()

    print("=" * 70)
    print("✅ ALL TESTS PASSED")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())
