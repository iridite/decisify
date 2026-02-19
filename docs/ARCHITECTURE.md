# Decisify Architecture

## System Overview

Decisify is a high-performance, logic-transparent decision engine designed for autonomous agent workflows. The system follows a perception → reasoning → execution pipeline with complete transparency and safety guarantees.

## Architecture Diagram

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

## Core Components

### 1. Agent Orchestrator (`main.py`)

**Responsibility:** Manages the autonomous decision cycle

**Key Features:**
- Runs in a separate asyncio task (non-blocking)
- 5-second decision cycle (configurable)
- Updates shared system state
- Handles graceful shutdown

**Flow:**
```python
while running:
    signals = await perception_hub.fetch_all()
    decision = brain.decide(signals)
    safe_decision = safety_gate.validate(decision)
    system_state.update(safe_decision)
    await asyncio.sleep(cycle_interval)
```

### 2. Perception Hub (`sensors.py`)

**Responsibility:** Concurrent multi-source signal collection

**Key Features:**
- Async/await for parallel fetching
- Resilient: Returns null signals on failure
- Mock data generators for testing
- Extensible sensor interface

**Sensors:**
- `fetch_twitter_sentiment()` - Social media sentiment analysis
- `fetch_price_volatility()` - Market volatility metrics
- `fetch_news_feed()` - News sentiment and relevance

**Design Pattern:**
```python
async def fetch_all() -> List[Signal]:
    tasks = [
        fetch_twitter_sentiment(),
        fetch_price_volatility(),
        fetch_news_feed(),
    ]
    return await asyncio.gather(*tasks, return_exceptions=False)
```

### 3. Attention Fusion Engine (`brain.py` / `brain_hybrid.py`)

**Responsibility:** Multi-source signal fusion with attention mechanism

**Algorithm:**
```
Score_i = Signal.value * Signal.confidence
Weight_i = exp(Score_i / temperature) / Σ exp(Score_j / temperature)
Final_Signal = Σ (Weight_i * Signal.value)
```

**Key Features:**
- Softmax-based attention weights
- Temperature parameter for sharpness control
- Handles edge cases (all-null signals → neutral decision)
- Hybrid implementation (Python + Rust)

**Performance:**
- Python: ~0.8ms per decision
- Rust: ~0.6ms per decision (1.2-1.4x speedup)
- Automatic fallback if Rust unavailable

### 4. Safety Gate (`safety.py`)

**Responsibility:** Deterministic guardrails for safe execution

**Rules:**
- Block BUY if volatility > 5%
- Block SELL if volatility > 8%
- Require minimum confidence threshold
- Override unsafe actions to HOLD

**Design Philosophy:**
- Deterministic (no ML black box)
- Auditable (clear rule violations)
- Conservative (prefer safety over profit)

**Flow:**
```python
def validate(decision: DecisionChain) -> DecisionChain:
    if is_unsafe(decision):
        return override_to_hold(decision)
    return decision
```

### 5. System State (`schemas.py`)

**Responsibility:** Shared memory between agent loop and API

**Structure:**
```python
class SystemState:
    latest_decision: DecisionChain
    latest_signals: List[Signal]
    cycle_count: int
    last_update: datetime
```

**Thread Safety:**
- Single writer (Agent Orchestrator)
- Multiple readers (FastAPI endpoints)
- No locks needed (Python GIL + immutable updates)

### 6. FastAPI Server (`main.py`)

**Responsibility:** REST API for external access

**Endpoints:**
- `GET /` - Health check
- `GET /status` - Full system state
- `GET /decision` - Latest decision only
- `GET /signals` - Latest signals only

**Design:**
- Non-blocking (runs in separate task)
- Read-only access to system state
- CORS enabled for dashboard

## Data Flow

### 1. Signal Collection (Perception)

```
External Sources → Async Sensors → Signal Objects
                                        ↓
                                   [value, confidence, source, context]
```

### 2. Attention Fusion (Reasoning)

```
Signals → Score Calculation → Softmax Weights → Weighted Sum
                                                      ↓
                                                 Final Signal
```

### 3. Safety Validation (Execution)

```
Decision → Rule Checking → Safe/Unsafe → Override/Pass
                                              ↓
                                         Final Action
```

### 4. State Update (Memory)

```
Safe Decision → System State → API Endpoints → Dashboard
```

## Performance Characteristics

### Latency
- Signal collection: ~100-200ms (async parallel)
- Attention fusion: ~0.6-0.8ms (Rust/Python)
- Safety validation: ~0.1ms
- **Total cycle time: ~300-500ms**

### Throughput
- Single decision: ~2-3 decisions/sec
- Batch processing: ~1000+ signals/sec (Rust)
- API response: <10ms (read-only)

### Memory
- System state: ~10KB
- Signal history: ~1MB per 1000 cycles
- Dashboard assets: ~685KB (gzipped)

## Scalability Considerations

### Current Design (MVP)
- Single process
- In-memory state
- Mock data sources

### Production Enhancements
1. **Persistent Storage**
   - PostgreSQL for decision history
   - TimescaleDB for time-series signals
   - Redis for real-time state

2. **Distributed Architecture**
   - Separate perception, reasoning, execution services
   - Message queue (RabbitMQ/Kafka) for async communication
   - Load balancer for API endpoints

3. **Real Data Integration**
   - Twitter API v2 for social sentiment
   - Binance/Coinbase WebSocket for price data
   - NewsAPI for news feed

4. **Advanced Features**
   - ML-based attention weight learning
   - Multi-asset support
   - Backtesting framework
   - WebSocket streaming for real-time updates

## Security & Safety

### Input Validation
- Pydantic schemas for type safety
- Range checks for signal values
- Confidence score validation

### Execution Safety
- Deterministic guardrails
- Volatility thresholds
- Confidence minimums
- Human approval gates (dashboard)

### Monitoring
- Full decision trace logging
- Attention weight tracking
- Safety gate violation alerts
- Performance metrics

## Technology Stack

### Backend
- **Python 3.11+** - Core logic
- **FastAPI** - REST API
- **Pydantic** - Data validation
- **asyncio** - Async I/O
- **Rust** - Performance acceleration (optional)
- **PyO3** - Python-Rust bindings

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons

### DevOps
- **uv** - Fast Python package manager
- **maturin** - Rust-Python build tool
- **gh-pages** - Static site deployment
- **GitHub Actions** - CI/CD (future)

## Design Principles

1. **Transparency First** - Every decision must be explainable
2. **Safety by Default** - Conservative guardrails over aggressive optimization
3. **Performance Matters** - Sub-second latency for real-time decisions
4. **Resilience** - Partial failures should not crash the system
5. **Human-in-the-Loop** - Agents assist, humans decide on critical actions

## Future Architecture

### Phase 2: Production Ready
- Real API integrations
- Persistent storage
- WebSocket streaming
- Authentication & authorization

### Phase 3: Scale Out
- Microservices architecture
- Distributed tracing
- Auto-scaling
- Multi-region deployment

### Phase 4: Advanced Intelligence
- Reinforcement learning for attention weights
- Multi-agent coordination
- Predictive analytics
- Automated backtesting

---

**Last Updated:** 2026-02-19
