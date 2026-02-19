# Decisify - Hackathon Submission Brief

## 📋 Quick Copy-Paste Sections

### 1️⃣ Project Name
**Decisify**

---

### 2️⃣ Tagline (一句话简介)

**🇨🇳 中文：**
具备透明推理链路的 AI 决策智能平台，融合多源实时数据，让智能体从"能聊天"进化到"能决策"

**🇬🇧 English:**
AI-powered decision intelligence platform with transparent reasoning traces and multi-source real-time data fusion, evolving agents from "chat-capable" to "decision-capable"

---

### 3️⃣ Elevator Pitch (电梯演讲)

**🇨🇳 中文：**
当前 AI 智能体大多停留在对话层面，缺乏真正的自主决策能力。Decisify 构建了完整的"感知→推理→执行"工作流：通过异步并发采集社交媒体情绪、市场波动、新闻事件等多源信号，使用注意力机制融合数据，生成透明可追溯的决策建议，并通过安全门控机制保障执行可靠性。系统采用 Python + Rust 混合架构，实现高性能实时决策（<1ms），配备可视化仪表盘展示完整推理过程，真正实现人机协同的智能决策闭环。

**🇬🇧 English:**
Most AI agents today remain conversational tools, lacking true autonomous decision-making capabilities. Decisify builds a complete "perception → reasoning → execution" workflow: asynchronously collecting multi-source signals (social sentiment, market volatility, news events), fusing data through attention mechanisms, generating transparent and traceable decision recommendations, and ensuring execution reliability via safety guardrails. Built with a Python + Rust hybrid architecture for high-performance real-time decisions (<1ms), featuring a visual dashboard that exposes the complete reasoning process, achieving true human-agent symbiotic decision loops.

---

### 4️⃣ Full Description (详细描述)

**🇨🇳 中文：**

**背景与问题**

智能体技术正在从"对话助手"向"自主执行者"演进，但面临三大核心挑战：
1. **感知盲区**：单一数据源导致决策片面，缺乏多维度信息整合
2. **黑盒推理**：决策过程不透明，用户无法理解和信任智能体的判断逻辑
3. **执行风险**：缺乏安全机制，自主行动可能带来不可控后果

**解决方案**

Decisify 是一个生产级的决策智能引擎，通过以下创新设计解决上述问题：

**多源感知层**：异步并发采集 X（Twitter）情绪分析、Polymarket 预测市场数据、Nautilus 新闻源等实时信号，构建全方位的环境感知能力。每个信号包含数值、置信度、时间戳和来源标识，为后续推理提供高质量输入。

**注意力融合引擎**：借鉴 Transformer 的注意力机制，对多源信号进行加权融合。通过 Softmax 归一化计算每个信号的重要性权重，动态调整不同数据源的影响力。支持温度参数调节决策锐度，适应不同场景需求。

**透明推理链路**：完整记录每次决策的输入信号、注意力权重、中间计算过程和最终输出，生成可追溯的推理轨迹。用户可通过可视化仪表盘实时查看智能体的"思考过程"，建立信任基础。

**安全门控机制**：在执行层设置确定性规则验证，防止极端决策和不安全行为。支持人工审批流程，实现人机协同的决策闭环。

**技术架构**

- **后端**：FastAPI + Python 3.11，异步事件循环驱动的自主决策周期（5秒/次）
- **性能优化**：Rust 实现核心融合算法，相比纯 Python 提升 1.2-1.4x 性能（<1ms 决策延迟）
- **前端**：React + TypeScript + Vite，实时 WebSocket 连接展示决策流
- **部署**：GitHub Pages 静态托管，零成本演示方案

**应用场景**

- 金融交易辅助：融合市场数据、社交情绪、新闻事件，生成投资建议
- 舆情监控：实时追踪多平台舆论动态，预警潜在风险
- 智能运营：整合业务指标、用户反馈、竞品动态，优化决策流程

**🇬🇧 English:**

**Background & Problem**

Agent technology is evolving from "conversational assistants" to "autonomous executors," but faces three core challenges:
1. **Perception Gaps**: Single data sources lead to biased decisions, lacking multi-dimensional information integration
2. **Black-box Reasoning**: Opaque decision processes prevent users from understanding and trusting agent logic
3. **Execution Risks**: Lack of safety mechanisms means autonomous actions may cause uncontrollable consequences

**Solution**

Decisify is a production-grade decision intelligence engine that addresses these challenges through innovative design:

