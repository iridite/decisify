# Decisify 🎯

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://iridite.github.io/decisify/)
[![CI Status](https://img.shields.io/github/actions/workflow/status/iridite/decisify/ci.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/iridite/decisify/actions)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.10+-blue?style=for-the-badge&logo=python)](https://www.python.org)
[![Rust](https://img.shields.io/badge/rust-1.75+-orange?style=for-the-badge&logo=rust)](https://www.rust-lang.org)
[![Code Quality](https://img.shields.io/badge/code%20quality-A-brightgreen?style=for-the-badge)](https://github.com/iridite/decisify)

<div align="center">
  <img src="logo.svg" alt="Decisify Logo" width="120" />

  ### AI 驱动的决策智能平台，支持多源数据融合

  [🚀 **在线演示**](https://iridite.github.io/decisify/) | [📖 文档](docs/) | [🎬 演示视频](docs/DEMO_VIDEO_SCRIPT.md) | [⚡ 快速开始](#-快速开始)
</div>

**[English](README.md)** | **[中文](README.zh.md)**

## 🏆 Hackathon Track 2 对齐

> **挑战：** *"如何设计超越对话的 Agent 工作流和执行流程？数据、感知、执行和激励如何协同工作，使 Agent 真正创造价值？"*

**Decisify 的答案：**

<table>
<tr>
<td width="50%">

### 🎯 问题所在
当前 AI Agent 困在**对话模式**中：
- ❌ 被动：等待用户输入
- ❌ 单一来源：有限的上下文
- ❌ 黑盒：不透明的推理
- ❌ 不安全：没有执行护栏

</td>
<td width="50%">

### ✅ 我们的解决方案
Decisify 是一个**真正的自主 Agent**：
- ✅ **自主**：5 秒决策循环
- ✅ **多源**：Twitter + Polymarket + 新闻融合
- ✅ **透明**：完整注意力权重可视化
- ✅ **安全**：确定性规则 + 人工审批

</td>
</tr>
</table>

**这不是聊天机器人。这是一个决策智能系统。**

### 为什么 Decisify 赢得 Track 2

| 要求 | 传统 Agent | Decisify |
|------|-----------|----------|
| **超越聊天** | 被动问答 | ✅ 自主 5 秒决策周期 |
| **数据感知** | 单一 LLM 知识 | ✅ 实时多源融合 |
| **执行安全** | 提示工程 | ✅ 确定性护栏 + 人在回路 |
| **透明度** | 黑盒 | ✅ 完整推理轨迹 + 注意力权重 |
| **性能** | 纯 Python | ✅ Rust 加速（1.4x 更快）|
| **可扩展性** | 硬编码逻辑 | ✅ 基于插件的传感器架构 |

## 📖 项目概述

Decisify 是一个高性能、逻辑透明的 AI 决策引擎，通过融合多源信号（社交媒体、市场数据、新闻）实现自主决策循环。系统采用 Python + Rust 混合架构，提供完整的感知→推理→执行工作流，并配备实时监控仪表板实现人机协同。

**核心特性：**
- 🧠 **透明推理**：每个决策都包含完整的推理轨迹和注意力权重
- ⚡ **高性能**：Rust 加速的批处理，1.2-1.4x 性能提升
- 🛡️ **安全优先**：确定性防护栏防止不安全操作
- 🔄 **自主循环**：5 秒决策周期，无需人工干预
- 📊 **实时监控**：高密度仪表板展示 Agent 智能状态
- 🌐 **多源融合**：基于 Softmax 的注意力机制整合异构信号

**适用场景：**
- 量化交易决策
- 风险管理系统
- 智能投顾平台
- 市场情报分析

## 💡 创新亮点：为什么 Decisify 脱颖而出

### 🆚 Decisify vs 传统 AI Agent

| 特性 | 传统 AI Agent | Decisify |
|------|--------------|----------|
| **决策模式** | 🔴 被动：等待用户提问 | ✅ **自主：5 秒自驱动循环** |
| **数据源** | 🔴 单一 LLM 知识库 | ✅ **多源融合：Twitter + Polymarket + 新闻** |
| **推理** | 🔴 黑盒：隐藏逻辑 | ✅ **透明：完整注意力权重可视化** |
| **安全性** | 🔴 提示工程（可绕过）| ✅ **确定性护栏 + 人工审批** |
| **性能** | 🔴 纯 Python (~2-5ms) | ✅ **Rust 加速 (<1ms, 1.4x 更快)** |
| **可扩展性** | 🔴 硬编码逻辑 | ✅ **基于插件的传感器架构** |
| **可解释性** | 🔴 通用响应 | ✅ **每个决策的自然语言解释** |
| **人机协作** | 🔴 单向交互 | ✅ **反馈循环 + 审批门** |

### 🎯 关键技术创新

1. **决策融合的注意力机制** 🧠
   - 首次将 Transformer 风格注意力应用于多源信号融合
   - 动态权重分配：`Weight_i = exp(Score_i / T) / Σ exp(Score_j / T)`
   - 温度控制决策锐度（保守 ↔ 激进）

2. **透明推理链** 🔍
   - 每个决策包含完整推理轨迹
   - 注意力权重显示每个源的影响
   - 自然语言解释："我决定 BUY 基于强信号..."

3. **混合 Python + Rust 架构** ⚡
   - Python 用于快速原型和灵活性
   - Rust 用于性能关键路径（1.2-1.4x 加速）
   - Rust 不可用时自动降级到纯 Python

4. **生产级安全设计** 🛡️
   - AI 无法绕过的确定性规则
   - 多层验证：波动率检查 + 置信度阈值
   - 高风险操作的人在回路审批

5. **实时自主循环** 🔄
   - 非阻塞异步架构
   - 独立决策周期（不依赖 API 请求）
   - 主动环境监控

## 🚀 主要功能

### 1. 多源信号感知
- **异步传感器中心**：并发获取多个数据源
- **容错设计**：单个传感器失败不影响整体系统
- **支持的信号类型**：
  - 社交媒体情绪（Twitter/X）
  - 市场价格波动率
  - 新闻情感分析
  - 预测市场赔率（Polymarket）
  - 量化交易信号（Nautilus）

### 2. 注意力融合引擎
- **Softmax 注意力机制**：`Weight_i = exp(Score_i) / Σ exp(Score_j)`
- **温度控制**：调节注意力集中度
- **边界情况处理**：全空信号自动降级为中性决策
- **混合实现**：Python 原型 + Rust 加速

### 3. 安全防护系统
- **波动率防护**：
  - BUY 操作：波动率 > 5% 时阻止
  - SELL 操作：波动率 > 8% 时阻止
- **置信度阈值**：要求最低信号强度
- **自动降级**：不安全操作强制转为 HOLD

### 4. 实时监控仪表板
- 🧠 Agent 推理轨迹可视化
- 👍 人类反馈循环
- ⚡ 策略审批（人在回路）
- 📊 多源关联矩阵
- 📡 X 情报信息流
- 📈 Polymarket 追踪器
- 🎯 Nautilus 集成

## 🛠️ 技术栈

### 后端
- **Python 3.10+**：核心逻辑和 API
- **FastAPI**：高性能异步 Web 框架
- **Pydantic**：数据验证和序列化
- **Rust**：性能关键路径加速（可选）
- **PyO3/Maturin**：Python-Rust 互操作

### 前端
- **React 18**：UI 框架
- **TypeScript**：类型安全
- **Vite**：构建工具
- **TailwindCSS**：样式系统
- **Recharts**：数据可视化

### 开发工具
- **uv**：Python 包管理器
- **pytest**：测试框架
- **ruff**：代码检查和格式化
- **mypy**：静态类型检查

## 🎮 在线演示

**仪表盘：** [https://iridite.github.io/decisify/](https://iridite.github.io/decisify/)

体验实时 Agent 智能监控，包含感知-行动管道可视化。

### 截图预览

<table>
  <tr>
    <td colspan="2">
      <img src="screenshots/dashboard-overview.png" alt="仪表盘总览" width="100%"/>
      <p align="center"><strong>仪表盘总览</strong> - 实时多源信号聚合和 AI 决策智能</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="screenshots/signal-detail.png" alt="信号详情" width="100%"/>
      <p align="center"><strong>信号详情视图</strong> - 透明推理轨迹和置信度分数</p>
    </td>
    <td width="50%">
      <img src="screenshots/decision-flow.png" alt="决策流程" width="100%"/>
      <p align="center"><strong>决策流程</strong> - 交互式感知-行动管道</p>
    </td>
  </tr>
</table>

## 🚀 快速开始

### ⚡ 一键部署（推荐）

```bash
# 克隆仓库
git clone https://github.com/iridite/decisify.git
cd decisify

# 运行快速启动脚本
./quick-start.sh
```

脚本将自动完成：
1. ✅ 检查系统依赖（Python 3.10+, Node.js 18+）
2. 📦 安装后端和前端依赖
3. ⚡ 可选构建 Rust 性能扩展
4. 🚀 启动后端和前端服务
5. 🎉 在 http://localhost:5173 打开仪表盘

**按 `Ctrl+C` 停止所有服务。**

### 📋 手动安装

<details>
<summary>点击展开手动安装步骤</summary>

#### 环境要求

- Python 3.10 或更高版本
- Node.js 18+（仅前端需要）
- Rust 1.75+（可选，用于性能加速）

#### 后端安装与运行

##### 1. 安装依赖

```bash
# 使用 uv（推荐）
uv pip install -e .

# 或使用 pip
pip install -e .

# 安装开发依赖
uv pip install -e ".[dev]"
```

##### 2. (可选) 构建 Rust 扩展

```bash
cd rust
PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 maturin develop --release
cd ..
```

> **注意**：Rust 扩展是可选的。如果不安装，系统会自动使用纯 Python 实现。

##### 3. 启动后端服务

```bash
uv run python main.py
```

服务将在 `http://localhost:8000` 启动。

**系统启动后会：**
- 启动 Agent 编排循环（5 秒周期）
- 启动 FastAPI 服务器
- 开始处理模拟信号并做出决策

#### 前端安装与运行

```bash
cd dashboard
npm install
npm run dev
```

访问 `http://localhost:5173` 查看仪表板。

详细文档请参考 [dashboard/README.md](dashboard/README.md)。

</details>

### API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/` | GET | 健康检查 |
| `/health` | GET | 详细健康状态（运行时间、周期计数） |
| `/status` | GET | 完整系统状态（决策 + 信号 + 元数据） |
| `/decision` | GET | 仅最新决策 |
| `/signals` | GET | 仅最新原始信号 |
| `/metrics` | GET | 性能指标（延迟、传感器统计、安全门） |

### 示例请求

```bash
# 获取最新决策
curl http://localhost:8000/status | jq

# 实时监控
watch -n 2 'curl -s http://localhost:8000/decision | jq'

# 检查系统健康
curl http://localhost:8000/health | jq

# 查看性能指标
curl http://localhost:8000/metrics | jq
```

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI 端点                             │
│                  (/status, /decision, /signals)              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ 系统状态      │ (共享内存)
                  └──────────────┘
                         ▲
                         │
┌────────────────────────┴────────────────────────────────────┐
│              智能体编排循环 (5秒周期)                         │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  感知中心        │  │  注意力融合引擎  │  │  安全门          │
│  (异步传感器)    │→ │  Python + Rust  │→ │  (护栏)         │
│                 │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 性能层

Decisify 使用 **混合架构**，结合 Python 的灵活性和 Rust 的性能：

- **Python 实现** (`src/brain.py`)：快速原型、实时单决策
- **Rust 加速** (`decisify_core`)：批处理、回测、高吞吐场景
- **自动降级**：Rust 扩展可选，不可用时自动使用纯 Python

性能基准和使用建议请参考 [RUST_OPTIMIZATION.md](RUST_OPTIMIZATION.md)。

## 📊 核心组件

### 1. Schemas (`src/schemas.py`)
- **Signal**：来自任何源的多模态数据点
- **DecisionChain**：包含透明度的完整决策工件
- **SystemState**：Agent 循环和 API 之间的共享状态

### 2. Sensors (`src/sensors.py`)
- **AsyncPerceptionHub**：编排并发信号获取
- 弹性设计：失败时返回空信号而非崩溃
- 模拟数据生成器用于即时测试

### 3. Brain (`src/brain.py` / `src/brain_hybrid.py`)
- **AttentionFusionEngine**：基于 Softmax 的注意力机制
- **HybridAttentionEngine**：Python + Rust 混合实现
- 公式：`Weight_i = exp(Score_i) / Σ exp(Score_j)`
- 边界情况处理：全空信号 → 中性决策
- 性能：Rust 批处理提速 1.2-1.4x

### 4. Safety (`src/safety.py`)
- **SafetyGate**：确定性防护栏
- 规则：
  - 波动率 > 5% 时阻止 BUY
  - 波动率 > 8% 时阻止 SELL
  - 要求最低置信度阈值
- 将不安全操作覆盖为 HOLD

### 5. Main (`main.py`)
- **AgentOrchestrator**：管理决策周期
- **FastAPI**：非阻塞 REST API
- 独立任务：Agent 循环独立于 HTTP 服务器运行

## 🔧 配置

### 环境变量配置

```bash
# 复制示例配置
cp .env.example .env

# 编辑配置
nano .env
```

### 主要配置选项

```bash
# 服务器
HOST=0.0.0.0
PORT=8000
DEBUG=false

# Agent 编排器
CYCLE_INTERVAL=5.0          # 决策周期频率（秒）
AGENT_TEMPERATURE=1.0       # 注意力锐度（越低越集中）

# 安全门
MAX_VOLATILITY_BUY=0.05     # BUY 的 5% 波动率阈值
MAX_VOLATILITY_SELL=0.08    # SELL 的 8% 波动率阈值
MIN_CONFIDENCE=0.15         # 最低置信度阈值

# 传感器
SENSOR_TIMEOUT=3.0          # 传感器超时（秒）
SENSOR_MAX_RETRIES=3        # 最大重试次数
SENSOR_RETRY_DELAY=0.5      # 初始重试延迟（秒）

# 日志
LOG_LEVEL=INFO              # DEBUG, INFO, WARNING, ERROR
LOG_FILE=                   # 可选日志文件路径

# 性能
ENABLE_METRICS=true         # 启用性能跟踪
METRICS_WINDOW_SIZE=100     # 指标滚动窗口大小
```

### 程序化配置

也可以直接在 `main.py` 中编辑参数：

```python
orchestrator = AgentOrchestrator(cycle_interval=5.0)  # 决策频率
brain = AttentionFusionEngine(temperature=1.0)        # 注意力锐度
safety_gate = SafetyGate(
    max_volatility_for_buy=0.05,   # 5% 波动率阈值
    max_volatility_for_sell=0.08,  # 8% 波动率阈值
)
```

## 🧪 测试

```bash
# 运行所有单元测试
pytest tests/ --ignore=tests/test_api.py -v

# 运行覆盖率报告
pytest tests/ --ignore=tests/test_api.py --cov=src --cov-report=term-missing

# 运行特定测试模块
pytest tests/test_brain.py -v          # Brain/注意力测试
pytest tests/test_safety.py -v         # 安全门测试
pytest tests/test_sensors.py -v        # 传感器测试

# 运行验证测试
uv run python src/validate.py

# 运行性能基准测试
uv run python benchmarks/benchmark.py              # 单决策基准
uv run python benchmarks/benchmark_realistic.py    # 端到端基准
uv run python benchmarks/benchmark_batch.py        # 批处理基准

# 类型检查
mypy .

# 代码检查
ruff check .
```

## 📝 示例输出

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

## 🛡️ 安全特性

1. **部分失败处理**：传感器失败时，系统继续使用可用信号
2. **空信号保护**：全空场景默认为 HOLD
3. **波动率防护**：高波动期间防止风险操作
4. **置信度阈值**：要求最低信号强度
5. **完全透明**：每个决策包含推理和权重
6. **性能安全**：Rust 扩展不可用时自动降级到 Python

## 🎯 Hackathon 对齐

**目标问题（Track 2）：**
> "如何设计超越对话的 Agent 工作流和执行流程？数据、感知、执行和激励如何协同工作，使 Agent 真正创造价值？"

**我们的解决方案：**
- ✅ **超越聊天**：感知 → 推理 → 执行的自主决策循环
- ✅ **多模态上下文**：融合社交媒体、市场数据和新闻的实时信号
- ✅ **人机共生**：带反馈循环和审批门的仪表板
- ✅ **透明执行**：每个决策的完整推理轨迹和注意力权重
- ✅ **安全优先设计**：确定性防护栏防止不安全操作

**类别：** 具有强执行能力的 Agent 工作流（超越聊天）+ Agent 智能周围的数据收集、反馈和激励机制

**活动：** Rebel in Paradise AI Hackathon - Track 2: Co-existing with Agents & Intelligent Markets

## 🔮 未来增强

- 真实 API 集成（Twitter、价格源、新闻爬虫）
- 持久化存储（PostgreSQL/TimescaleDB）
- 基于 Rust 加速的回测框架
- WebSocket 流式传输实时更新
- 基于 ML 的注意力分数学习
- 多资产支持
- SIMD 矢量化实现超高吞吐量
- GPU 加速大规模信号处理

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎贡献！请随时提交 Issue 或 Pull Request。

## 📞 联系方式

- **项目主页**：[https://github.com/iridite/decisify](https://github.com/iridite/decisify)
- **在线演示**：[https://iridite.github.io/decisify/](https://iridite.github.io/decisify/)
- **文档**：[docs/](docs/)

**Built with ❤️ for Rebel in Paradise AI Hackathon**