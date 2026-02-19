"""
Async Sensors - Multi-modal data ingestion with resilience.
Handles partial failures gracefully without crashing the decision loop.
"""

import asyncio
import random
from datetime import datetime
from typing import Dict, Optional

import httpx

from src.schemas import Signal


class AsyncPerceptionHub:
    """
    Orchestrates multiple async sensors and aggregates their signals.
    If a sensor fails, returns a null signal instead of raising exceptions.
    """

    def __init__(self, timeout: float = 3.0):
        self.timeout = timeout
        self.client = httpx.AsyncClient(timeout=timeout)

    async def fetch_all(self) -> Dict[str, Signal]:
        """
        Fetch signals from all sensors concurrently.
        Returns a dict mapping source name to Signal (or null signal on failure).
        """
        tasks = [
            self._safe_fetch("twitter_sentiment", self._fetch_twitter_sentiment),
            self._safe_fetch("price_volatility", self._fetch_price_volatility),
            self._safe_fetch("news_feed", self._fetch_news_sentiment),
        ]

        results = await asyncio.gather(*tasks)
        return {signal.source: signal for signal in results if signal is not None}

    async def _safe_fetch(self, source: str, fetch_func) -> Optional[Signal]:
        """
        Wrapper that catches exceptions and returns a null signal on failure.
        """
        try:
            return await fetch_func()
        except Exception as e:
            print(f"⚠️  Sensor '{source}' failed: {e}")
            return Signal(
                source=source, value=0.0, timestamp=datetime.now(), raw_content=f"ERROR: {str(e)}"
            )

    async def _fetch_twitter_sentiment(self) -> Signal:
        """
        Mock: Simulates fetching sentiment from social media.
        In production, this would call Twitter API or sentiment analysis service.
        """
        await asyncio.sleep(random.uniform(0.1, 0.5))  # Simulate network delay

        # Mock sentiment score: -1 (bearish) to +1 (bullish)
        sentiment = random.uniform(-1.0, 1.0)

        mock_tweets = [
            "Market looking bullish! 🚀",
            "Concerns about volatility today...",
            "Strong fundamentals, holding long term",
            "Profit taking in progress",
        ]

        return Signal(
            source="twitter_sentiment",
            value=sentiment,
            timestamp=datetime.now(),
            raw_content=random.choice(mock_tweets),
        )

    async def _fetch_price_volatility(self) -> Signal:
        """
        Mock: Simulates fetching price volatility metrics.
        In production, this would calculate from real-time price data.
        """
        await asyncio.sleep(random.uniform(0.1, 0.3))

        # Mock volatility: 0 (stable) to 1 (highly volatile)
        volatility = random.uniform(0.0, 0.15)

        return Signal(
            source="price_volatility",
            value=volatility,
            timestamp=datetime.now(),
            raw_content=f"Volatility: {volatility:.2%}",
        )

    async def _fetch_news_sentiment(self) -> Signal:
        """
        Mock: Simulates scraping news headlines and analyzing sentiment.
        In production, this would use BeautifulSoup + NLP models.
        """
        await asyncio.sleep(random.uniform(0.2, 0.6))

        # Mock news sentiment: -1 (negative) to +1 (positive)
        sentiment = random.uniform(-0.5, 0.8)

        mock_headlines = [
            "Tech sector shows strong growth",
            "Regulatory concerns emerge",
            "Analysts upgrade price targets",
            "Market consolidation continues",
        ]

        return Signal(
            source="news_feed",
            value=sentiment,
            timestamp=datetime.now(),
            raw_content=random.choice(mock_headlines),
        )

    async def close(self):
        """Clean up HTTP client."""
        await self.client.aclose()


class MockStreamSimulator:
    """
    Simulates a real-time data stream for testing.
    Can be used to inject specific scenarios (crashes, delays, etc.).
    """

    def __init__(self, failure_rate: float = 0.1):
        self.failure_rate = failure_rate

    async def stream_signal(self, source: str) -> Signal:
        """
        Generate a single signal with optional random failures.
        """
        if random.random() < self.failure_rate:
            raise TimeoutError(f"Simulated failure for {source}")

        await asyncio.sleep(random.uniform(0.05, 0.2))

        return Signal(
            source=source,
            value=random.uniform(-1.0, 1.0),
            timestamp=datetime.now(),
            raw_content=f"Mock data from {source}",
        )
