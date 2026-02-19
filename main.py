"""
Main - FastAPI Application & Agent Orchestrator
Runs the decision loop and exposes REST API endpoints.
"""

import asyncio
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI
from fastapi.responses import JSONResponse

from src.brain import AttentionFusionEngine
from src.safety import SafetyGate
from src.schemas import SystemState
from src.sensors import AsyncPerceptionHub

# Shared state between Agent Loop and API
system_state = SystemState()


class AgentOrchestrator:
    """
    The main control loop that orchestrates the decision cycle.
    Runs independently from FastAPI to avoid blocking.
    """

    def __init__(self, cycle_interval: float = 5.0):
        """
        Args:
            cycle_interval: Time between decision cycles in seconds (default: 5s)
        """
        self.cycle_interval = cycle_interval
        self.perception_hub = AsyncPerceptionHub()
        self.brain = AttentionFusionEngine(temperature=1.0)
        self.safety_gate = SafetyGate()
        self.running = False

    async def start(self):
        """Start the agent loop."""
        self.running = True
        print("🚀 Agent Orchestrator started")
        print(f"⏱️  Cycle interval: {self.cycle_interval}s\n")

        try:
            while self.running:
                await self._run_cycle()
                await asyncio.sleep(self.cycle_interval)
        finally:
            await self.perception_hub.close()

    async def stop(self):
        """Stop the agent loop."""
        self.running = False
        await self.perception_hub.close()
        print("\n🛑 Agent Orchestrator stopped")

    async def _run_cycle(self):
        """
        Execute one complete decision cycle:
        1. Fetch signals from all sensors
        2. Process through attention fusion
        3. Validate with safety gate
        4. Update shared state
        """
        cycle_start = datetime.now()

        print(f"\n{'=' * 60}")
        print(f"🔄 Cycle #{system_state.cycle_count + 1} | {cycle_start.strftime('%H:%M:%S')}")
        print(f"{'=' * 60}")

        # Step 1: Perception
        print("📡 Fetching signals...")
        signals = await self.perception_hub.fetch_all()

        for source, signal in signals.items():
            content = signal.raw_content[:50] if signal.raw_content else 'N/A'
            print(f"  • {source}: {signal.value:.3f} | {content}")

        # Step 2: Cognition
        print("\n🧠 Processing through attention fusion...")
        decision = self.brain.decide(signals)

        # Step 3: Safety validation
        print("🛡️  Validating with safety gate...")
        validated_decision = self.safety_gate.validate(decision, signals)

        # Step 4: Update shared state
        system_state.latest_decision = validated_decision
        system_state.latest_signals = signals
        system_state.cycle_count += 1
        system_state.last_update = datetime.now()

        # Log the decision
        self.safety_gate.log_decision(validated_decision)

        cycle_duration = (datetime.now() - cycle_start).total_seconds()
        print(f"\n⏱️  Cycle completed in {cycle_duration:.2f}s")


# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage the agent loop lifecycle.
    Starts the orchestrator on startup and stops it on shutdown.
    """
    orchestrator = AgentOrchestrator(cycle_interval=5.0)

    # Start the agent loop in the background
    loop_task = asyncio.create_task(orchestrator.start())

    yield  # Application is running

    # Shutdown: stop the agent loop
    await orchestrator.stop()
    loop_task.cancel()
    try:
        await loop_task
    except asyncio.CancelledError:
        pass


# FastAPI application
app = FastAPI(
    title="Decisify",
    description="High-performance, logic-transparent decision engine",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "running", "service": "Decisify", "version": "0.1.0"}


@app.get("/status")
async def get_status():
    """
    Get the latest decision and system state.
    Returns the most recent DecisionChain and signal information.
    """
    if system_state.latest_decision is None:
        return JSONResponse(
            status_code=503,
            content={
                "status": "initializing",
                "message": "No decisions yet - agent loop is warming up",
            },
        )

    return {
        "status": "active",
        "cycle_count": system_state.cycle_count,
        "last_update": system_state.last_update.isoformat(),
        "decision": system_state.latest_decision.model_dump(),
        "signals": {
            source: {
                "value": signal.value,
                "timestamp": signal.timestamp.isoformat(),
                "raw_content": signal.raw_content,
            }
            for source, signal in system_state.latest_signals.items()
        },
    }


@app.get("/decision")
async def get_latest_decision():
    """
    Get only the latest decision (without full system state).
    Useful for lightweight polling.
    """
    if system_state.latest_decision is None:
        return JSONResponse(status_code=503, content={"message": "No decisions available yet"})

    return system_state.latest_decision.model_dump()


@app.get("/signals")
async def get_latest_signals():
    """
    Get only the latest raw signals (without decision).
    Useful for monitoring sensor health.
    """
    if not system_state.latest_signals:
        return JSONResponse(status_code=503, content={"message": "No signals available yet"})

    return {
        source: {
            "value": signal.value,
            "timestamp": signal.timestamp.isoformat(),
            "raw_content": signal.raw_content,
        }
        for source, signal in system_state.latest_signals.items()
    }


if __name__ == "__main__":
    import uvicorn

    print("""
    ╔═══════════════════════════════════════════════════════════╗
    ║                      DECISIFY                             ║
    ║         Logic-Transparent Decision Engine                 ║
    ╚═══════════════════════════════════════════════════════════╝
    """)

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,  # Disable reload to prevent duplicate agent loops
        log_level="info",
    )
