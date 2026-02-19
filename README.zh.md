# Decisify 🎯

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://iridite.github.io/decisify/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-blue?style=for-the-badge&logo=python)](https://www.python.org)
[![Rust](https://img.shields.io/badge/rust-1.75+-orange?style=for-the-badge&logo=rust)](https://www.rust-lang.org)

> **AI 驱动的决策智能平台，支持多源数据融合**

**Rebel in Paradise AI Hackathon - Track 2: Co-existing with Agents & Intelligent Markets**

[🚀 **在线演示**](https://iridite.github.io/decisify/) | [📖 文档](docs/) | [🎬 演示视频](docs/DEMO_VIDEO_SCRIPT.md) | [⭐ Star this repo](https://github.com/iridite/decisify)

**[English](README.md)** | **[中文](README.zh.md)**

---

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
│  感知中心        │  │  注意���融合引擎  │  │  安全门          │
│  (异步传感器)    │→ │  Python + Rust  │→ │  (护栏)         │
│                 │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 性能层

Decisify 采用**混合架构**，结合 Python 的灵活性和 Rust 的性能：

- **Python 实现** (`src/brain.py`): 快速原型、实时单次决策
- **Rust 加速** (`decisify_core`): 批处理、回测、高吞吐量场景
- **自动回退**: Rust 扩展可选，未安装时自动使用纯 Python

详见 [RUST_OPTIMIZATION.md](RUST_OPTIMIZATION.md) 了解性能基准和使用建议。

## 🚀 快速开始

### 后端安装

```bash
# 克隆仓库
git clone https://github.com/iridite/decisify.git
cd decisify

# 安装 Python 依赖
pip install -r requirements.txt

# (可选) 构建 Rust 加速扩展
cd rust
cargo build --release
cd ..

# 启动后端服务器
python main.py
```

服务器将在 `http://localhost:8000` 启动

### 前端安装

```bash
cd dashboard
npm install
npm run dev
```

前端将在 `http://localhost:5173` 启动

### 运行测试

```bash
# API 测试
python tests/test_api.py

# 性能基准测试
python benchmarks/benchmark.py
python benchmarks/benchmark_batch.py
python benchmarks/benchmark_realistic.py
```

## 🧠 核心组件

### 1. 感知中心 (`src/sensors.py`)
异步多源数据采集：
- **社交媒体监控**：Twitter/X 情绪分析
- **市场数据**：实时价格和交易量
- **新闻聚合**：突发事件检测
- **技术指标**：RSI、MACD、布林带

### 2. 注意力融合引擎 (`src/brain.py`)
多头注意力机制，用于信号优先级排序：
```python
attention_weights = softmax(Q @ K.T / sqrt(d_k)) @ V
```
- 动态权重分配
- 上下文感知融合
- 置信度评分

### 3. 安全门 (`src/safety.py`)
确定性护栏系统：
- 仓位限制（最大 30%）
- 波动率检查
- 流动性验证
- 市场时间门控

### 4. 实时仪表盘 (`dashboard/`)
React + TypeScript 前端：
- WebSocket 实时更新
- 交互式信号可视化
- 决策审批界面
- 推理轨迹查看器

## 📊 示例输出

```json
{
  "decision": "HOLD",
  "confidence": 0.73,
  "reasoning": "混合信号：技术指标看涨（RSI=45），但新闻情绪中性",
  "signals": [
    {
      "source": "technical",
      "value": 0.65,
      "weight": 0.4,
      "metadata": {"rsi": 45, "macd": "bullish"}
    },
    {
      "source": "sentiment",
      "value": 0.52,
      "weight": 0.3,
      "metadata": {"twitter_score": 0.1}
    }
  ],
  "safety_checks": {
    "position_limit": "PASS",
    "volatility": "PASS",
    "market_hours": "PASS"
  }
}
```

## 🔒 安全特性

1. **确定性护栏**：硬编码限制，AI 无法绕过
2. **人工审批**：高风险决策需要确认
3. **完整审计日志**：所有决策都有可追溯的推理
4. **沙盒执行**：测试模式用于验证
5. **优雅降级**：传感器故障时的回退机制

## 🎯 未来增强

- [ ] 多智能体协作（共识机制）
- [ ] 强化学习优化（PPO/A3C）
- [ ] 链上执行（智能合约集成）
- [ ] 高级风险模型（VaR、压力测试）
- [ ] 自然语言查询界面

## 📚 文档

- [快速开始指南](docs/QUICKSTART.md)
- [提交简介](docs/SUBMISSION_BRIEF.md)
- [优化机会](docs/OPTIMIZATION_OPPORTUNITIES.md)
- [演示视频脚本](docs/DEMO_VIDEO_SCRIPT.md)
- [Rust 优化](RUST_OPTIMIZATION.md)

## 🤝 贡献

欢迎贡献！请查看我们的 [贡献指南](CONTRIBUTING.md)。

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

为 **Rebel in Paradise AI Hackathon** 构建 - 探索智能体与智能市场的共存。

---

**由 [iridite](https://github.com/iridite) 用 ❤️ 和 🤖 构建**
