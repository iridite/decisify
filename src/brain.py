"""
Brain - Multi-modal Attention Fusion Engine
Implements softmax-based attention to weight different signal sources dynamically.
"""

import math
from datetime import datetime
from typing import Dict

from src.logger import get_logger
from src.schemas import DecisionChain, Signal

logger = get_logger(__name__)


class AttentionFusionEngine:
    """
    The core decision-making brain that processes multi-modal signals.
    Uses attention mechanism to dynamically weight different sources.
    """

    def __init__(self, temperature: float = 1.0):
        """
        Args:
            temperature: Controls the sharpness of attention distribution.
                        Higher = more uniform, Lower = more focused.
        """
        self.temperature = temperature

    def decide(self, signals: Dict[str, Signal]) -> DecisionChain:
        """
        Main decision function: signals → attention weights → action.

        Handles edge case: if all signals are null/zero, defaults to neutral state.
        """
        if not signals or all(s.value == 0.0 for s in signals.values()):
            logger.warning("All signals null or unavailable - returning neutral decision")
            return self._neutral_decision()

        # Step 1: Calculate attention scores
        scores = self._calculate_scores(signals)

        # Step 2: Apply softmax to get normalized weights
        weights = self._softmax(scores)

        # Step 3: Compute weighted signal
        weighted_value = sum(weights[src] * sig.value for src, sig in signals.items())

        # Step 4: Map to action
        action = self._map_to_action(weighted_value, signals)

        # Step 5: Generate reasoning
        reasoning = self._generate_reasoning(signals, weights, weighted_value)

        logger.debug(f"Decision: {action}, Weighted value: {weighted_value:.3f}")

        return DecisionChain(
            timestamp=datetime.now(),
            weights=weights,
            action=action,
            reasoning=reasoning,
            is_safe=True,  # Will be validated by SafetyGate
            override_reason=None,
            explanation=None,
        )

    def _calculate_scores(self, signals: Dict[str, Signal]) -> Dict[str, float]:
        """
        Calculate raw attention scores for each signal.

        Scoring logic:
        - Sentiment signals (twitter, news): Use absolute value (strength matters)
        - Volatility: Higher volatility = higher importance
        - Recency: More recent signals get slight boost
        """
        scores = {}
        now = datetime.now()

        for source, signal in signals.items():
            base_score = abs(signal.value)

            # Boost volatility importance
            if "volatility" in source:
                base_score *= 1.5

            # Recency boost (decay over 60 seconds)
            age_seconds = (now - signal.timestamp).total_seconds()
            recency_factor = math.exp(-age_seconds / 60.0)

            scores[source] = base_score * recency_factor

        return scores

    def _softmax(self, scores: Dict[str, float]) -> Dict[str, float]:
        """
        Apply softmax normalization to convert scores to probability distribution.

        Formula: Weight_i = exp(Score_i / T) / Σ exp(Score_j / T)
        """
        if not scores:
            return {}

        # Apply temperature scaling
        scaled_scores = {k: v / self.temperature for k, v in scores.items()}

        # Compute exp values
        exp_scores = {k: math.exp(v) for k, v in scaled_scores.items()}

        # Normalize
        total = sum(exp_scores.values())
        if total == 0:
            # Fallback to uniform distribution
            return {k: 1.0 / len(scores) for k in scores}

        return {k: v / total for k, v in exp_scores.items()}

    def _map_to_action(self, weighted_value: float, signals: Dict[str, Signal]) -> str:
        """
        Map the weighted signal value to a discrete action.

        Logic:
        - Strong positive (> 0.3): BUY
        - Strong negative (< -0.3): SELL
        - Otherwise: HOLD
        """
        if weighted_value > 0.3:
            return "BUY"
        elif weighted_value < -0.3:
            return "SELL"
        else:
            return "HOLD"

    def _generate_reasoning(
        self, signals: Dict[str, Signal], weights: Dict[str, float], weighted_value: float
    ) -> str:
        """
        Generate human-readable explanation of the decision.
        """
        # Find dominant signal
        dominant_source = max(weights.items(), key=lambda x: x[1])[0]
        dominant_weight = weights[dominant_source]
        dominant_signal = signals[dominant_source]

        reasoning_parts = [
            f"Weighted signal: {weighted_value:.3f}",
            f"Dominant source: {dominant_source} ({dominant_weight:.1%} weight)",
            f"Signal value: {dominant_signal.value:.3f}",
        ]

        # Add context from raw content
        if dominant_signal.raw_content:
            reasoning_parts.append(f"Context: {dominant_signal.raw_content[:100]}")

        return " | ".join(reasoning_parts)

    def explain_decision(self, decision: DecisionChain, signals: Dict[str, Signal]) -> str:
        """
        Generate natural language explanation of the decision for better interpretability.

        This method translates technical decision data into human-friendly explanations,
        making the AI's reasoning process transparent and trustworthy.
        """
        if not decision.weights:
            return "No signals available - maintaining neutral position for safety."

        # Find dominant signal
        dominant_source = max(decision.weights.items(), key=lambda x: x[1])[0]
        dominant_weight = decision.weights[dominant_source]
        dominant_signal = signals.get(dominant_source)

        # Extract weighted value from reasoning string
        try:
            weighted_str = decision.reasoning.split("Weighted signal: ")[1].split(" |")[0]
            weighted_value = abs(float(weighted_str))
        except (IndexError, ValueError):
            weighted_value = 0.0

        # Interpret signal strength
        if weighted_value > 0.5:
            strength = "strong"
        elif weighted_value > 0.3:
            strength = "moderate"
        else:
            strength = "weak"

        # Build explanation
        explanation_parts = []

        # 1. Decision summary
        explanation_parts.append(
            f"I decided to {decision.action} based on {strength} signals from multiple sources."
        )

        # 2. Main reasoning
        if dominant_signal:
            signal_direction = "positive" if dominant_signal.value > 0 else "negative"
            explanation_parts.append(
                f"The primary factor was {dominant_source} showing {signal_direction} sentiment "
                f"(weight: {dominant_weight:.1%}, value: {dominant_signal.value:.2f})."
            )

        # 3. Supporting signals
        other_signals = [
            (src, weight) for src, weight in decision.weights.items()
            if src != dominant_source and weight > 0.15
        ]
        if other_signals:
            other_names = ", ".join([src for src, _ in other_signals])
            explanation_parts.append(
                f"Supporting signals from {other_names} reinforced this decision."
            )

        # 4. Safety status
        if decision.is_safe:
            explanation_parts.append("All safety checks passed.")
        else:
            explanation_parts.append(
                f"Safety override applied: {decision.override_reason}"
            )

        # 5. Context
        if dominant_signal and dominant_signal.raw_content:
            context_preview = dominant_signal.raw_content[:80]
            explanation_parts.append(f'Context: "{context_preview}..."')

        return " ".join(explanation_parts)

    def _neutral_decision(self) -> DecisionChain:
        """
        Fallback decision when all signals are null or unavailable.
        """
        return DecisionChain(
            timestamp=datetime.now(),
            weights={},
            action="HOLD",
            reasoning="All signals null or unavailable - defaulting to neutral state",
            is_safe=True,
            override_reason=None,
            explanation=None,
        )