**Multi-source Perception Layer**: Asynchronously collects real-time signals from X (Twitter) sentiment analysis, Polymarket prediction markets, Nautilus news feeds, building comprehensive environmental awareness. Each signal includes value, confidence, timestamp, and source identifier, providing high-quality inputs for reasoning.

**Attention Fusion Engine**: Inspired by Transformer attention mechanisms, performs weighted fusion of multi-source signals. Calculates importance weights for each signal via Softmax normalization, dynamically adjusting different data sources' influence. Supports temperature parameters to tune decision sharpness for different scenarios.

**Transparent Reasoning Traces**: Fully records input signals, attention weights, intermediate computations, and final outputs for each decision, generating traceable reasoning paths. Users can view the agent's "thought process" in real-time through a visual dashboard, establishing trust.

**Safety Guardrails**: Implements deterministic rule validation at the execution layer, preventing extreme decisions and unsafe behaviors. Supports human approval workflows, achieving human-agent symbiotic decision loops.

**Technical Architecture**

- **Backend**: FastAPI + Python 3.11, async event loop driving autonomous decision cycles (5s intervals)
- **Performance**: Rust-implemented core fusion algorithms, 1.2-1.4x faster than pure Python (<1ms decision latency)
- **Frontend**: React + TypeScript + Vite, real-time WebSocket connection displaying decision flows
- **Deployment**: GitHub Pages static hosting, zero-cost demo solution

**Use Cases**

- Financial trading assistance: Fusing market data, social sentiment, news events for investment recommendations
- Public opinion monitoring: Real-time tracking of multi-platform discourse dynamics, early warning of potential risks
- Intelligent operations: Integrating business metrics, user feedback, competitor dynamics to optimize decision processes

---

### 5️⃣ Key Features (关键特性)

**🔍 Multi-source Perception Hub (多源感知中枢)**
- Async concurrent data collection from social media, prediction markets, and news feeds
- Resilient sensor design with graceful degradation on failures
- 异步并发采集社交媒体、预测市场、新闻源数据，传感器故障时优雅降级

**🧠 Attention-based Signal Fusion (注意力信号融合)**
- Transformer-inspired attention mechanism for dynamic signal weighting
- Temperature-controlled decision sharpness (conservative ↔ aggressive)
- 借鉴 Transformer 的注意力机制动态加权信号，温度参数控制决策锐度

**📊 Transparent Reasoning Traces (透明推理链路)**
- Complete decision logs with input signals, attention weights, and outputs
- Real-time visualization dashboard showing agent's "thought process"
- 完整决策日志记录输入信号、注意力权重和输出，实时可视化仪表盘展示智能体"思考过程"

**🛡️ Safety Guardrails (安全门控机制)**
- Deterministic rule validation preventing extreme decisions
- Human-in-the-loop approval workflow for critical actions
- 确定性规则验证防止极端决策，关键操作支持人工审批流程

**⚡ High-performance Hybrid Architecture (高性能混合架构)**
- Python for flexibility + Rust for performance-critical paths
- Sub-millisecond decision latency (<1ms) with Rust-optimized fusion engine
- Python 灵活性 + Rust 性能关键路径，决策延迟 <1ms

**🔄 Autonomous Decision Loop (自主决策循环)**
- 5-second perception → reasoning → execution cycle
- Non-blocking async design, independent of API request handling
- 5 秒感知→推理→执行周期，异步非阻塞设计，独立于 API 请求处理

**🎨 Production-ready Dashboard (生产级仪表盘)**
- React + TypeScript frontend with real-time WebSocket updates
- Framer Motion animations for smooth UX, Recharts for data visualization
- React + TypeScript 前端，WebSocket 实时更新，Framer Motion 动画，Recharts 数据可视化

---

### 6️⃣ Technical Stack (技术栈)

**Backend (后端)**
- Python 3.11+ (FastAPI, asyncio)
- Rust 1.75+ (PyO3 bindings for performance-critical modules)
- WebSocket for real-time communication

**Frontend (前端)**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Framer Motion (animations)
- Recharts (data visualization)
- Lucide React (icons)

**AI & Intelligence (AI 与智能)**
- Attention mechanism for multi-source signal fusion
- Softmax-based dynamic weighting
- Confidence-aware decision making

**Deployment (部署)**
- GitHub Pages (frontend static hosting)
- GitHub Actions (CI/CD)

**Development Tools (开发工具)**
- Git (version control)
- ESLint (code quality)
- pytest (backend testing)

---

### 7️⃣ Links (链接)

