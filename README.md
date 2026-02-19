# Decisify 🎯

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://iridite.github.io/decisify/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-blue?style=for-the-badge&logo=python)](https://www.python.org)
[![Rust](https://img.shields.io/badge/rust-1.75+-orange?style=for-the-badge&logo=rust)](https://www.rust-lang.org)

> **AI-powered decision intelligence platform with multi-source data integration**

**Rebel in Paradise AI Hackathon - Track 2: Co-existing with Agents & Intelligent Markets**

[🚀 **Live Demo**](https://iridite.github.io/decisify/) | [📖 Documentation](docs/) | [🎬 Demo Video](docs/DEMO_VIDEO_SCRIPT.md) | [⭐ Star this repo](https://github.com/iridite/decisify)

**[English](README.md)** | **[中文](README.zh.md)**

---

<a name="english"></a>
## 🚀 Live Demo

**Dashboard:** [https://iridite.github.io/decisify/](https://iridite.github.io/decisify/)

Experience the real-time agent intelligence monitor with perception-to-action pipeline visualization.

## 📸 Screenshots

<table>
  <tr>
    <td colspan="2">
      <img src="screenshots/dashboard-overview.png" alt="Dashboard Overview" width="100%"/>
      <p align="center"><strong>Dashboard Overview</strong> - Real-time multi-source signal aggregation and AI-powered decision intelligence</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="screenshots/signal-detail.png" alt="Signal Detail" width="100%"/>
      <p align="center"><strong>Signal Detail View</strong> - Transparent reasoning traces with confidence scores</p>
    </td>
    <td width="50%">
      <img src="screenshots/decision-flow.png" alt="Decision Flow" width="100%"/>
      <p align="center"><strong>Decision Flow</strong> - Interactive perception-to-action pipeline</p>
    </td>
  </tr>
</table>

## 🎯 Hackathon Alignment

**Target Problem (Track 2):**
> "How to design agent workflows and execution processes beyond just conversation? How can data, perception, execution, and incentives work together to enable agents to truly create value?"

**Our Solution:**
- ✅ **Beyond Chat**: Autonomous decision loop with perception → reasoning → execution workflow
- ✅ **Multi-modal Context**: Real-time signal fusion from social media, market data, and news
- ✅ **Human-Agent Symbiosis**: Dashboard with feedback loop and approval gates
- ✅ **Transparent Execution**: Full reasoning trace and attention weights for every decision
- ✅ **Safety-First Design**: Deterministic guardrails prevent unsafe actions

**Category:** Agent workflows with strong execution capabilities (beyond chat) + Data collection, feedback, and incentive mechanisms around agent intelligence

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Endpoints                        │
│                  (/status, /decision, /signals)              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ System State │ (Shared Memory)
                  └──────────────┘
                         ▲
                         │
┌────────────────────────┴────────────────────────────────────┐
│              Agent Orchestrator Loop (5s cycle)              │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Perception Hub │  │  Attention      │  │  Safety Gate    │
│  (Async Sensors)│→ │  Fusion Engine  │→ │  (Guardrails)   │
│                 │  │  Python + Rust  │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Performance Layer

Decisify uses a **hybrid architecture** combining Python's flexibility with Rust's performance:

- **Python Implementation** (`src/brain.py`): Rapid prototyping, real-time single decisions
- **Rust Acceleration** (`decisify_core`): Batch processing, backtesting, high-throughput scenarios
- **Automatic Fallback**: Rust extension is optional, automatically uses pure Python when unavailable

See [RUST_OPTIMIZATION.md](RUST_OPTIMIZATION.md) for performance benchmarks and usage recommendations.

## 🚀 Quick Start

### Backend Installation

```bash
# Install dependencies with uv
uv pip install -e .

# Or with pip
pip install -e .

# (Optional) Build Rust extension for performance
cd rust
PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 maturin develop --release
```

### Run the Backend

```bash
python main.py
```

The system will:
- Start the Agent Orchestrator loop (5-second cycles)
- Launch FastAPI server on `http://localhost:8000`
- Begin processing mock signals and making decisions

### Dashboard (Frontend)

A high-density **Agent Intelligence Monitor** dashboard for human-agent symbiosis:

```bash
cd dashboard
npm install
npm run dev
```

Visit `http://localhost:5173` to see the dashboard.

**Features**:
- 🧠 **Agent Reasoning Trace** - See how the agent thinks in real-time
- 👍 **Human Feedback Loop** - Reinforce or correct agent decisions
- ⚡ **Strategy Approval** - Human-in-the-loop execution control
- 📊 **Triangulation Matrix** - Multi-source correlation analysis
- 📡 **X Intelligence Feed** - Curated social signals
- 📈 **Polymarket Tracker** - Prediction market odds
- 🎯 **Nautilus Integration** - Quant trading signals

See [dashboard/README.md](dashboard/README.md) for detailed documentation.

### API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status with uptime and cycle count
- `GET /status` - Full system state (decision + signals + metadata)
- `GET /decision` - Latest decision only
- `GET /signals` - Latest raw signals only
- `GET /metrics` - Performance metrics (latency, sensor stats, safety gate)

### Example Request

```bash
# Get the latest decision
curl http://localhost:8000/status | jq

# Monitor in real-time
watch -n 2 'curl -s http://localhost:8000/decision | jq'

# Check system health
curl http://localhost:8000/health | jq

# View performance metrics
curl http://localhost:8000/metrics | jq
```

## 📊 Core Components

### 1. Schemas (`src/schemas.py`)
- **Signal**: Multi-modal data point from any source
- **DecisionChain**: Complete decision artifact with transparency
- **SystemState**: Shared state between agent loop and API

### 2. Sensors (`src/sensors.py`)
- **AsyncPerceptionHub**: Orchestrates concurrent signal fetching
- Resilient: Returns null signals on failure instead of crashing
- Mock data generators for immediate testing

### 3. Brain (`src/brain.py` / `src/brain_hybrid.py`)
- **AttentionFusionEngine**: Softmax-based attention mechanism
- **HybridAttentionEngine**: Python + Rust hybrid implementation
- Formula: `Weight_i = exp(Score_i) / Σ exp(Score_j)`
- Handles edge case: all-null signals → neutral decision
- Performance: 1.2-1.4x speedup for batch processing with Rust

### 4. Safety (`src/safety.py`)
- **SafetyGate**: Deterministic guardrails
- Rules:
  - Block BUY if volatility > 5%
  - Block SELL if volatility > 8%
  - Require minimum confidence threshold
- Overrides unsafe actions to HOLD

### 5. Main (`main.py`)
- **AgentOrchestrator**: Manages the decision cycle
- **FastAPI**: Non-blocking REST API
- Separate tasks: Agent loop runs independently from HTTP server

## 🧪 Testing

```bash
# Run all unit tests
pytest tests/ --ignore=tests/test_api.py -v

# Run with coverage report
pytest tests/ --ignore=tests/test_api.py --cov=src --cov-report=term-missing

# Run specific test modules
pytest tests/test_brain.py -v          # Brain/attention tests
pytest tests/test_safety.py -v         # Safety gate tests
pytest tests/test_sensors.py -v        # Sensor tests

# Run validation tests
python src/validate.py

# Run performance benchmarks
python benchmarks/benchmark.py              # Single decision benchmark
python benchmarks/benchmark_realistic.py    # End-to-end benchmark
python benchmarks/benchmark_batch.py        # Batch processing benchmark

# Check types
mypy .

# Lint
ruff check .
```

## 🔧 Configuration

Configuration can be managed via environment variables or a `.env` file:

```bash
# Copy example configuration
cp .env.example .env

# Edit configuration
nano .env
```

### Key Configuration Options

```bash
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=false

# Agent Orchestrator
CYCLE_INTERVAL=5.0          # Decision cycle frequency (seconds)
AGENT_TEMPERATURE=1.0       # Attention sharpness (lower = more focused)

# Safety Gate
MAX_VOLATILITY_BUY=0.05     # 5% volatility threshold for BUY
MAX_VOLATILITY_SELL=0.08    # 8% volatility threshold for SELL
MIN_CONFIDENCE=0.15         # Minimum confidence threshold

# Sensors
SENSOR_TIMEOUT=3.0          # Sensor timeout (seconds)
SENSOR_MAX_RETRIES=3        # Max retry attempts
SENSOR_RETRY_DELAY=0.5      # Initial retry delay (seconds)

# Logging
LOG_LEVEL=INFO              # DEBUG, INFO, WARNING, ERROR
LOG_FILE=                   # Optional log file path

# Performance
ENABLE_METRICS=true         # Enable performance tracking
METRICS_WINDOW_SIZE=100     # Metrics rolling window size
```

### Programmatic Configuration

You can also edit parameters directly in `main.py`:

```python
orchestrator = AgentOrchestrator(cycle_interval=5.0)  # Decision frequency
brain = AttentionFusionEngine(temperature=1.0)        # Attention sharpness
safety_gate = SafetyGate(
    max_volatility_for_buy=0.05,   # 5% volatility threshold
    max_volatility_for_sell=0.08,  # 8% volatility threshold
)
```

## 📝 Example Output

```
============================================================
🔄 Cycle #3 | 10:30:15
============================================================
📡 Fetching signals...
  • twitter_sentiment: 0.742 | Market looking bullish! 🚀
  • price_volatility: 0.034 | Volatility: 3.40%
  • news_feed: 0.521 | Tech sector shows strong growth

🧠 Processing through attention fusion...
🛡️  Validating with safety gate...

✅ SAFE | Action: BUY
Reasoning: Weighted signal: 0.612 | Dominant source: twitter_sentiment (42.3% weight) | Signal value: 0.742 | Context: Market looking bullish! 🚀
Weights: twitter_sentiment: 42.3%, price_volatility: 35.1%, news_feed: 22.6%

⏱️  Cycle completed in 0.43s
```

## 🛡️ Safety Features

1. **Partial Failure Handling**: If a sensor fails, system continues with available signals
2. **Null Signal Protection**: All-null scenario defaults to HOLD
3. **Volatility Guards**: Prevents risky actions during high volatility
4. **Confidence Thresholds**: Requires minimum signal strength
5. **Full Transparency**: Every decision includes reasoning and weights
6. **Performance Safety**: Automatic fallback to Python if Rust extension unavailable

## 🔮 Future Enhancements

- Real API integrations (Twitter, price feeds, news scrapers)
- Persistent storage (PostgreSQL/TimescaleDB)
- Backtesting framework with Rust acceleration
- WebSocket streaming for real-time updates
- ML-based attention score learning
- Multi-asset support
- SIMD vectorization for ultra-high throughput
- GPU acceleration for massive-scale signal processing

## 📄 License

MIT

---

