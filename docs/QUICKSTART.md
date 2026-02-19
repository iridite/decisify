# 🚀 Decisify 快速启动指南

## 📋 前置要求

- Python 3.12+
- Node.js 20+
- npm 或 yarn

## ⚡ 快速启动（5分钟）

### 1️⃣ 启动后端 API

```bash
# 在项目根目录
python main.py
```

后端将在 `http://localhost:8000` 启动。

### 2️⃣ 启动前端仪表板

```bash
# 打开新终端
cd dashboard
npm install  # 首次运行需要安装依赖
npm run dev
```

前端将在 `http://localhost:5173` 启动。

### 3️⃣ 访问仪表板

打开浏览器访问：**http://localhost:5173**

你将看到：
- 🧠 智能体推理轨迹
- 📊 三角验证矩阵
- 📡 X 智能情报流
- 📈 Polymarket 赔率追踪
- 🎯 Nautilus 量化快照
- ⚡ 策略提案系统

## 🎮 交互功能测试

### 测试人类反馈
1. 找到 "Agent Reasoning Trace" 模块
2. 点击任意推理卡片的 **👍 Correct** 或 **👎 Incorrect**
3. 观察按钮高亮变化
4. 打开浏览器控制台 → Application → Local Storage
5. 查看 `agent_feedback` 键的数据

### 测试策略批准
1. 找到 "Strategy Proposal" 模块
2. 点击 **✓ Execute** 或 **✗ Reject**
3. 观察状态变化和视觉反馈

### 测试数据更新
1. 编辑 `dashboard/public/data.json`
2. 修改第一行的 `timestamp` 为当前时间
3. 等待 30 秒（或刷新页面）
4. 观察新数据流式显示

## 📊 API 端点测试

```bash
# 健康检查
curl http://localhost:8000/

# 获取完整状态
curl http://localhost:8000/status | jq

# 仅获取决策
curl http://localhost:8000/decision | jq

# 仅获取信号
curl http://localhost:8000/signals | jq
```

## 🏗️ 生产构建

```bash
cd dashboard
npm run build
npm run preview  # 预览生产构建
```

构建产物在 `dashboard/dist/` 目录。

## 🚢 部署到 GitHub Pages

### 方法 1：自动部署（推荐）

1. 推送代码到 GitHub
2. 在仓库设置中启用 GitHub Pages
3. 选择 "GitHub Actions" 作为源
4. 推送到 main 分支会自动触发部署

### 方法 2：手动部署

```bash
cd dashboard
npm run build

# 使用 gh-pages 部署
npx gh-pages -d dist
```

## 🔧 配置选项

### 修改轮询间隔

编辑 `dashboard/src/hooks/useDataPolling.js`:

```javascript
export const useDataPolling = (pollInterval = 30000) => {
  // 改为 10 秒
  // pollInterval = 10000
}
```

### 连接真实 API

编辑 `dashboard/src/hooks/useDataPolling.js`:

```javascript
const response = await fetch('http://localhost:8000/status');
// 改为你的 API 地址
```

### 修改决策循环间隔

编辑 `main.py`:

```python
orchestrator = AgentOrchestrator(cycle_interval=5.0)
# 改为 10 秒
# orchestrator = AgentOrchestrator(cycle_interval=10.0)
```

## 🐛 故障排除

### 后端无法启动

```bash
# 检查依赖
uv pip install -e .

# 检查端口占用
lsof -i :8000
```

### 前端无法启动

```bash
# 清理并重新安装
cd dashboard
rm -rf node_modules package-lock.json
npm install
```

### 数据不更新

1. 检查浏览器控制台是否有错误
2. 确认 `data.json` 文件存在
3. 检查网络请求（F12 → Network）
4. 尝试硬刷新（Ctrl+Shift+R）

### 构建失败

```bash
# 清理缓存
cd dashboard
rm -rf dist node_modules .vite
npm install
npm run build
```

## 📚 更多文档

- [主 README](../README.md) - 项目概述
- [Dashboard README](dashboard/README.md) - 仪表板详细文档
- [Dashboard Summary](DASHBOARD_SUMMARY.md) - 项目总结
- [Rust Optimization](RUST_OPTIMIZATION.md) - 性能优化

## 🎯 下一步

1. ✅ 浏览仪表板，熟悉各个模块
2. ✅ 测试人类反馈和策略批准功能
3. ✅ 修改 `data.json` 观察数据流式更新
4. ✅ 查看 `scripts/fetch_data.py` 了解数据转换逻辑
5. ✅ 部署到 GitHub Pages 分享给他人

## 💡 提示

- 仪表板设计为**完全独立**运行，即使后端不可用也能展示模拟数据
- 所有动画都经过优化，目标 60fps 流畅度
- 使用等宽字体（JetBrains Mono）显示所有数值，确保精度
- 支持深色模式（Midnight Onyx 主题）
- 响应式设计，支持桌面和平板

## 🎉 享受使用 Decisify！

如有问题，请查看文档或提交 Issue。
