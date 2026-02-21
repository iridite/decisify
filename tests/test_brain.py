"""
Tests for AttentionFusionEngine (brain.py)
"""

from datetime import datetime, timedelta

import pytest

from src.brain import AttentionFusionEngine
from src.schemas import Signal


@pytest.fixture
def engine():
    """Create a default AttentionFusionEngine instance."""
    return AttentionFusionEngine(temperature=1.0)


@pytest.fixture
def sample_signals():
    """Create sample signals for testing."""
    return {
        "twitter_sentiment": Signal(
            source="twitter_sentiment",
            value=0.75,
            timestamp=datetime.now(),
            raw_content="Market looking bullish! 🚀",
        ),
        "price_volatility": Signal(
            source="price_volatility",
            value=0.03,
            timestamp=datetime.now(),
            raw_content="Volatility: 3%",
        ),
        "news_feed": Signal(
            source="news_feed",
            value=0.45,
            timestamp=datetime.now(),
            raw_content="Tech sector shows growth",
        ),
    }


def test_engine_initialization():
    """Test AttentionFusionEngine initialization."""
    engine = AttentionFusionEngine(temperature=2.0)
    assert engine.temperature == 2.0


def test_decide_with_valid_signals(engine, sample_signals):
    """Test decision making with valid signals."""
    decision = engine.decide(sample_signals)

    assert decision.action in ["BUY", "SELL", "HOLD"]
    assert decision.is_safe is True
    assert len(decision.weights) == 3
    assert all(source in decision.weights for source in sample_signals.keys())
    assert abs(sum(decision.weights.values()) - 1.0) < 0.001  # Weights sum to 1
    assert decision.reasoning != ""


def test_decide_with_empty_signals(engine):
    """Test decision with empty signals dictionary."""
    decision = engine.decide({})

    assert decision.action == "HOLD"
    assert decision.reasoning == "All signals null or unavailable - defaulting to neutral state"
    assert decision.weights == {}
    assert decision.is_safe is True


def test_decide_with_all_zero_signals(engine):
    """Test decision when all signals have zero value."""
    zero_signals = {
        "signal1": Signal(source="signal1", value=0.0),
        "signal2": Signal(source="signal2", value=0.0),
    }

    decision = engine.decide(zero_signals)

    assert decision.action == "HOLD"
    assert "null or unavailable" in decision.reasoning


def test_buy_action_threshold(engine):
    """Test that strong positive signals trigger BUY."""
    strong_positive = {
        "signal1": Signal(source="signal1", value=0.8),
        "signal2": Signal(source="signal2", value=0.7),
    }

    decision = engine.decide(strong_positive)
    assert decision.action == "BUY"


def test_sell_action_threshold(engine):
    """Test that strong negative signals trigger SELL."""
    strong_negative = {
        "signal1": Signal(source="signal1", value=-0.8),
        "signal2": Signal(source="signal2", value=-0.7),
    }

    decision = engine.decide(strong_negative)
    assert decision.action == "SELL"


def test_hold_action_threshold(engine):
    """Test that weak signals trigger HOLD."""
    weak_signals = {
        "signal1": Signal(source="signal1", value=0.1),
        "signal2": Signal(source="signal2", value=-0.1),
    }

    decision = engine.decide(weak_signals)
    assert decision.action == "HOLD"


def test_calculate_scores_volatility_boost(engine):
    """Test that volatility signals get boosted importance."""
    signals = {
        "twitter_sentiment": Signal(source="twitter_sentiment", value=0.5),
        "price_volatility": Signal(source="price_volatility", value=0.5),
    }

    scores = engine._calculate_scores(signals)

    # Volatility should have higher score due to 1.5x boost
    assert scores["price_volatility"] > scores["twitter_sentiment"]


def test_calculate_scores_recency_factor(engine):
    """Test that older signals get lower scores."""
    old_signal = Signal(
        source="old_signal",
        value=0.5,
        timestamp=datetime.now() - timedelta(seconds=120),  # 2 minutes old
    )
    new_signal = Signal(
        source="new_signal",
        value=0.5,
        timestamp=datetime.now(),
    )

    signals = {"old_signal": old_signal, "new_signal": new_signal}
    scores = engine._calculate_scores(signals)

    # Newer signal should have higher score
    assert scores["new_signal"] > scores["old_signal"]


