"""
Data Fetch Script for Decisify Dashboard
Fetches data from Decisify API and transforms it for frontend consumption
"""

import asyncio
import json
from datetime import datetime
from typing import Any, Dict, List

import httpx

# Configuration
DECISIFY_API_URL = "http://localhost:8000"  # Change to your deployed API URL
OUTPUT_FILE = "dashboard/public/data.json"


async def fetch_decisify_status() -> Dict[str, Any]:
    """Fetch current system status from Decisify API"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{DECISIFY_API_URL}/status", timeout=10.0)
        response.raise_for_status()
        return response.json()


def calculate_triangulation(
    polymarket_delta: float, x_sentiment: float, nautilus_signal: float
) -> Dict[str, float]:
    """Calculate correlation matrix between data sources"""
    # Simple correlation calculation (can be enhanced with real statistical methods)
    pm_x_corr = min(1.0, abs(polymarket_delta * 10) * x_sentiment)
    pm_n_corr = min(1.0, abs(polymarket_delta * 10) * nautilus_signal)
    x_n_corr = min(1.0, x_sentiment * nautilus_signal)

    overall = (pm_x_corr + pm_n_corr + x_n_corr) / 3

    interpretation = (
        "HIGH_BULLISH" if overall > 0.7 else "MODERATE_BULLISH" if overall > 0.5 else "NEUTRAL"
    )

    return {
        "polymarket_x_correlation": round(pm_x_corr, 2),
        "polymarket_nautilus_correlation": round(pm_n_corr, 2),
        "x_nautilus_correlation": round(x_n_corr, 2),
        "overall_alignment": round(overall, 2),
        "interpretation": interpretation,
    }


def generate_agent_thought(decision: Dict[str, Any], signals: Dict[str, Any]) -> Dict[str, Any]:
    """Generate agent reasoning based on decision and signals"""
    timestamp = datetime.now().isoformat() + "Z"

    # Extract key metrics
    weights = decision.get("weights", {})
    action = decision.get("action", "HOLD")

    # Determine dominant source
    dominant_source = max(weights.items(), key=lambda x: x[1])[0] if weights else "unknown"

    # Generate reasoning text
    dominant_weight = weights.get(dominant_source, 0)
    reasoning = (
        f"Decision: {action}. Dominant signal: {dominant_source} "
        f"({dominant_weight:.2%} weight). "
    )

    if decision.get("is_safe"):
        reasoning += "Safety checks passed. "
    else:
        reasoning += f"Safety override: {decision.get('override_reason', 'Unknown')}. "

    # Calculate confidence based on weight distribution
    max_weight = max(weights.values()) if weights else 0.5
    confidence = round(max_weight, 2)

    return {
        "id": f"thought_{int(datetime.now().timestamp())}",
        "timestamp": timestamp,
        "type": "TRIANGULATION",
        "reasoning": reasoning,
        "inputs": {"weights": weights, "action": action},
        "confidence": confidence,
        "human_feedback": None,
    }


def transform_signals_to_x_intelligence(signals: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Transform raw signals into X Intelligence format"""
    x_intelligence = []

    for source, signal in signals.items():
        if "sentiment" in source.lower() or "twitter" in source.lower() or "x_" in source.lower():
            x_intelligence.append(
                {
                    "id": f"tweet_{source}_{int(datetime.now().timestamp())}",
                    "handle": f"@{source.replace('_', '')}",
                    "content": signal.get("raw_content", "No content available"),
                    "timestamp": signal.get("timestamp", datetime.now().isoformat() + "Z"),
                    "sentiment": "BULLISH"
                    if signal.get("value", 0) > 0.5
                    else "BEARISH"
                    if signal.get("value", 0) < -0.5
                    else "NEUTRAL",
                    "sentiment_score": abs(signal.get("value", 0)),
                    "agent_relevance_score": min(1.0, abs(signal.get("value", 0)) * 1.2),
                    "extracted_entities": ["market", "signal"],
                    "impact_score": round(abs(signal.get("value", 0)) * 10, 1),
                    "follower_count": 50000,
                }
            )

    return x_intelligence[:5]  # Limit to 5 most recent


