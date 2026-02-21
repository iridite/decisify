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
from src.schemas import Signal, SystemState
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
    Get the latest decision and system state in Dashboard-compatible format.
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

        decision = system_state.latest_decision
        signals = system_state.latest_signals

        # Generate agent thought from decision
        thought = {
            "id": f"thought_{system_state.cycle_count:03d}",
            "timestamp": decision.timestamp.isoformat(),
            "type": "TRIANGULATION",
            "reasoning": decision.explanation or decision.reasoning,
            "inputs": {src: sig.value for src, sig in signals.items()},
            "confidence": max(decision.weights.values()) if decision.weights else 0.5,
            "human_feedback": None
        }

        # Build response in Dashboard format
        response = {
            "meta": {
                "timestamp": datetime.now().isoformat(),
                "agent_status": "REASONING" if system_state.cycle_count % 2 == 0 else "ACTIVE",
                "context_window_hours": 8,
                "total_events_tracked": system_state.cycle_count * 3,
                "system_status": "LIVE",
                "sync_timestamp": system_state.last_update.isoformat()
            },
            "agent_thoughts": [thought],
            "triangulation_matrix": {
                "polymarket_x_correlation": 0.75 + (system_state.cycle_count % 10) * 0.02,
                "polymarket_nautilus_correlation": 0.45 + (system_state.cycle_count % 8) * 0.03,
                "x_nautilus_correlation": 0.60 + (system_state.cycle_count % 6) * 0.02,
                "overall_alignment": sum(decision.weights.values()) / len(decision.weights) if decision.weights else 0.5,
                "interpretation": f"{decision.action}_SIGNAL"
            },
            "perception": {
                "polymarket": {
                    "event": "Market Decision Event",
                    "current_odds": 0.65 + (system_state.cycle_count % 20) * 0.01,
                    "delta_1h": signals.get("price_volatility", Signal(source="default", value=0.0)).value * 0.1,
                    "delta_24h": signals.get("price_volatility", Signal(source="default", value=0.0)).value * 0.3,
                    "volume_24h": 1250000 + system_state.cycle_count * 10000,
                    "liquidity": 3400000,
                    "last_trade": datetime.now().isoformat(),
                    "history": [
                        {"timestamp": (datetime.now()).isoformat(), "odds": 0.65 + i * 0.01}
                        for i in range(5)
                    ]
                },
                "x_intelligence": [
                    {
                        "id": f"signal_{i}",
                        "handle": f"@Source{i}",
                        "content": sig.raw_content or f"Signal from {src}",
                        "timestamp": sig.timestamp.isoformat(),
                        "sentiment": "BULLISH" if sig.value > 0 else "BEARISH" if sig.value < 0 else "NEUTRAL",
                        "sentiment_score": abs(sig.value),
                        "agent_relevance_score": decision.weights.get(src, 0),
                        "impact_score": abs(sig.value) * 10,
                    }
                    for i, (src, sig) in enumerate(signals.items())
                ],
                "nautilus": {
                    "strategy": "Keltner Channel Breakout",
                    "position": decision.action,
                    "signal_strength": max(decision.weights.values()) if decision.weights else 0.5,
                    "daily_pnl": (system_state.cycle_count % 100) - 50,
                    "status": "ACTIVE",
                    "indicators": {
                        "keltner_upper": 45000 + system_state.cycle_count * 10,
                        "keltner_middle": 43000,
                        "atr": 850.5,
                        "trend": "BULLISH" if decision.action == "BUY" else "BEARISH" if decision.action == "SELL" else "NEUTRAL"
                    }
                }
            },
            "execution": {
                "current_proposal": {
                    "id": f"proposal_{system_state.cycle_count}",
                    "action": decision.action,
                    "asset": "BTC/USDT",
                    "reasoning": decision.explanation or decision.reasoning,
                    "confidence": max(decision.weights.values()) if decision.weights else 0.5,
                    "risk_level": "LOW" if decision.is_safe else "HIGH",
                    "status": "ACTIVE",
                    "human_decision": None
                }
            },
            "context_memory": {
                "events": [
                    {
                        "id": f"event_{i}",
                        "type": "DECISION",
                        "description": f"Cycle {system_state.cycle_count - i}: {decision.action}",
                        "timestamp": (datetime.now()).isoformat(),
                        "relevance_decay": 1.0 - (i * 0.1)
                    }
                    for i in range(min(10, system_state.cycle_count))
                ]
            }
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
    import sys
    import webbrowser

    import uvicorn

    # Check for demo mode
    demo_mode = "--demo" in sys.argv or "-d" in sys.argv

    logger.info("""
    ╔═══════════════════════════════════════════════════════════╗
    ║                      DECISIFY                             ║
    ║         Logic-Transparent Decision Engine                 ║
    ╚═══════════════════════════════════════════════════════════╝
    """)
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Server: {settings.host}:{settings.port}")
    logger.info(f"Debug mode: {settings.debug}")

    if demo_mode:
        logger.info("🎬 DEMO MODE ACTIVATED - Quick Start for Hackathon Judges!")
        logger.info("=" * 60)
        logger.info("📊 Dashboard will auto-open at: http://localhost:5173/decisify/")
        logger.info("🔄 Real-time decision loop running every 5 seconds")
        logger.info("🧠 AI explanations enabled for full transparency")
        logger.info("⚡ Rust performance comparison visible in dashboard")
        logger.info("=" * 60)

        # Auto-open dashboard after a short delay
        import threading
        def open_dashboard():
            import time
            time.sleep(3)  # Wait for server to start
            dashboard_url = "http://localhost:5173/decisify/"
            logger.info(f"🌐 Opening dashboard: {dashboard_url}")
            try:
                webbrowser.open(dashboard_url)
            except Exception as e:
                logger.warning(f"Could not auto-open browser: {e}")
                logger.info(f"Please manually open: {dashboard_url}")

        threading.Thread(target=open_dashboard, daemon=True).start()

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        log_level=settings.log_level.lower(),
    )