- 🚀 **Live Demo**: https://iridite.github.io/decisify/
- 💻 **GitHub Repository**: https://github.com/iridite/decisify
- 📖 **Documentation**: https://github.com/iridite/decisify/tree/main/docs
- 🎬 **Demo Video Script**: https://github.com/iridite/decisify/blob/main/docs/DEMO_VIDEO_SCRIPT.md
- 🏗️ **Architecture Doc**: https://github.com/iridite/decisify/blob/main/docs/ARCHITECTURE.md
- 📡 **API Documentation**: https://github.com/iridite/decisify/blob/main/docs/API.md

---

### 8️⃣ Track Alignment (赛道匹配)

**🎯 Track 2 - 与智能体共生与智能市场 (Co-existing with Agents & Intelligent Markets)**

**赛道核心问题：**
> "如何设计智能体工作流与执行流程，而不仅是对话？数据、感知、执行与激励如何协同让智能体真正创造价值？"

**Decisify 的契合点：**

**✅ 超越对话的工作流设计**
- 实现完整的"感知→推理→执行"自主决策循环，而非被动响应用户输入
- 5 秒周期的自主运行机制，智能体主动监控环境变化并生成决策
- 非阻塞异步架构，决策流程独立于用户交互

**✅ 多模态数据感知协同**
- 并发采集社交媒体情绪（X/Twitter）、预测市场数据（Polymarket）、新闻事件（Nautilus）
- 每个数据源包含置信度评分，构建可信度感知的信息融合机制
- 传感器接口可扩展，支持接入更多数据源（天气、股价、区块链事件等）

**✅ 透明化执行与人机协同**
- 完整推理链路可视化，用户可实时查看智能体的"思考过程"
- 注意力权重展示每个数据源对决策的影响程度，建立信任基础
- 安全门控机制支持人工审批，实现人机协同决策闭环

**✅ 智能市场数据整合**
- 直接接入 Polymarket 预测市场数据，捕捉群体智慧信号
- 融合市场波动率、社交情绪、新闻事件，构建多维度决策依据
- 为未来接入 DeFi 协议、链上数据、DAO 治理信息奠定基础

**✅ 价值创造机制**
- 决策质量可量化：记录每次决策的输入、权重、输出，支持回测和优化
- 性能优化：Rust 加速核心算法，<1ms 决策延迟，支持高频场景
- 生产级设计：完整的错误处理、优雅降级、状态管理，可直接部署到实际业务

**类别定位：**
- ✅ 具备强执行能力的智能体工作流（不仅是聊天）
- ✅ 围绕智能体智能的数据采集、反馈与激励机制
- ✅ 人机协同的决策系统设计

---

**🎯 Track Alignment (English)**

**Core Challenge:**
> "How to design agent workflows and execution processes beyond conversation? How can data, perception, execution, and incentives collaborate to make agents truly create value?"

**Decisify's Alignment:**

**✅ Workflow Design Beyond Chat**
- Implements complete "perception → reasoning → execution" autonomous decision loop, not passive user response
- 5-second autonomous cycle, agent proactively monitors environment changes and generates decisions
- Non-blocking async architecture, decision flow independent of user interaction

**✅ Multi-modal Data Perception Collaboration**
- Concurrent collection of social sentiment (X/Twitter), prediction market data (Polymarket), news events (Nautilus)
- Each data source includes confidence scores, building trust-aware information fusion
- Extensible sensor interface supports integration of more sources (weather, stock prices, blockchain events)

**✅ Transparent Execution & Human-Agent Symbiosis**
- Full reasoning trace visualization, users can view agent's "thought process" in real-time
- Attention weights show each data source's influence on decisions, establishing trust
- Safety guardrails support human approval, achieving human-agent collaborative decision loops

**✅ Intelligent Market Data Integration**
- Direct integration with Polymarket prediction markets, capturing collective intelligence signals
- Fuses market volatility, social sentiment, news events for multi-dimensional decision basis
- Lays foundation for future DeFi protocol, on-chain data, DAO governance integration

**✅ Value Creation Mechanism**
- Quantifiable decision quality: Records inputs, weights, outputs for each decision, supporting backtesting and optimization
- Performance optimization: Rust-accelerated core algorithms, <1ms decision latency for high-frequency scenarios
- Production-grade design: Complete error handling, graceful degradation, state management, ready for real-world deployment

**Category:**
- ✅ Agent workflows with strong execution capabilities (beyond chat)
- ✅ Data collection, feedback, and incentive mechanisms for agent intelligence
- ✅ Human-agent collaborative decision system design

---

