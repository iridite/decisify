"""
Main - FastAPI Application & Agent Orchestrator
Runs the decision loop and exposes REST API endpoints.
"""

import asyncio
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.brain import AttentionFusionEngine
from src.config import Settings, get_settings
from src.logger import get_logger, setup_logger
from src.metrics import MetricsCollector, Timer, get_metrics
from src.safety import SafetyGate
from src.schemas import SystemState
from src.sensors import AsyncPerceptionHub

# Initialize logger
settings = get_settings()
logger = setup_logger("decisify", level=settings.log_level, log_file=settings.log_file)

# Shared state between Agent Loop and API
system_state = SystemState()


class AgentOrchestrator:
    """
    The main control loop that orchestrates the decision cycle.
    Runs independently from FastAPI to avoid blocking.
    """

    def __init__(self, settings: Settings):
        """
        Args:
            settings: Application settings
        """
        self.settings = settings
        self.perception_hub = AsyncPerceptionHub()
        self.brain = AttentionFusionEngine(temperature=settings.agent_temperature)
        self.safety_gate = SafetyGate(
            max_volatility_for_buy=settings.max_volatility_for_buy,
            max_volatility_for_sell=settings.max_volatility_for_sell,
            min_confidence_threshold=settings.min_confidence_threshold,
        )
        self.metrics = get_metrics()
        self.running = False
        self.logger = get_logger(__name__)

    async def start(self):
        """Start the agent loop."""
        self.running = True
        self.logger.info("🚀 Agent Orchestrator started")
        self.logger.info(f"⏱️  Cycle interval: {self.settings.cycle_interval}s")

        try:
            while self.running:
                await self._run_cycle()
                await asyncio.sleep(self.settings.cycle_interval)
        finally:
            await self.perception_hub.close()

    async def stop(self):
        """Stop the agent loop."""
        self.running = False
        await self.perception_hub.close()
        self.logger.info("🛑 Agent Orchestrator stopped")

    async def _run_cycle(self):
        """
        Execute one complete decision cycle:
        1. Fetch signals from all sensors
        2. Process through attention fusion
        3. Validate with safety gate
        4. Update shared state
        """
        with Timer() as cycle_timer:
            cycle_start = datetime.now()

            self.logger.info(f"{'=' * 60}")
            self.logger.info(f"🔄 Cycle #{system_state.cycle_count + 1} | {cycle_start.strftime('%H:%M:%S')}")
            self.logger.info(f"{'=' * 60}")

            # Step 1: Perception
            self.logger.info("📡 Fetching signals...")
            signals = await self.perception_hub.fetch_all()

            for source, signal in signals.items():
                content = signal.raw_content[:50] if signal.raw_content else 'N/A'
                self.logger.info(f"  • {source}: {signal.value:.3f} | {content}")

            # Step 2: Cognition
            self.logger.info("🧠 Processing through attention fusion...")
            decision = self.brain.decide(signals)

            # Step 3: Safety validation
            self.logger.info("🛡️  Validating with safety gate...")
            validated_decision = self.safety_gate.validate(decision, signals)

            # Step 4: Generate natural language explanation
            explanation = self.brain.explain_decision(validated_decision, signals)
            validated_decision.explanation = explanation
            self.logger.info(f"💬 Explanation: {explanation[:100]}...")

            # Step 5: Update shared state
            system_state.latest_decision = validated_decision
            system_state.latest_signals = signals
            system_state.cycle_count += 1
            system_state.last_update = datetime.now()

            # Log the decision
            self.safety_gate.log_decision(validated_decision)

        # Record metrics
        self.metrics.record_decision_latency(cycle_timer.elapsed_ms)
        self.logger.info(f"⏱️  Cycle completed in {cycle_timer.elapsed_ms:.2f}ms")


# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage the agent loop lifecycle.
    Starts the orchestrator on startup and stops it on shutdown.
    """
    settings = get_settings()
    orchestrator = AgentOrchestrator(settings)

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
    title=settings.app_name,
    description="High-performance, logic-transparent decision engine",
    version=settings.app_version,
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "running", "service": settings.app_name, "version": settings.app_version}


@app.get("/status")
async def get_status():
    """
    Get the latest decision and system state.
    Returns the most recent DecisionChain and signal information.
    """
    with Timer() as timer:
        if system_state.latest_decision is None:
            return JSONResponse(
                status_code=503,
                content={
                    "status": "initializing",
                    "message": "No decisions yet - agent loop is warming up",
                },
            )

        response = {
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

    get_metrics().record_api_request(timer.elapsed_ms)
    return response


@app.get("/decision")
async def get_latest_decision():
    """
    Get only the latest decision (without full system state).
    Useful for lightweight polling.
    """
    with Timer() as timer:
        if system_state.latest_decision is None:
            return JSONResponse(status_code=503, content={"message": "No decisions available yet"})

        response = system_state.latest_decision.model_dump()

    get_metrics().record_api_request(timer.elapsed_ms)
    return response


@app.get("/signals")
async def get_latest_signals():
    """
    Get only the latest raw signals (without decision).
    Useful for monitoring sensor health.
    """
    with Timer() as timer:
        if not system_state.latest_signals:
            return JSONResponse(status_code=503, content={"message": "No signals available yet"})

        response = {
            source: {
                "value": signal.value,
                "timestamp": signal.timestamp.isoformat(),
                "raw_content": signal.raw_content,
            }
            for source, signal in system_state.latest_signals.items()
        }

    get_metrics().record_api_request(timer.elapsed_ms)
    return response


@app.get("/metrics")
async def get_performance_metrics(metrics_collector: MetricsCollector = Depends(get_metrics)):
    """
    Get performance metrics for monitoring.
    Includes decision latency, sensor stats, safety stats, and API stats.
    """
    return metrics_collector.get_all_stats()


if __name__ == "__main__":
    import uvicorn

    logger.info("""
    ╔═══════════════════════════════════════════════════════════╗
    ║                      DECISIFY                             ║
    ║         Logic-Transparent Decision Engine                 ║
    ╚═══════════════════════════════════════════════════════════╝
    """)
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Server: {settings.host}:{settings.port}")
    logger.info(f"Debug mode: {settings.debug}")

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        log_level=settings.log_level.lower(),
    )
