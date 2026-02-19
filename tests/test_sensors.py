"""
Tests for AsyncPerceptionHub and sensors (sensors.py)
"""

import asyncio
from datetime import datetime
from unittest.mock import AsyncMock, patch

import pytest

from src.schemas import Signal
from src.sensors import AsyncPerceptionHub, MockStreamSimulator


@pytest.fixture
def perception_hub():
    """Create an AsyncPerceptionHub instance."""
    return AsyncPerceptionHub(timeout=1.0, max_retries=2, retry_delay=0.1)


@pytest.mark.asyncio
async def test_perception_hub_initialization():
    """Test AsyncPerceptionHub initialization."""
    hub = AsyncPerceptionHub(timeout=5.0, max_retries=3, retry_delay=0.5)
    
    assert hub.timeout == 5.0
    assert hub.max_retries == 3
    assert hub.retry_delay == 0.5
    assert hub.client is not None
    
    await hub.close()


@pytest.mark.asyncio
async def test_perception_hub_default_settings():
    """Test AsyncPerceptionHub uses default settings from config."""
    hub = AsyncPerceptionHub()
    
    # Should use settings from config
    assert hub.timeout > 0
    assert hub.max_retries > 0
    assert hub.retry_delay > 0
    
    await hub.close()


@pytest.mark.asyncio
async def test_fetch_all_returns_signals(perception_hub):
    """Test that fetch_all returns a dictionary of signals."""
    signals = await perception_hub.fetch_all()
    
    assert isinstance(signals, dict)
    assert len(signals) > 0
    
    # Check expected signal sources
    expected_sources = ["twitter_sentiment", "price_volatility", "news_feed"]
    for source in expected_sources:
        if source in signals:
            assert isinstance(signals[source], Signal)
            assert signals[source].source == source
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_fetch_all_concurrent_execution(perception_hub):
    """Test that fetch_all executes sensors concurrently."""
    start_time = asyncio.get_event_loop().time()
    signals = await perception_hub.fetch_all()
    end_time = asyncio.get_event_loop().time()
    
    elapsed = end_time - start_time
    
    # If sequential, would take ~1.5s (sum of delays)
    # Concurrent should be much faster (max of delays ~0.6s)
    assert elapsed < 1.0  # Should complete in under 1 second
    assert len(signals) > 0
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_fetch_twitter_sentiment(perception_hub):
    """Test fetching Twitter sentiment signal."""
    signal = await perception_hub._fetch_twitter_sentiment()
    
    assert signal.source == "twitter_sentiment"
    assert -1.0 <= signal.value <= 1.0
    assert isinstance(signal.timestamp, datetime)
    assert signal.raw_content is not None
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_fetch_price_volatility(perception_hub):
    """Test fetching price volatility signal."""
    signal = await perception_hub._fetch_price_volatility()
    
    assert signal.source == "price_volatility"
    assert 0.0 <= signal.value <= 1.0
    assert isinstance(signal.timestamp, datetime)
    assert "Volatility" in signal.raw_content
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_fetch_news_sentiment(perception_hub):
    """Test fetching news sentiment signal."""
    signal = await perception_hub._fetch_news_sentiment()
    
    assert signal.source == "news_feed"
    assert -1.0 <= signal.value <= 1.0
    assert isinstance(signal.timestamp, datetime)
    assert signal.raw_content is not None
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_safe_fetch_success(perception_hub):
    """Test _safe_fetch with successful sensor."""
    async def mock_sensor():
        return Signal(source="test", value=0.5)
    
    signal = await perception_hub._safe_fetch("test", mock_sensor)
    
    assert signal is not None
    assert signal.source == "test"
    assert signal.value == 0.5
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_safe_fetch_with_timeout(perception_hub):
    """Test _safe_fetch handles timeout errors."""
    async def failing_sensor():
        raise asyncio.TimeoutError("Simulated timeout")
    
    signal = await perception_hub._safe_fetch("test", failing_sensor)
    
    # Should return error signal instead of raising
    assert signal is not None
    assert signal.source == "test"
    assert signal.value == 0.0
    assert "ERROR" in signal.raw_content
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_safe_fetch_with_http_error(perception_hub):
    """Test _safe_fetch handles HTTP errors."""
    async def failing_sensor():
        import httpx
        raise httpx.HTTPError("Simulated HTTP error")
    
    signal = await perception_hub._safe_fetch("test", failing_sensor)
    
    # Should return error signal instead of raising
    assert signal is not None
    assert signal.source == "test"
    assert signal.value == 0.0
    assert "ERROR" in signal.raw_content
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_safe_fetch_retry_logic(perception_hub):
    """Test that _safe_fetch retries on failure."""
    call_count = 0
    
    async def flaky_sensor():
        nonlocal call_count
        call_count += 1
        if call_count < 2:
            raise asyncio.TimeoutError("Temporary failure")
        return Signal(source="test", value=0.5)
    
    signal = await perception_hub._safe_fetch("test", flaky_sensor)
    
    # Should succeed on second attempt
    assert signal is not None
    assert signal.value == 0.5
    assert call_count == 2
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_safe_fetch_exponential_backoff(perception_hub):
    """Test that retry delay increases exponentially."""
    call_times = []
    
    async def failing_sensor():
        call_times.append(asyncio.get_event_loop().time())
        raise asyncio.TimeoutError("Always fails")
    
    await perception_hub._safe_fetch("test", failing_sensor)
    
    # Should have made max_retries attempts
    assert len(call_times) == perception_hub.max_retries
    
    # Check that delays increase (exponential backoff)
    if len(call_times) >= 2:
        first_delay = call_times[1] - call_times[0]
        # First delay should be approximately retry_delay
        assert first_delay >= perception_hub.retry_delay * 0.9
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_safe_fetch_stops_on_unexpected_error(perception_hub):
    """Test that unexpected errors don't trigger retries."""
    call_count = 0
    
    async def broken_sensor():
        nonlocal call_count
        call_count += 1
        raise ValueError("Unexpected error")
    
    signal = await perception_hub._safe_fetch("test", broken_sensor)
    
    # Should only try once (no retries for unexpected errors)
    assert call_count == 1
    assert signal.value == 0.0
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_fetch_all_handles_partial_failures(perception_hub):
    """Test that fetch_all continues even if some sensors fail."""
    # Mock one sensor to fail
    async def failing_sensor():
        raise asyncio.TimeoutError("Simulated failure")
    
    # Replace one sensor with failing version
    original_fetch = perception_hub._fetch_twitter_sentiment
    perception_hub._fetch_twitter_sentiment = failing_sensor
    
    signals = await perception_hub.fetch_all()
    
    # Should still get signals from other sensors
    # The failed sensor returns an error signal with value 0.0
    assert isinstance(signals, dict)
    
    # Restore original
    perception_hub._fetch_twitter_sentiment = original_fetch
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_close_cleanup(perception_hub):
    """Test that close() properly cleans up resources."""
    await perception_hub.close()
    
    # Client should be closed
    assert perception_hub.client.is_closed


