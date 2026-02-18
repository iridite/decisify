"""
Data models for Decisify - The Source of Truth
All data structures use strict Pydantic V2 typing for safety and validation.
"""

from datetime import datetime
from typing import Dict, Optional

from pydantic import BaseModel, Field


class Signal(BaseModel):
    """
    Represents a single data point from any sensor/source.
    Can be structured (price, volume) or unstructured (sentiment, news).
    """

    source: str = Field(
        ..., description="Identifier of the signal source (e.g., 'twitter', 'price_feed')"
    )
    value: float = Field(..., description="Normalized signal strength [-1.0 to 1.0] or raw metric")
    timestamp: datetime = Field(
        default_factory=datetime.now, description="When this signal was captured"
    )
    raw_content: Optional[str] = Field(None, description="Original text/data for traceability")

    class Config:
        json_schema_extra = {
            "example": {
                "source": "twitter_sentiment",
                "value": 0.75,
                "timestamp": "2026-02-18T10:30:00",
                "raw_content": "Market looking bullish today! 🚀",
            }
        }


class DecisionChain(BaseModel):
    """
    The complete decision artifact with full transparency.
    Records what was decided, why, and whether it passed safety checks.
    """

    timestamp: datetime = Field(
        default_factory=datetime.now, description="When this decision was made"
    )
    weights: Dict[str, float] = Field(
        ..., description="Attention weights assigned to each signal source"
    )
    action: str = Field(..., description="The recommended action (BUY/SELL/HOLD)")
    reasoning: str = Field(..., description="Human-readable explanation of the decision logic")
    is_safe: bool = Field(..., description="Whether this action passed safety guardrails")
    override_reason: Optional[str] = Field(None, description="If safety gate overrode, why?")

    class Config:
        json_schema_extra = {
            "example": {
                "timestamp": "2026-02-18T10:30:05",
                "weights": {"twitter_sentiment": 0.35, "price_volatility": 0.45, "news_feed": 0.20},
                "action": "HOLD",
                "reasoning": "High positive sentiment but volatility exceeds threshold",
                "is_safe": True,
                "override_reason": "Volatility > 5%, overriding BUY to HOLD",
            }
        }


class SystemState(BaseModel):
    """
    Shared state between the Agent Loop and FastAPI endpoints.
    """

    latest_decision: Optional[DecisionChain] = None
    latest_signals: Dict[str, Signal] = Field(default_factory=dict)
    cycle_count: int = 0
    last_update: datetime = Field(default_factory=datetime.now)
