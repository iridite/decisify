# Decisify 🎯

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://iridite.github.io/decisify/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-blue?style=for-the-badge&logo=python)](https://www.python.org)
[![Rust](https://img.shields.io/badge/rust-1.75+-orange?style=for-the-badge&logo=rust)](https://www.rust-lang.org)

> **AI-powered decision intelligence platform with multi-source data integration**
> **AI 驱动的决策智能平台，支持多源数据融合**

**Rebel in Paradise AI Hackathon - Track 2: Co-existing with Agents & Intelligent Markets**

[🚀 **Live Demo**](https://iridite.github.io/decisify/) | [📖 Documentation](docs/) | [🎬 Demo Video](docs/DEMO_VIDEO_SCRIPT.md) | [⭐ Star this repo](https://github.com/iridite/decisify)

[English](#english) | [中文](#中文)

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
> "如何设计智能体工作流与执行流程，而不仅是对话？数据、感知、执行与激励如何协同让智能体真正创造价值？"

**Our Solution:**
- ✅ **Beyond Chat**: Autonomous decision loop with perception → reasoning → execution workflow
- ✅ **Multi-modal Context**: Real-time signal fusion from social media, market data, and news
- ✅ **Human-Agent Symbiosis**: Dashboard with feedback loop and approval gates
- ✅ **Transparent Execution**: Full reasoning trace and attention weights for every decision
- ✅ **Safety-First Design**: Deterministic guardrails prevent unsafe actions

**Category:** 具备强执行能力的智能体工作流（不仅是聊天）+ 围绕智能体智能的数据采集、反馈与激励机制

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

Decisify 采用**混合架构**，结合 Python 的灵活性和 Rust 的性能：

- **Python 实现** (`src/brain.py`): 快速原型、实时单次决策
- **Rust 加速** (`decisify_core`): 批处理、回测、高吞吐量场景
- **自动回退**: Rust 扩展可选，未安装时自动使用纯 Python

详见 [RUST_OPTIMIZATION.md](RUST_OPTIMIZATION.md) 了解性能基准和使用建议。

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
- `GET /status` - Full system state (decision + signals + metadata)
- `GET /decision` - Latest decision only
- `GET /signals` - Latest raw signals only

### Example Request

```bash
# Get the latest decision
curl http://localhost:8000/status | jq

# Monitor in real-time
watch -n 2 'curl -s http://localhost:8000/decision | jq'
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

Edit parameters in `main.py`:

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

<a name="中文"></a>
# Decisify 🎯 中文文档

## 🚀 在线演示

**仪表盘：** [https://iridite.github.io/decisify/](https://iridite.github.io/decisify/)

体验实时智能体监控系统，可视化感知到行动的完整流程。

## 📸 系统截图

<table>
  <tr>
    <td colspan="2">
      <img src="screenshots/dashboard-overview.png" alt="仪表盘总览" width="100%"/>
      <p align="center"><strong>仪表盘总览</strong> - 实时多源信号聚合与 AI 驱动的决策智能</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="screenshots/signal-detail.png" alt="信号详情" width="100%"/>
      <p align="center"><strong>信号详情视图</strong> - 透明的推理轨迹与置信度分数</p>
    </td>
    <td width="50%">
      <img src="screenshots/decision-flow.png" alt="决策流程" width="100%"/>
      <p align="center"><strong>决策流程</strong> - 交互式感知到行动管道</p>
    </td>
  </tr>
</table>

## 🎯 Hackathon 赛题对齐

**目标问题（Track 2）：**
> "如何设计智能体工作流与执行流程，而不仅是对话？数据、感知、执行与激励如何协同让智能体真正创造价值？"

**我们的解决方案：**
- ✅ **超越对话**：自主决策循环，包含感知 → 推理 → 执行工作流
- ✅ **多模态上下文**：实时融合社交媒体、市场数据和新闻信号
- ✅ **人机共生**：带反馈循环和审批门的仪表盘
- ✅ **透明执行**：每个决策都包含完整推理轨迹和注意力权重
- ✅ **安全优先设计**：确定性护栏防止不安全操作

**类别：** 具备强执行能力的智能体工作流（不仅是聊天）+ 围绕智能体智能的数据采集、反馈与激励机制

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI 端点                             │
│                  (/status, /decision, /signals)              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  系统状态     │ (共享内存)
                  └──────────────┘
                         ▲
                         │
┌────────────────────────┴────────────────────────────────────┐
│              智能体编排循环 (5秒周期)                         │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   感知中枢      │  │   注意力        │  │   安全门        │
│  (异步传感器)   │→ │   融合引擎      │→ │  (护栏机制)     │
│                 │  │  Python + Rust  │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 性能层

Decisify 采用**混合架构**，结合 Python 的灵活性和 Rust 的性能：

- **Python 实现** (`src/brain.py`)：快速原型开发、实时单次决策
- **Rust 加速** (`decisify_core`)：批处理、回测、高吞吐量场景
- **自动回退**：Rust 扩展可选，未安装时自动使用纯 Python

详见 [RUST_OPTIMIZATION.md](RUST_OPTIMIZATION.md) 了解性能基准和使用建议。

## 🚀 快速开始

### 后端安装

```bash
# 使用 uv 安装依赖
uv pip install -e .

# 或使用 pip
pip install -e .

# （可选）构建 Rust 扩展以提升性能
cd rust
PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 maturin develop --release
```

### 运行后端

```bash
python main.py
```

系统将：
- 启动智能体编排循环（5 秒周期）
- 在 `http://localhost:8000` 启动 FastAPI 服务器
- 开始处理模拟信号并做出决策

### 仪表盘（前端）

高密度**智能体监控仪表盘**，实现人机共生：

```bash
cd dashboard
npm install
npm run dev
```

访问 `http://localhost:5173` 查看仪表盘。

**功能特性**：
- 🧠 **智能体推理轨迹** - 实时查看智能体的思考过程
- 👍 **人类反馈循环** - 强化或纠正智能体决策
- ⚡ **策略审批** - 人在回路的执行控制
- 📊 **三角验证矩阵** - 多源相关性分析
- 📡 **X 情报源** - 精选社交信号
- 📈 **Polymarket 追踪** - 预测市场赔率
- 🎯 **Nautilus 集成** - 量化交易信号

详见 [dashboard/README.md](dashboard/README.md) 获取详细文档。

### API 端点

- `GET /` - 健康检查
- `GET /status` - 完整系统状态（决策 + 信号 + 元数据）
- `GET /decision` - 仅最新决策
- `GET /signals` - 仅最新原始信号

### 示例请求

```bash
# 获取最新决策
curl http://localhost:8000/status | jq

# 实时监控
watch -n 2 'curl -s http://localhost:8000/decision | jq'
```

## 📊 核心组件

### 1. 数据模式 (`src/schemas.py`)
- **Signal**：来自任何源的多模态数据点
- **DecisionChain**：包含透明度的完整决策产物
- **SystemState**：智能体循环和 API 之间的共享状态

### 2. 传感器 (`src/sensors.py`)
- **AsyncPerceptionHub**：编排并发信号获取
- 弹性设计：失败时返回空信号而非崩溃
- 模拟数据生成器用于即时测试

### 3. 大脑 (`src/brain.py` / `src/brain_hybrid.py`)
- **AttentionFusionEngine**：基于 Softmax 的注意力机制
- **HybridAttentionEngine**：Python + Rust 混合实现
- 公式：`Weight_i = exp(Score_i) / Σ exp(Score_j)`
- 处理边缘情况：全空信号 → 中性决策
- 性能：Rust 批处理加速 1.2-1.4 倍

### 4. 安全 (`src/safety.py`)
- **SafetyGate**：确定性护栏
- 规则：
  - 波动率 > 5% 时阻止 BUY
  - 波动率 > 8% 时阻止 SELL
  - 要求最低置信度阈值
- 将不安全操作覆盖为 HOLD

### 5. 主程序 (`main.py`)
- **AgentOrchestrator**：管理决策周期
- **FastAPI**：非阻塞 REST API
- 独立任务：智能体循环独立于 HTTP 服务器运行

## 🧪 测试

```bash
# 运行验证测试
python src/validate.py

# 运行性能基准测试
python benchmarks/benchmark.py              # 单次决策基准
python benchmarks/benchmark_realistic.py    # 端到端基准
python benchmarks/benchmark_batch.py        # 批处理基准

# 类型检查
mypy .

# 代码检查
ruff check .
```

## 🔧 配置

在 `main.py` 中编辑参数：

```python
orchestrator = AgentOrchestrator(cycle_interval=5.0)  # 决策频率
brain = AttentionFusionEngine(temperature=1.0)        # 注意力锐度
safety_gate = SafetyGate(
    max_volatility_for_buy=0.05,   # 5% 波动率阈值
    max_volatility_for_sell=0.08,  # 8% 波动率阈值
)
```

## 📝 示例输出

```
============================================================
🔄 周期 #3 | 10:30:15
============================================================
📡 获取信号中...
  • twitter_sentiment: 0.742 | 市场看起来很乐观！🚀
  • price_volatility: 0.034 | 波动率：3.40%
  • news_feed: 0.521 | 科技板块显示强劲增长

🧠 通过注意力融合处理中...
🛡️  通过安全门验证中...

✅ 安全 | 操作：BUY
推理：加权信号：0.612 | 主导来源：twitter_sentiment (42.3% 权重) | 信号值：0.742 | 上下文：市场看起来很乐观！🚀
权重：twitter_sentiment: 42.3%, price_volatility: 35.1%, news_feed: 22.6%

⏱️  周期完成耗时 0.43 秒
```

## 🛡️ 安全特性

1. **部分失败处理**：如果传感器失败，系统继续使用可用信号
2. **空信号保护**：全空场景默认为 HOLD
3. **波动率防护**：在高波动期间防止风险操作
4. **置信度阈值**：要求最低信号强度
5. **完全透明**：每个决策都包含推理和权重
6. **性能安全**：Rust 扩展不可用时自动回退到 Python

## 🔮 未来增强

- 真实 API 集成（Twitter、价格源、新闻爬虫）
- 持久化存储（PostgreSQL/TimescaleDB）
- 带 Rust 加速的回测框架
- WebSocket 实时流式更新
- 基于 ML 的注意力分数学习
- 多资产支持
- SIMD 向量化实现超高吞吐量
- GPU 加速用于大规模信号处理

## 📄 许可证

MIT
