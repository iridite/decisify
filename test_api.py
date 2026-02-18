"""
Quick test script to verify Decisify API endpoints.
Run this while main.py is running in another terminal.
"""

import asyncio

import httpx


async def test_api():
    """Test all API endpoints."""
    base_url = "http://localhost:8000"

    async with httpx.AsyncClient() as client:
        print("🧪 Testing Decisify API Endpoints\n")

        # Test 1: Health check
        print("1️⃣  Testing GET /")
        response = await client.get(f"{base_url}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}\n")

        # Wait for first cycle to complete
        print("⏳ Waiting 6 seconds for first decision cycle...\n")
        await asyncio.sleep(6)

        # Test 2: Full status
        print("2️⃣  Testing GET /status")
        response = await client.get(f"{base_url}/status")
        print(f"   Status: {response.status_code}")
        data = response.json()
        print(f"   Cycle count: {data.get('cycle_count')}")
        print(f"   Action: {data.get('decision', {}).get('action')}")
        print(f"   Is safe: {data.get('decision', {}).get('is_safe')}")
        print(f"   Reasoning: {data.get('decision', {}).get('reasoning')[:80]}...\n")

        # Test 3: Decision only
        print("3️⃣  Testing GET /decision")
        response = await client.get(f"{base_url}/decision")
        print(f"   Status: {response.status_code}")
        decision = response.json()
        print(f"   Action: {decision.get('action')}")
        print(f"   Weights: {decision.get('weights')}\n")

        # Test 4: Signals only
        print("4️⃣  Testing GET /signals")
        response = await client.get(f"{base_url}/signals")
        print(f"   Status: {response.status_code}")
        signals = response.json()
        print(f"   Sources: {list(signals.keys())}")
        for source, data in signals.items():
            print(f"   • {source}: {data['value']:.3f}")

        print("\n✅ All tests passed!")


if __name__ == "__main__":
    asyncio.run(test_api())