def test_softmax_normalization(engine):
    """Test that softmax produces valid probability distribution."""
    scores = {"signal1": 1.0, "signal2": 2.0, "signal3": 3.0}

    weights = engine._softmax(scores)

    # Check sum to 1
    assert abs(sum(weights.values()) - 1.0) < 0.001

    # Check all positive
    assert all(w > 0 for w in weights.values())

    # Check ordering preserved
    assert weights["signal3"] > weights["signal2"] > weights["signal1"]


def test_softmax_with_empty_scores(engine):
    """Test softmax with empty scores dictionary."""
    weights = engine._softmax({})
    assert weights == {}


def test_softmax_temperature_effect():
    """Test that temperature affects weight distribution."""
    scores = {"signal1": 1.0, "signal2": 3.0}

    # Low temperature = sharper distribution
    sharp_engine = AttentionFusionEngine(temperature=0.5)
    sharp_weights = sharp_engine._softmax(scores)

    # High temperature = more uniform distribution
    smooth_engine = AttentionFusionEngine(temperature=2.0)
    smooth_weights = smooth_engine._softmax(scores)

    # Sharp should have more extreme weights
    sharp_diff = abs(sharp_weights["signal2"] - sharp_weights["signal1"])
    smooth_diff = abs(smooth_weights["signal2"] - smooth_weights["signal1"])

    assert sharp_diff > smooth_diff


def test_map_to_action_boundaries(engine):
    """Test action mapping at boundary values."""
    signals = {"dummy": Signal(source="dummy", value=0.0)}

    # Test BUY threshold
    assert engine._map_to_action(0.31, signals) == "BUY"
    assert engine._map_to_action(0.3, signals) == "HOLD"

    # Test SELL threshold
    assert engine._map_to_action(-0.31, signals) == "SELL"
    assert engine._map_to_action(-0.3, signals) == "HOLD"

    # Test HOLD range
    assert engine._map_to_action(0.0, signals) == "HOLD"
    assert engine._map_to_action(0.15, signals) == "HOLD"
    assert engine._map_to_action(-0.15, signals) == "HOLD"


def test_generate_reasoning_includes_dominant_source(engine, sample_signals):
    """Test that reasoning includes dominant signal information."""
    decision = engine.decide(sample_signals)

    # Should mention weighted signal
    assert "Weighted signal:" in decision.reasoning

    # Should mention dominant source
    assert "Dominant source:" in decision.reasoning

    # Should mention signal value
    assert "Signal value:" in decision.reasoning


def test_generate_reasoning_with_raw_content(engine):
    """Test that reasoning includes raw content when available."""
    signals = {
        "twitter": Signal(
            source="twitter",
            value=0.8,
            raw_content="This is a very long tweet that should be truncated in the reasoning output",
        )
    }

    decision = engine.decide(signals)

    # Should include context
    assert "Context:" in decision.reasoning


def test_neutral_decision(engine):
    """Test neutral decision structure."""
    decision = engine._neutral_decision()

    assert decision.action == "HOLD"
    assert decision.weights == {}
    assert decision.is_safe is True
    assert decision.override_reason is None
    assert "null or unavailable" in decision.reasoning


def test_decision_timestamp(engine, sample_signals):
    """Test that decision has recent timestamp."""
    before = datetime.now()
    decision = engine.decide(sample_signals)
    after = datetime.now()

    assert before <= decision.timestamp <= after


def test_single_signal_decision(engine):
    """Test decision with only one signal."""
    single_signal = {
        "only_signal": Signal(source="only_signal", value=0.6)
    }

    decision = engine.decide(single_signal)

    assert decision.action in ["BUY", "SELL", "HOLD"]
    assert len(decision.weights) == 1
    assert decision.weights["only_signal"] == 1.0  # Should get 100% weight


def test_mixed_positive_negative_signals(engine):
    """Test decision with mixed positive and negative signals."""
    mixed_signals = {
        "positive": Signal(source="positive", value=0.7),
        "negative": Signal(source="negative", value=-0.5),
    }

    decision = engine.decide(mixed_signals)

    # Should produce a decision based on weighted average
    assert decision.action in ["BUY", "SELL", "HOLD"]
    assert len(decision.weights) == 2
