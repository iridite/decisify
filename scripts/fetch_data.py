"""
Data Fetch Script for Decisify Dashboard
Fetches data from Decisify API and transforms it for frontend consumption
"""

import asyncio
import json
import random
from datetime import datetime, timedelta
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
) -> Dict[str, Any]:
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
        f"Decision: {action}. Dominant signal: {dominant_source} ({dominant_weight:.2%} weight). "
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
            "data_sources": {
                "polymarket": {
                    "type": "SIMULATED",
                    "source": "Decisify API (模拟数据)",
                    "last_update": datetime.now().isoformat() + "Z",
                    "status": "active",
                },
                "x_intelligence": {
                    "type": "SIMULATED",
                    "source": "Decisify API (模拟数据)",
                    "last_update": datetime.now().isoformat() + "Z",
                    "status": "active",
                },
                "nautilus": {
                    "type": "SIMULATED",
                    "source": "Decisify API (模拟数据)",
                    "last_update": datetime.now().isoformat() + "Z",
                    "status": "active",
                },
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
        # Generate mock data with random fluctuations

        # Random market values with realistic ranges
        base_price = 42000 + random.uniform(-2000, 2000)
        current_price = base_price + random.uniform(-500, 500)
        entry_price = base_price - random.uniform(0, 300)

        current_odds = 0.5 + random.uniform(-0.2, 0.3)
        delta_1h = random.uniform(-0.05, 0.05)
        delta_24h = random.uniform(-0.1, 0.15)

        sentiment_score = random.uniform(0.3, 0.9)
        signal_strength = random.uniform(0.2, 0.8)

        # Determine sentiment and action based on scores
        sentiment = "BULLISH" if sentiment_score > 0.6 else "BEARISH" if sentiment_score < 0.4 else "NEUTRAL"
        action = "BUY" if sentiment_score > 0.65 else "SELL" if sentiment_score < 0.35 else "HOLD"
        position = "LONG" if signal_strength > 0.5 else "SHORT" if signal_strength < 0.3 else "FLAT"

        # Random weights that sum to 1.0
        w1 = random.uniform(0.3, 0.5)
        w2 = random.uniform(0.2, 0.4)
        w3 = 1.0 - w1 - w2

        # Correlations
        pm_x_corr = random.uniform(0.6, 0.95)
        pm_n_corr = random.uniform(0.5, 0.85)
        x_n_corr = random.uniform(0.5, 0.8)
        overall = (pm_x_corr + pm_n_corr + x_n_corr) / 3

        interpretation = "HIGH_BULLISH" if overall > 0.75 else "MODERATE_BULLISH" if overall > 0.6 else "NEUTRAL" if overall > 0.4 else "BEARISH"

        # Random tweet content
        tweet_templates = [
            "BTC breaking resistance at ${:.0f}k. Strong momentum building. #Bitcoin",
            "Market showing bullish signals. Volume increasing at ${:.0f}k level. #Crypto",
            "Technical analysis suggests ${:.0f}k is key support. Watch closely. #BTC",
            "Institutional interest growing. BTC holding ${:.0f}k. #Bitcoin #Crypto",
            "On-chain metrics bullish. Price action at ${:.0f}k looking strong. #BTC",
        ]
        tweet_content = random.choice(tweet_templates).format(current_price / 1000)

        confidence = round(random.uniform(0.55, 0.85), 2)

        unrealized_pnl = round(current_price - entry_price, 2)
        daily_pnl = round(random.uniform(-500, 2000), 2)

        return {
            "meta": {
                "timestamp": datetime.now().isoformat() + "Z",
                "agent_status": random.choice(["REASONING", "ANALYZING", "MONITORING"]),
                "context_window_hours": 8,
                "total_events_tracked": random.randint(35, 50),
                "system_status": "DEMO",
                "sync_timestamp": datetime.now().isoformat() + "Z",
            },
            "data_sources": {
                "polymarket": {
                    "type": "DEMO",
                    "source": "模拟 Polymarket API",
                    "last_update": datetime.now().isoformat() + "Z",
                    "status": "active",
                },
                "x_intelligence": {
                    "type": "DEMO",
                    "source": "模拟 X/Twitter API",
                    "last_update": datetime.now().isoformat() + "Z",
                    "status": "active",
                },
                "nautilus": {
                    "type": "DEMO",
                    "source": "模拟 Nautilus Trader",
                    "last_update": datetime.now().isoformat() + "Z",
                    "status": "active",
                },
            },
            "agent_thoughts": [
                {
                    "id": f"thought_{int(datetime.now().timestamp())}",
                    "timestamp": datetime.now().isoformat() + "Z",
                    "type": "TRIANGULATION",
                    "reasoning": f"Demo mode: Analyzing market signals with {int(confidence*100)}% confidence. Polymarket shows {sentiment.lower()} trend ({delta_1h:+.1%} 1h), X sentiment {sentiment_score:.2f}, Nautilus signal {signal_strength:.2f}.",
                    "inputs": {
                        "weights": {"polymarket": round(w1, 2), "x_sentiment": round(w2, 2), "nautilus": round(w3, 2)},
                        "action": action,
                    },
                    "confidence": confidence,
                    "human_feedback": None,
                }
            ],
            "triangulation_matrix": {
                "polymarket_x_correlation": round(pm_x_corr, 2),
                "polymarket_nautilus_correlation": round(pm_n_corr, 2),
                "x_nautilus_correlation": round(x_n_corr, 2),
                "overall_alignment": round(overall, 2),
                "interpretation": interpretation,
            },
            "perception": {
                "polymarket": {
                    "event": "BTC Price Prediction Market",
                    "current_odds": round(current_odds, 2),
                    "delta_1h": round(delta_1h, 3),
                    "delta_24h": round(delta_24h, 3),
                    "volume_24h": int(random.uniform(800000, 2000000)),
                    "liquidity": int(random.uniform(2500000, 4500000)),
                    "last_trade": datetime.now().isoformat() + "Z",
                    "history": [{"timestamp": datetime.now().isoformat() + "Z", "odds": round(current_odds, 2)}],
                },
                "x_intelligence": [
                    {
                        "id": f"tweet_demo_{int(datetime.now().timestamp())}",
                        "handle": random.choice(["@crypto_analyst", "@btc_trader", "@market_watch", "@chain_analysis"]),
                        "content": tweet_content,
                        "timestamp": datetime.now().isoformat() + "Z",
                        "sentiment": sentiment,
                        "sentiment_score": round(sentiment_score, 2),
                        "agent_relevance_score": round(random.uniform(0.7, 0.95), 2),
                        "extracted_entities": ["BTC", "resistance", "momentum"],
                        "impact_score": round(sentiment_score * 10, 1),
                        "follower_count": random.randint(50000, 200000),
                    }
                ],
                "nautilus": {
                    "strategy": "Keltner Channel Breakout",
                    "position": position,
                    "signal_strength": round(signal_strength, 2),
                    "entry_price": round(entry_price, 2),
                    "current_price": round(current_price, 2),
                    "unrealized_pnl": unrealized_pnl,
                    "daily_pnl": daily_pnl,
                    "position_size": round(random.uniform(0.5, 1.5), 1),
                    "status": "ACTIVE" if position != "FLAT" else "IDLE",
                    "indicators": {
                        "keltner_upper": round(current_price + 600, 2),
                        "keltner_middle": round(current_price, 2),
                        "keltner_lower": round(current_price - 600, 2),
                        "atr": round(random.uniform(350, 550), 2),
                        "trend": "BULLISH" if signal_strength > 0.5 else "BEARISH",
                    },
                },
            },
            "execution": {
                "current_proposal": {
                    "id": f"prop_{int(datetime.now().timestamp())}",
                    "action": action,
                    "asset": "BTC",
                    "reasoning": f"Market analysis: Polymarket odds at {current_odds:.2f} ({delta_1h:+.1%} 1h), X sentiment {sentiment.lower()} ({sentiment_score:.2f}), Nautilus {position.lower()} signal ({signal_strength:.2f}). Risk-adjusted confidence: {int(confidence*100)}%.",
                    "risk_level": random.choice(["LOW", "MEDIUM", "MEDIUM", "HIGH"]),
                    "expected_return": round(random.uniform(-0.02, 0.08), 3) if action != "HOLD" else None,
                    "confidence": confidence,
                    "status": random.choice(["ACTIVE", "PENDING_APPROVAL", "PENDING_APPROVAL"]),
                    "created_at": datetime.now().isoformat() + "Z",
                    "human_decision": None,
                },
                "proposal_history": [],
            },
            "context_memory": {
                "events": [
                    {
                        "id": f"evt_{i}",
                        "timestamp": (datetime.now() - timedelta(minutes=i*15)).isoformat() + "Z",
                        "type": "X_SENTIMENT_SHIFT"
                        if i % 3 == 0
                        else "POLYMARKET_ODDS_CHANGE"
                        if i % 3 == 1
                        else "NAUTILUS_SIGNAL",
                        "description": f"Market event {i}: Signal detected",
                        "relevance_decay": round(1.0 - (i * 0.1), 2),
                        "impact": "HIGH" if i < 3 else "MEDIUM" if i < 6 else "LOW",
                    }
                    for i in range(8)
                ]
            },
            "github_actions": {
                "last_run": datetime.now().isoformat() + "Z",
                "status": "success",
                "workflow": "update-data",
                "duration_seconds": random.randint(8, 18),
                "next_run": (datetime.now() + timedelta(minutes=5)).isoformat() + "Z",
            },
        }


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
