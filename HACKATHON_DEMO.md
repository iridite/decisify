# Decisify Dashboard - Hackathon Demo Guide

## 🚀 快速启动

```bash
cd dashboard
npm run dev
# 访问 http://localhost:5173
```

## ⌨️ 键盘快捷键（Demo Mode）

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+D` | 开启/关闭 Demo 模式 |
| `Space` 或 `Ctrl+P` | 播放/暂停自动演示 |
| `Ctrl+F` | 全屏模式 |
| `Ctrl+1/2/3` | 切换演示速度（1x/2x/3x）|

## 🎯 Hackathon 演示流程

### 1. 开场（30秒）
- 打开仪表板，展示初始加载动画
- 按 `Ctrl+D` 进入 Demo 模式
- 介绍 Decisify 的核心概念：**Perception → Reasoning → Execution**

### 2. 核心功能展示（2分钟）

#### Agent Reasoning Trace（左侧主面板）
- 实时显示 AI Agent 的推理过程
- 三种推理类型：
  - 🟢 **TRIANGULATION**: 跨数据源验证
  - 🔵 **SENTIMENT_ANALYSIS**: 社交媒体情感分析
  - 🟠 **RISK_ASSESSMENT**: 风险评估和安全门控
- 置信度可视化（动态进度条）
- 人类反馈机制（👍 Correct / 👎 Incorrect）

#### Triangulation Matrix（右上）
- 展示三个数据源的相关性矩阵：
  - Polymarket（预测市场）
  - X Intelligence（Twitter 情感）
  - Nautilus（量化交易信号）
- Overall Alignment 显示整体一致性

#### X Intelligence Feed（右侧）
- 实时 Twitter 情感流
- 每条推文显示：
  - 情感标签（BULLISH/BEARISH/NEUTRAL）
  - Impact Score（影响力评分）
  - Agent Relevance（AI 相关性评分）

#### Polymarket Odds Tracker（底部大卡片）
- 实时预测市场概率曲线
- 渐变填充的 Area Chart
- 显示 1h Delta 和 24h 交易量

#### Strategy Proposal（右下）
- AI 生成的策略建议
- 风险等级评估
- 人类审批机制（Execute / Reject）

### 3. Demo 模式特性（1分钟）
- 按 `Space` 启动自动播放
- 每 5 秒生成一个新的 Agent Thought
- 展示流式动画效果：
  - Glitch 文字效果
  - 扫描线动画
  - 粒子场背景
  - Matrix 数据雨（Agent 思考时）
- 按 `Ctrl+2` 切换到 2x 速度，加快演示

### 4. 技术亮点（1分钟）
- **前端技术栈**：
  - React 18 + Vite（极速构建）
  - Framer Motion（60fps 动画）
  - Tailwind CSS（原子化样式）
  - Recharts（金融级图表）
- **性能优化**：
  - Code Splitting（6 个 vendor chunks）
  - PWA 支持（离线可用）
  - Gzip 压缩后仅 194KB
  - 首屏加载 < 1 秒
- **部署方案**：
  - GitHub Pages 静态托管
  - GitHub Actions 自动更新数据
  - 无需后端服务器

### 5. 架构创新（30秒）
- **Attention Fusion Mechanism**：
  - 多模态感知（Polymarket + Twitter + Quant）
  - 动态权重调整
  - 三角验证机制
- **Human-in-the-Loop**：
  - Agent 提出建议，人类最终决策
  - 反馈循环改进 AI 推理
- **Context Memory**：
  - 8 小时滑动窗口
  - 事件相关性衰减
  - 127 个事件追踪

## 🎨 视觉效果说明

### 颜色系统
- `#00ffc2` (Iridyne Green): 主色调，代表 AI 活跃状态
- `#f59e0b` (Volatility Orange): 警告色，风险提示
- `#09090b` (Midnight Onyx): 背景色，Bloomberg Terminal 风格
- `#27272a` (Border Subtle): 边框色，Bento Grid 分隔

### 动画效果
- **脉动指示器**: System Live 状态
- **Glitch 效果**: Agent 思考时的文字抖动
- **扫描线**: 终端美学
- **粒子场**: 背景氛围
- **数据雨**: Matrix 风格，Agent 推理时触发

## 📊 数据流说明

### 生产环境
```
GitHub Actions (每 5 分钟)
  ↓
调用 Decisify API
  ↓
生成 data.json
  ↓
推送到 GitHub
  ↓
前端轮询 data.json (每 30 秒)
  ↓
Framer Motion 流式动画
```

### Demo 模式
```
按 Space 启动
  ↓
每 5 秒生成假数据
  ↓
模拟 Agent 推理过程
  ↓
逐条流式显示
  ↓
触发视觉效果
```

## 🏆 评委关注点

### 技术深度
- ✅ Python/Rust 混合架构（后端）
- ✅ React 18 + Vite 现代前端
- ✅ 60fps 动画性能
- ✅ PWA 离线支持

### 创新性
- ✅ Attention Fusion 多模态感知
- ✅ Human-in-the-Loop 决策流程
- ✅ 三角验证机制
- ✅ Context Memory 滑动窗口

### 实用性
- ✅ 真实数据源（Polymarket, Twitter, Nautilus）
- ✅ 可部署到 GitHub Pages
- ✅ 无需后端服务器
- ✅ 完整的错误处理

### 用户体验
- ✅ Bloomberg Terminal 美学
- ✅ 流畅的动画过渡
- ✅ 键盘快捷键
- ✅ 响应式布局

## 🐛 常见问题

### Q: Demo 模式不工作？
A: 确保按 `Ctrl+D` 而不是单独的 `D` 键

### Q: 动画卡顿？
A: 检查浏览器硬件加速是否开启（Chrome Settings → System）

### Q: 数据不更新？
A: Demo 模式下数据是模拟的，生产模式需要 GitHub Actions 运行

### Q: 全屏模式退出？
A: 按 `Esc` 或再次按 `Ctrl+F`

## 📦 构建和部署

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview

# 部署到 GitHub Pages
git push origin main
# GitHub Actions 自动部署
```

## 🎯 演示脚本（3分钟版本）

**[0:00-0:30]** "大家好，这是 Decisify，一个 AI Agent 智能决策仪表板。它将多模态感知转化为可执行的策略建议。"

**[0:30-1:30]** "核心创新是 Attention Fusion 机制：我们同时监听 Polymarket 预测市场、Twitter 情感、和量化交易信号，通过三角验证确保决策可靠性。左侧是 Agent 的实时推理轨迹，你可以看到它如何分析数据、评估风险、并生成建议。"

**[1:30-2:00]** "让我开启 Demo 模式展示实时效果。[按 Ctrl+D] 注意这些视觉效果：扫描线、粒子场、数据雨——都是为了营造 Bloomberg Terminal 的专业氛围。[按 Space 启动自动播放]"

**[2:00-2:30]** "关键是 Human-in-the-Loop 设计：AI 提出建议，但最终决策权在人类手中。你可以给 Agent 反馈，它会学习改进。这是负责任的 AI 应用。"

**[2:30-3:00]** "技术栈：React + Framer Motion 实现 60fps 动画，Vite 构建仅需 4 秒，PWA 支持离线使用。部署在 GitHub Pages，完全免费。谢谢！"

## 🔗 相关链接

- GitHub Repo: `https://github.com/<username>/decisify`
- Live Demo: `https://<username>.github.io/decisify/`
- API Docs: `/docs/api.md`
- Architecture: `/docs/architecture.md`

---

**祝你在 Hackathon 中取得好成绩！🚀**
