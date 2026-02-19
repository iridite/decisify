"""Tests for safety gate module."""

import pytest

from src.safety import SafetyGate
from src.schemas import DecisionChain, Signal


@pytest.fixture
def safety_gate():
    """Create a SafetyGate instance for testing."""
    return SafetyGate(
        max_volatility_for_buy=0.05,
        max_volatility_for_sell=0.08,
        min_confidence_threshold=0.15
    )


def test_safety_gate_initialization(safety_gate):
    """Test safety gate initialization."""
    assert safety_gate.max_volatility_for_buy == 0.05
    assert safety_gate.max_volatility_for_sell == 0.08
    assert safety_gate.min_confidence_threshold == 0.15


def test_hold_action_always_passes(safety_gate):
    """Test that HOLD action always passes safety check."""
    decision = DecisionChain(
        action="HOLD",
        weights={},
        reasoning="Test hold",
        is_safe=False
    )
    signals = {
        "market_volatility": Signal(source="market", value=0.9)
    }
    
    result = safety_gate.validate(decision, signals)
    
    assert result.is_safe is True
    assert result.action == "HOLD"


def test_buy_action_low_volatility_passes(safety_gate):
    """Test BUY action with low volatility passes."""
    decision = DecisionChain(
        action="BUY",
        weights={"signal1": 0.8},
        reasoning="Test buy",
        is_safe=False
    )
    signals = {
        "market_volatility": Signal(source="market", value=0.03)
    }
    
    result = safety_gate.validate(decision, signals)
    
    assert result.is_safe is True
    assert result.action == "BUY"


def test_buy_action_high_volatility_blocked(safety_gate):
    """Test BUY action with high volatility is blocked."""
    decision = DecisionChain(
        action="BUY",
        weights={"signal1": 0.8},
        reasoning="Test buy",
        is_safe=False
    )
    signals = {
        "market_volatility": Signal(source="market", value=0.10)
    }
    
    result = safety_gate.validate(decision, signals)
    
    assert result.is_safe is False
    assert result.action == "HOLD"
    assert "Volatility" in result.override_reason


def test_sell_action_low_volatility_passes(safety_gate):
    """Test SELL action with low volatility passes."""
    decision = DecisionChain(
        action="SELL",
        weights={"signal1": 0.8},
        reasoning="Test sell",
        is_safe=False
    )
    signals = {
        "market_volatility": Signal(source="market", value=0.06)
    }
    
    result = safety_gate.validate(decision, signals)
    
    assert result.is_safe is True
    assert result.action == "SELL"


def test_sell_action_high_volatility_blocked(safety_gate):
    """Test SELL action with high volatility is blocked."""
    decision = DecisionChain(
        action="SELL",
        weights={"signal1": 0.8},
        reasoning="Test sell",
        is_safe=False
    )
    signals = {
        "market_volatility": Signal(source="market", value=0.10)
    }
    
    result = safety_gate.validate(decision, signals)
    
    assert result.is_safe is False
    assert result.action == "HOLD"


def test_low_confidence_blocked(safety_gate):
    """Test that low confidence decisions are blocked."""
    decision = DecisionChain(
        action="BUY",
        weights={"signal1": 0.10},  # Below threshold
        reasoning="Test low confidence",
        is_safe=False
    )
    signals = {
        "market_volatility": Signal(source="market", value=0.02)
    }
    
    result = safety_gate.validate(decision, signals)
    
    assert result.is_safe is False
    assert result.action == "HOLD"
    assert "confidence" in result.override_reason.lower()


def test_missing_volatility_signal(safety_gate):
    """Test handling when volatility signal is missing."""
    decision = DecisionChain(
        action="BUY",
        weights={"signal1": 0.8},
        reasoning="Test missing volatility",
        is_safe=False
    )
    signals = {}
    
    result = safety_gate.validate(decision, signals)
    
    # Should default to HOLD when no signals
    assert result.is_safe is False
    assert result.action == "HOLD"


def test_edge_case_exact_threshold(safety_gate):
    """Test edge case where volatility equals threshold."""
    decision = DecisionChain(
        action="BUY",
        weights={"signal1": 0.8},
        reasoning="Test exact threshold",
        is_safe=False
    )
    signals = {
        "market_volatility": Signal(source="market", value=0.05)
    }
    
    result = safety_gate.validate(decision, signals)
    
    # At threshold should pass
    assert result.is_safe is True
    assert result.action == "BUY"


def test_multiple_safety_checks(safety_gate):
    """Test multiple safety checks in sequence."""
    # First check - should pass
    decision1 = DecisionChain(
        action="BUY",
        weights={"signal1": 0.8},
        reasoning="Test 1",
        is_safe=False
    )
    signals1 = {
        "market_volatility": Signal(source="market", value=0.03)
    }
    
    result1 = safety_gate.validate(decision1, signals1)
    
    # Second check - should fail
    decision2 = DecisionChain(
        action="SELL",
        weights={"signal1": 0.8},
        reasoning="Test 2",
        is_safe=False
    )
    signals2 = {
        "market_volatility": Signal(source="market", value=0.15)
    }
    
    result2 = safety_gate.validate(decision2, signals2)
    
    # Third check - should pass
    decision3 = DecisionChain(
        action="HOLD",
        weights={},
        reasoning="Test 3",
        is_safe=False
    )
    signals3 = {
        "market_volatility": Signal(source="market", value=0.99)
    }
    
    result3 = safety_gate.validate(decision3, signals3)
    
    assert result1.is_safe is True
    assert result2.is_safe is False
    assert result3.is_safe is True


def test_custom_thresholds():
    """Test safety gate with custom thresholds."""
    gate = SafetyGate(
        max_volatility_for_buy=0.10,
        max_volatility_for_sell=0.15,
        min_confidence_threshold=0.20
    )
    
    decision = DecisionChain(
        action="BUY",
        weights={"signal1": 0.25},
        reasoning="Test custom",
        is_safe=False
    )
    signals = {
        "market_volatility": Signal(source="market", value=0.08)
    }
    
    result = gate.validate(decision, signals)
    
    assert result.is_safe is True