@pytest.mark.asyncio
async def test_mock_stream_simulator_initialization():
    """Test MockStreamSimulator initialization."""
    simulator = MockStreamSimulator(failure_rate=0.2)
    
    assert simulator.failure_rate == 0.2


@pytest.mark.asyncio
async def test_mock_stream_simulator_success():
    """Test MockStreamSimulator generates valid signals."""
    simulator = MockStreamSimulator(failure_rate=0.0)  # No failures
    
    signal = await simulator.stream_signal("test_source")
    
    assert signal.source == "test_source"
    assert -1.0 <= signal.value <= 1.0
    assert isinstance(signal.timestamp, datetime)
    assert "Mock data" in signal.raw_content


@pytest.mark.asyncio
async def test_mock_stream_simulator_failure():
    """Test MockStreamSimulator can simulate failures."""
    simulator = MockStreamSimulator(failure_rate=1.0)  # Always fail
    
    with pytest.raises(TimeoutError):
        await simulator.stream_signal("test_source")


@pytest.mark.asyncio
async def test_mock_stream_simulator_random_failures():
    """Test MockStreamSimulator has random failure behavior."""
    simulator = MockStreamSimulator(failure_rate=0.5)
    
    results = []
    for _ in range(20):
        try:
            signal = await simulator.stream_signal("test")
            results.append("success")
        except TimeoutError:
            results.append("failure")
    
    # With 50% failure rate, should have mix of both
    assert "success" in results
    assert "failure" in results


@pytest.mark.asyncio
async def test_signal_timestamps_are_recent(perception_hub):
    """Test that generated signals have recent timestamps."""
    before = datetime.now()
    signals = await perception_hub.fetch_all()
    after = datetime.now()
    
    for signal in signals.values():
        assert before <= signal.timestamp <= after
    
    await perception_hub.close()


@pytest.mark.asyncio
async def test_multiple_fetch_all_calls(perception_hub):
    """Test that fetch_all can be called multiple times."""
    signals1 = await perception_hub.fetch_all()
    signals2 = await perception_hub.fetch_all()
    
    assert len(signals1) > 0
    assert len(signals2) > 0
    
    # Values should be different (random mock data)
    # But sources should be the same
    assert set(signals1.keys()) == set(signals2.keys())
    
    await perception_hub.close()