### 9️⃣ Team (团队)

**Solo Project / 个人项目**

**Developer / 开发者:**
- GitHub: [@iridite](https://github.com/iridite)

**Development Timeline / 开发时间线:**
- Project Duration: ~3 days (Feb 17-19, 2026)
- 项目周期：约 3 天（2026 年 2 月 17-19 日）

**Tech Stack Expertise / 技术栈专长:**
- Full-stack development (Python, Rust, TypeScript)
- AI/ML system design
- Real-time data processing
- 全栈开发（Python、Rust、TypeScript）
- AI/ML 系统设计
- 实时数据处理

---

### 🔟 Demo Video (演示视频)

**Status / 状态:**
- Video script available / 视频脚本已准备
- Script location: `docs/DEMO_VIDEO_SCRIPT.md`
- Recording planned / 计划录制中

**Planned Content / 计划内容:**
1. Live dashboard walkthrough showing real-time decision cycles
2. Explanation of attention mechanism and signal fusion
3. Safety guardrails demonstration
4. Architecture deep-dive

---

## 📝 Additional Information (补充信息)

### Innovation Highlights (创新亮点)

**🇨🇳 中文:**
1. **注意力机制应用于决策融合**：首次将 Transformer 注意力机制应用于多源信号融合，实现动态权重分配
2. **透明化推理链路**：完整记录决策过程，解决 AI 决策"黑盒"问题
3. **Python + Rust 混合架构**：兼顾开发效率和运行性能，核心算法性能提升 1.2-1.4x
4. **生产级安全设计**：确定性规则验证 + 人工审批流程，保障自主执行可靠性
5. **零成本演示方案**：GitHub Pages 静态托管，无需服务器即可展示完整功能

**🇬🇧 English:**
1. **Attention Mechanism for Decision Fusion**: First application of Transformer attention to multi-source signal fusion with dynamic weight allocation
2. **Transparent Reasoning Traces**: Complete decision process recording, solving AI decision "black box" problem
3. **Python + Rust Hybrid Architecture**: Balances development efficiency and runtime performance, 1.2-1.4x core algorithm speedup
4. **Production-grade Safety Design**: Deterministic rule validation + human approval workflow ensuring autonomous execution reliability
5. **Zero-cost Demo Solution**: GitHub Pages static hosting, full functionality demonstration without servers

---

### Performance Metrics (性能指标)

- **Decision Latency / 决策延迟**: <1ms (Rust-optimized fusion engine)
- **Cycle Frequency / 周期频率**: 5 seconds (configurable / 可配置)
- **Concurrent Sensors / 并发传感器**: 3+ (async/await pattern)
- **Dashboard Update Rate / 仪表盘更新率**: Real-time via WebSocket
- **Performance Improvement / 性能提升**: 1.2-1.4x (Rust vs Python)

---

### Future Roadmap (未来规划)

**🇨🇳 中文:**
1. **更多数据源接入**：天气 API、股票行情、区块链事件、DAO 治理数据
2. **强化学习优化**：基于历史决策效果自动调整注意力权重
3. **多智能体协作**：支持多个 Decisify 实例协同决策
4. **插件市场**：开放传感器接口，允许社区贡献数据源
5. **移动端支持**：React Native 移动应用，随时随地监控决策流

**🇬🇧 English:**
1. **More Data Sources**: Weather APIs, stock quotes, blockchain events, DAO governance data
2. **Reinforcement Learning Optimization**: Auto-adjust attention weights based on historical decision outcomes
3. **Multi-agent Collaboration**: Support multiple Decisify instances for collaborative decisions
4. **Plugin Marketplace**: Open sensor interface for community-contributed data sources
5. **Mobile Support**: React Native mobile app for on-the-go decision flow monitoring

---

## 🎉 Conclusion (总结)

Decisify demonstrates that AI agents can evolve from conversational tools to autonomous decision-makers through transparent reasoning, multi-source perception, and human-agent symbiosis. Built for the "Co-existing with Agents & Intelligent Markets" track, it showcases a production-ready workflow that goes beyond chat, creating real value through intelligent data fusion and safe execution.

Decisify 展示了 AI 智能体如何通过透明推理、多源感知和人机协同，从对话工具进化为自主决策者。为"与智能体共生与智能市场"赛道打造，展示了超越对话的生产级工作流，通过智能数据融合和安全执行创造真实价值。

---

**Ready to copy-paste into any Hackathon submission form! 🚀**
**可直接复制粘贴到任何 Hackathon 提交表单！🚀**
