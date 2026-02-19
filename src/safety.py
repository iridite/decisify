"""
Safety Gate - Deterministic Guardrails & Execution Logic
Validates decisions against safety rules and overrides when necessary.
"""

from typing import Dict

from src.logger import get_logger
from src.metrics import get_metrics
from src.schemas import DecisionChain, Signal

logger = get_logger(__name__)


class SafetyGate:
    """
    The final gatekeeper before action execution.
    Applies deterministic rules to prevent unsafe decisions.
    """

    def __init__(
        self,
        max_volatility_for_buy: float = 0.05,
        max_volatility_for_sell: float = 0.08,
        min_confidence_threshold: float = 0.15,
    ):
        """
        Args:
            max_volatility_for_buy: Maximum allowed volatility for BUY actions (default 5%)
            max_volatility_for_sell: Maximum allowed volatility for SELL actions (default 8%)
            min_confidence_threshold: Minimum weight for dominant signal to be trusted
        """
        self.max_volatility_for_buy = max_volatility_for_buy
        self.max_volatility_for_sell = max_volatility_for_sell
        self.min_confidence_threshold = min_confidence_threshold
        self.metrics = get_metrics()

    def validate(self, decision: DecisionChain, signals: Dict[str, Signal]) -> DecisionChain:
        """
        Validate and potentially override the decision based on safety rules.

        Returns a new DecisionChain with updated is_safe and override_reason fields.
        """
        # Extract volatility signal if available
        volatility = self._get_volatility(signals)

        # Rule 1: Block BUY if volatility too high
        if decision.action == "BUY" and volatility > self.max_volatility_for_buy:
            reason = (
                f"Volatility {volatility:.2%} exceeds BUY threshold "
                f"{self.max_volatility_for_buy:.2%}"
            )
            return self._override_decision(
                decision,
                new_action="HOLD",
                reason=reason,
            )

        # Rule 2: Block SELL if volatility too high (might be panic selling)
        if decision.action == "SELL" and volatility > self.max_volatility_for_sell:
            reason = (
                f"Volatility {volatility:.2%} exceeds SELL threshold "
                f"{self.max_volatility_for_sell:.2%}"
            )
            return self._override_decision(
                decision,
                new_action="HOLD",
                reason=reason,
            )

        # Rule 3: Check confidence - if no signal has sufficient weight, default to HOLD
        if decision.weights:
            max_weight = max(decision.weights.values())
            if max_weight < self.min_confidence_threshold and decision.action != "HOLD":
                reason = (
                    f"Low confidence: max weight {max_weight:.2%} below threshold "
                    f"{self.min_confidence_threshold:.2%}"
                )
                return self._override_decision(
                    decision,
                    new_action="HOLD",
                    reason=reason,
                )

        # Rule 4: If no signals available, must be HOLD
        if not signals and decision.action != "HOLD":
            return self._override_decision(
                decision, new_action="HOLD", reason="No signals available - safety override to HOLD"
            )

        # All checks passed
        decision.is_safe = True
        self.metrics.record_safety_pass()
        logger.debug(f"Safety check passed for action: {decision.action}")
        return decision

    def _get_volatility(self, signals: Dict[str, Signal]) -> float:
        """
        Extract volatility value from signals.
        Returns 0.0 if volatility signal not found.
        """
        for source, signal in signals.items():
            if "volatility" in source.lower():
                return signal.value
        return 0.0

    def _override_decision(
        self, original: DecisionChain, new_action: str, reason: str
    ) -> DecisionChain:
        """
        Create a new DecisionChain with overridden action and safety metadata.
        """
        self.metrics.record_safety_override()
        logger.warning(f"Safety override: {original.action} -> {new_action}. Reason: {reason}")
        return DecisionChain(
            timestamp=original.timestamp,
            weights=original.weights,
            action=new_action,
            reasoning=original.reasoning,
            is_safe=False,  # Mark as unsafe (overridden)
            override_reason=reason,
        )

    def log_decision(self, decision: DecisionChain) -> None:
        """
        Log the decision with appropriate formatting.
        """
        status = "✅ SAFE" if decision.is_safe else "⚠️  OVERRIDDEN"
        logger.info(f"{status} | Action: {decision.action}")
        logger.info(f"Reasoning: {decision.reasoning}")

        if decision.override_reason:
            logger.warning(f"Override: {decision.override_reason}")

        logger.debug(f"Weights: {self._format_weights(decision.weights)}")

    def _format_weights(self, weights: Dict[str, float]) -> str:
        """Format weights for readable logging."""
        if not weights:
            return "N/A"
        return ", ".join(f"{k}: {v:.1%}" for k, v in sorted(weights.items(), key=lambda x: -x[1]))
