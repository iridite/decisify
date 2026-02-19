# 快速截图指南（15 分钟）

## 准备工作（2 分钟）

1. 启动后端：
   ```bash
   cd backend
   source venv/bin/activate
   python -m decisify.main
   ```

2. 启动前端（新终端）：
   ```bash
   cd frontend
   npm run dev
   ```

3. 打开浏览器：http://localhost:5173

## 需要的 3 张截图（10 分钟）

### 截图 1：Dashboard Overview（仪表板总览）
- **文件名：** `screenshots/dashboard-overview.png`
- **内容：** 完整的仪表板界面，显示所有信号卡片
- **要点：** 确保数据加载完成，显示多个信号源

### 截图 2：Signal Detail（信号详情）
- **文件名：** `screenshots/signal-detail.png`
- **内容：** 点击某个信号卡片，展开详细信息
- **要点：** 显示推理过程、置信度、数据来源

### 截图 3：Decision Flow（决策流程）
- **文件名：** `screenshots/decision-flow.png`
- **内容：** 决策流程可视化（如果有）或多信号对比视图
- **要点：** 展示系统的核心价值（多源融合）

## 截图要求

- **分辨率：** 1920x1080 或更高
- **格式：** PNG（保持清晰度）
- **大小：** 每张 < 500KB（压缩但不失真）
- **内容：** 真实数据，不要空白页面

## 保存位置

```bash
mkdir -p screenshots
# 将截图保存到 screenshots/ 目录
```

## 更新 README（3 分钟）

在 README.md 中添加截图：

```markdown
## 📸 Screenshots

### Dashboard Overview
![Dashboard](screenshots/dashboard-overview.png)

### Signal Detail
![Signal Detail](screenshots/signal-detail.png)

### Decision Flow
![Decision Flow](screenshots/decision-flow.png)
```