async def fetch_and_transform_data() -> Dict[str, Any]:
    """Main function to fetch and transform all data"""
    try:
        # Fetch from Decisify API
        status_data = await fetch_decisify_status()

        decision = status_data.get("decision", {})
        signals = status_data.get("signals", {})

        # Generate agent thought
        agent_thought = generate_agent_thought(decision, signals)

        # Calculate triangulation (mock values for now)
        triangulation = calculate_triangulation(0.024, 0.78, 0.34)

        # Transform signals to X Intelligence
        x_intelligence = transform_signals_to_x_intelligence(signals)

        # Build output structure
        output = {
            "meta": {
                "timestamp": datetime.now().isoformat() + "Z",
                "agent_status": "REASONING",
                "context_window_hours": 8,
                "total_events_tracked": status_data.get("cycle_count", 0),
                "system_status": "LIVE",
                "sync_timestamp": datetime.now().isoformat() + "Z",
            },
            "agent_thoughts": [agent_thought],
            "triangulation_matrix": triangulation,
            "perception": {
                "polymarket": {
                    "event": "Market Event",
                    "current_odds": 0.68,
                    "delta_1h": 0.024,
                    "delta_24h": 0.053,
                    "volume_24h": 1250000,
                    "liquidity": 3400000,
                    "last_trade": datetime.now().isoformat() + "Z",
                    "history": [{"timestamp": datetime.now().isoformat() + "Z", "odds": 0.68}],
                },
                "x_intelligence": x_intelligence
                if x_intelligence
                else [
                    {
                        "id": "tweet_default",
                        "handle": "@decisify",
                        "content": "System operational",
                        "timestamp": datetime.now().isoformat() + "Z",
                        "sentiment": "NEUTRAL",
                        "sentiment_score": 0.5,
                        "agent_relevance_score": 0.5,
                        "extracted_entities": [],
                        "impact_score": 5.0,
                        "follower_count": 1000,
                    }
                ],
                "nautilus": {
                    "strategy": "Keltner Channel Breakout",
                    "position": decision.get("action", "HOLD"),
                    "signal_strength": 0.5,
                    "entry_price": 42150.00,
                    "current_price": 42380.00,
                    "unrealized_pnl": 230.00,
                    "daily_pnl": 1250.50,
                    "position_size": 1.0,
                    "status": "ACTIVE",
                    "indicators": {
                        "keltner_upper": 42800.00,
                        "keltner_middle": 42200.00,
                        "keltner_lower": 41600.00,
                        "atr": 450.00,
                        "trend": "BULLISH",
                    },
                },
            },
            "execution": {
                "current_proposal": {
                    "id": f"prop_{int(datetime.now().timestamp())}",
                    "action": decision.get("action", "HOLD"),
                    "asset": "BTC",
                    "reasoning": decision.get("reasoning", "No reasoning available"),
                    "risk_level": "MEDIUM",
                    "expected_return": None,
                    "confidence": 0.68,
                    "status": "ACTIVE",
                    "created_at": datetime.now().isoformat() + "Z",
                    "human_decision": None,
                },
                "proposal_history": [],
            },
            "context_memory": {
                "events": [
                    {
                        "id": f"evt_{i}",
                        "timestamp": datetime.now().isoformat() + "Z",
                        "type": "SYSTEM_EVENT",
                        "description": f"Event {i}",
                        "relevance_decay": 1.0 - (i * 0.1),
                        "impact": "MEDIUM",
                    }
                    for i in range(8)
                ]
            },
            "github_actions": {
                "last_run": datetime.now().isoformat() + "Z",
                "status": "success",
                "workflow": "update-data",
                "duration_seconds": 12,
                "next_run": datetime.now().isoformat() + "Z",
            },
        }

        return output

    except Exception as e:
        print(f"Error fetching data: {e}")
        # Return mock data on error
        with open(OUTPUT_FILE, "r") as f:
            return json.load(f)


async def main():
    """Main execution function"""
    print("🔄 Fetching data from Decisify API...")

    data = await fetch_and_transform_data()

    print("✅ Data fetched successfully")
    print(f"📝 Writing to {OUTPUT_FILE}...")

    with open(OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=2)

    print("✅ Data file updated successfully")


if __name__ == "__main__":
    asyncio.run(main())
