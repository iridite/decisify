# Decisify Screenshots

This directory contains project screenshots for documentation and Hackathon submission.

## Files


### 1. dashboard-overview.png
- **Description**: 仪表盘总览 - 展示完整的决策智能界面
- **Resolution**: 1920x1080 @2x
- **Type**: Full page


### 2. signal-detail.png
- **Description**: 信号详情 - 展示透明的推理过程
- **Resolution**: 1920x1080 @2x
- **Type**: Viewport


### 3. decision-flow.png
- **Description**: 决策流程 - 展示感知到行动的完整流程
- **Resolution**: 1920x1080 @2x
- **Type**: Viewport


## Generation

Screenshots were automatically generated using Puppeteer:
- Date: 2026-02-21
- Source: https://iridite.github.io/decisify/
- Resolution: 1920x1080 @2x DPI
- Format: PNG (lossless)
- Success: 3/3

## Usage

These screenshots are used in:
- README.md (project documentation)
- SUBMISSION.md (Hackathon submission)
- GitHub Pages (live demo documentation)

## Regeneration

To regenerate screenshots:

```bash
# 方式 1: 使用在线演示（推荐）
node scripts/take-screenshots.js

# 方式 2: 使用本地服务
# 1. 启动后端
python main.py &

# 2. 启动前端
cd dashboard && npm run dev &

# 3. 运行脚本（使用本地地址）
DEMO_URL=http://localhost:5173 node scripts/take-screenshots.js
```

## Tips

- 确保页面完全加载后再截图
- 使用高 DPI 设置获得清晰的截图
- 截图应展示项目的核心功能和亮点
- 保持截图文件大小合理（< 500KB）
