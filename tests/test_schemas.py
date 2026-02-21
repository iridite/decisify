"""
Tests for data schemas (schemas.py)
"""

from datetime import datetime

import pytest

from src.schemas import DecisionChain, Signal, SystemState


def test_signal_creation_with_defaults():
    """Test Signal creation with default values."""
    signal = Signal(source="test_source", value=0.5)

    assert signal.source == "test_source"
    assert signal.value == 0.5
    assert isinstance(signal.timestamp, datetime)
    assert signal.raw_content is None


def test_signal_creation_with_all_fields():
    """Test Signal creation with all fields specified."""
    timestamp = datetime.now()
    signal = Signal(
        source="twitter",
        value=0.75,
        timestamp=timestamp,
        raw_content="Market is bullish!",
    )

    assert signal.source == "twitter"
    assert signal.value == 0.75
    assert signal.timestamp == timestamp
    assert signal.raw_content == "Market is bullish!"


def test_signal_validation_requires_source():
    """Test that Signal requires source field."""
    with pytest.raises(Exception):  # Pydantic ValidationError
        Signal(value=0.5)


def test_signal_validation_requires_value():
    """Test that Signal requires value field."""
    with pytest.raises(Exception):  # Pydantic ValidationError
        Signal(source="test")


def test_signal_accepts_negative_values():
    """Test that Signal accepts negative values."""
    signal = Signal(source="test", value=-0.8)
    assert signal.value == -0.8


def test_signal_accepts_zero_value():
    """Test that Signal accepts zero value."""
    signal = Signal(source="test", value=0.0)
    assert signal.value == 0.0


def test_signal_json_serialization():
    """Test that Signal can be serialized to JSON."""
    signal = Signal(source="test", value=0.5, raw_content="test content")
    json_data = signal.model_dump()

    assert json_data["source"] == "test"
    assert json_data["value"] == 0.5
    assert json_data["raw_content"] == "test content"
    assert "timestamp" in json_data


def test_decision_chain_creation():
    """Test DecisionChain creation with required fields."""
    weights = {"signal1": 0.6, "signal2": 0.4}
    decision = DecisionChain(
        weights=weights,
        action="BUY",
        reasoning="Strong positive signals",
        is_safe=True,
    )

    assert decision.weights == weights
    assert decision.action == "BUY"
    assert decision.reasoning == "Strong positive signals"
    assert decision.is_safe is True
    assert decision.override_reason is None
    assert isinstance(decision.timestamp, datetime)


def test_decision_chain_with_override():
    """Test DecisionChain with safety override."""
    decision = DecisionChain(
        weights={"signal1": 1.0},
        action="HOLD",
        reasoning="Overridden due to high volatility",
        is_safe=False,
        override_reason="Volatility > 5%",
    )

    assert decision.is_safe is False
    assert decision.override_reason == "Volatility > 5%"


def test_decision_chain_validation_requires_weights():
    """Test that DecisionChain requires weights field."""
    with pytest.raises(Exception):  # Pydantic ValidationError
        DecisionChain(
            action="BUY",
            reasoning="test",
            is_safe=True,
        )


def test_decision_chain_validation_requires_action():
    """Test that DecisionChain requires action field."""
    with pytest.raises(Exception):  # Pydantic ValidationError
        DecisionChain(
            weights={},
            reasoning="test",
            is_safe=True,
        )


def test_decision_chain_validation_requires_reasoning():
    """Test that DecisionChain requires reasoning field."""
    with pytest.raises(Exception):  # Pydantic ValidationError
        DecisionChain(
            weights={},
            action="HOLD",
            is_safe=True,
        )


def test_decision_chain_validation_requires_is_safe():
    """Test that DecisionChain requires is_safe field."""
    with pytest.raises(Exception):  # Pydantic ValidationError
        DecisionChain(
            weights={},
            action="HOLD",
            reasoning="test",
        )


def test_decision_chain_json_serialization():
    """Test that DecisionChain can be serialized to JSON."""
    decision = DecisionChain(
        weights={"signal1": 0.5, "signal2": 0.5},
        action="HOLD",
        reasoning="Neutral signals",
        is_safe=True,
    )

    json_data = decision.model_dump()

    assert json_data["weights"] == {"signal1": 0.5, "signal2": 0.5}
    assert json_data["action"] == "HOLD"
    assert json_data["reasoning"] == "Neutral signals"
    assert json_data["is_safe"] is True
    assert "timestamp" in json_data


def test_system_state_creation_with_defaults():
    """Test SystemState creation with default values."""
    state = SystemState()

    assert state.latest_decision is None
    assert state.latest_signals == {}
    assert state.cycle_count == 0
    assert isinstance(state.last_update, datetime)


def test_system_state_with_decision():
    """Test SystemState with a decision."""
    decision = DecisionChain(
        weights={"signal1": 1.0},
        action="BUY",
        reasoning="test",
        is_safe=True,
    )

    state = SystemState(latest_decision=decision, cycle_count=5)

    assert state.latest_decision == decision
    assert state.cycle_count == 5


def test_system_state_with_signals():
    """Test SystemState with signals."""
    signals = {
        "twitter": Signal(source="twitter", value=0.5),
        "news": Signal(source="news", value=0.3),
    }

    state = SystemState(latest_signals=signals)

    assert len(state.latest_signals) == 2
    assert "twitter" in state.latest_signals
    assert "news" in state.latest_signals


def test_system_state_update_cycle_count():
    """Test updating SystemState cycle count."""
    state = SystemState()
    assert state.cycle_count == 0

    state.cycle_count += 1
    assert state.cycle_count == 1


def test_system_state_json_serialization():
    """Test that SystemState can be serialized to JSON."""
    decision = DecisionChain(
        weights={"signal1": 1.0},
        action="HOLD",
        reasoning="test",
        is_safe=True,
    )

    signals = {
        "test": Signal(source="test", value=0.5),
    }

    state = SystemState(
        latest_decision=decision,
        latest_signals=signals,
        cycle_count=10,
    )

    json_data = state.model_dump()

    assert json_data["cycle_count"] == 10
    assert "latest_decision" in json_data
    assert "latest_signals" in json_data
    assert "last_update" in json_data


def test_signal_model_config_example():
    """Test that Signal has example in model config."""
    # This tests that the ConfigDict migration worked correctly
    assert hasattr(Signal, "model_config")
    assert "json_schema_extra" in Signal.model_config


def test_decision_chain_model_config_example():
    """Test that DecisionChain has example in model config."""
    # This tests that the ConfigDict migration worked correctly
    assert hasattr(DecisionChain, "model_config")
    assert "json_schema_extra" in DecisionChain.model_config


def test_signal_timestamp_auto_generation():
    """Test that Signal timestamp is auto-generated if not provided."""
    before = datetime.now()
    signal = Signal(source="test", value=0.5)
    after = datetime.now()

    assert before <= signal.timestamp <= after


def test_decision_chain_timestamp_auto_generation():
    """Test that DecisionChain timestamp is auto-generated if not provided."""
    before = datetime.now()
    decision = DecisionChain(
        weights={},
        action="HOLD",
        reasoning="test",
        is_safe=True,
    )
    after = datetime.now()

    assert before <= decision.timestamp <= after


def test_system_state_last_update_auto_generation():
    """Test that SystemState last_update is auto-generated if not provided."""
    before = datetime.now()
    state = SystemState()
    after = datetime.now()

    assert before <= state.last_update <= after
