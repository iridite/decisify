# Decisify - Slidev 演示制作指南

## 🎉 已完成的工作

✅ Slidev 项目已创建并配置完成
✅ 完整的 10 页演示文稿（3分钟）
✅ 中英双语内容
✅ 演讲者备注（用于 AI 配音）
✅ 截图已复制到项目中

## 📁 项目结构

```
demo-slides/
├── slides.md              # 演示文稿主文件
├── package.json           # 项目配置
├── public/
│   └── screenshots/       # 项目截图
└── node_modules/          # 依赖包
```

## 🚀 快速开始

### 1. 启动开发服务器

```bash
cd demo-slides
npm run dev
```

然后在浏览器中打开 `http://localhost:3030`

### 2. 预览演示

- 使用 **方向键** 或 **空格键** 切换幻灯片
- 按 **F** 进入全屏模式
- 按 **O** 查看演示概览
- 按 **D** 进入演讲者模式（显示备注）

## 🎬 制作视频的步骤

### 方案 A：录制 + AI 配音（推荐）

#### 步骤 1：生成 AI 配音（10分钟）

**安装 edge-tts**：
```bash
pip install edge-tts
```

**提取演讲者备注**：
我已经在每页幻灯片的 `<!-- -->` 注释中写好了中英文配音脚本。

**生成配音文件**：

```bash
cd /home/yixian/Playground/decisify/demo-slides

# 第1页 - 开场（20秒）
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "大家好，我是 Decisify 的开发者。今天我将用 3 分钟向大家展示，如何让 AI 智能体从简单的对话工具，进化为真正的决策引擎。" --write-media audio/slide1_cn.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Hello everyone, I'm the developer of Decisify. Today I'll show you in 3 minutes how to evolve AI agents from simple chat tools to true decision engines." --write-media audio/slide1_en.mp3

# 第2页 - 当前挑战（30秒）
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "当前的 AI 智能体面临三大挑战：第一，感知盲区。大多数智能体只依赖单一数据源，导致决策片面。第二，黑盒推理。用户无法理解智能体的决策逻辑，难以建立信任。第三，执行风险。缺乏安全机制，自主行动可能带来不可控的后果。" --write-media audio/slide2_cn.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Current AI agents face three challenges: First, perception gaps from single data sources. Second, black-box reasoning that users cannot trust. Third, execution risks from lack of safety mechanisms." --write-media audio/slide2_en.mp3

# 第3页 - 解决方案（20秒）
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify 通过四大核心模块解决这些问题：多源感知层，异步并发采集社交媒体、预测市场、新闻等多个数据源。注意力融合引擎，借鉴 Transformer 机制，智能加权不同信号。透明推理链路，完整记录每个决策的思考过程。安全门控机制，确保执行的可靠性和安全性。" --write-media audio/slide3_cn.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Decisify solves these with four core modules: Multi-source perception, attention fusion engine, transparent reasoning traces, and safety guardrails." --write-media audio/slide3_en.mp3

# 第4页 - 实时仪表盘（30秒）
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "这是 Decisify 的实时仪表盘。系统每 5 秒自动运行一个完整的决策周期。同时采集多个数据源的信号：社交媒体情绪、预测市场数据、新闻事件。注意力融合引擎计算每个信号的权重，清晰可见。完整的推理链路展示智能体如何思考，每一步都透明可追溯。安全门控机制实时验证，防止极端决策。" --write-media audio/slide4_cn.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Here's Decisify's real-time dashboard with 5-second decision cycles, multi-source signals, attention weights, reasoning traces, and safety validation." --write-media audio/slide4_en.mp3

# 第5页 - 技术架构（30秒）
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify 采用 Python 加 Rust 混合架构。Python 提供灵活的开发体验，Rust 实现性能关键路径。核心融合算法使用 Rust，决策延迟小于 1 毫秒，性能提升 1.2 到 1.4 倍。异步并发设计，传感器故障时优雅降级，不影响整体系统。完整的测试覆盖，超过 85%，代码质量有保障。" --write-media audio/slide5_cn.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Decisify uses Python plus Rust hybrid architecture with sub-millisecond latency, async design, and over 85% test coverage." --write-media audio/slide5_en.mp3

# 第6页 - 核心创新（20秒）
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify 的三大创新亮点：第一，首次将 Transformer 注意力机制应用于多源信号融合，实现动态权重分配。第二，完整的透明推理链路，解决 AI 决策黑盒问题，让每个决策都可追溯。第三，Python 加 Rust 混合架构，核心算法性能提升 1.2 到 1.4 倍，决策延迟小于 1 毫秒。" --write-media audio/slide6_cn.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Three key innovations: Transformer-inspired attention fusion, transparent reasoning traces, and Rust-accelerated performance with sub-millisecond latency." --write-media audio/slide6_en.mp3

# 第7页 - 应用场景（25秒）
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify 可应用于多个实际场景：金融交易辅助，融合市场数据和社交情绪，生成投资建议。舆情监控，实时追踪多平台舆论动态，预警潜在风险。智能运营，整合业务指标和用户反馈，优化决策流程。生产级设计，完整的错误处理、优雅降级、状态管理，可以直接部署到实际业务中。" --write-media audio/slide7_cn.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Decisify applies to financial trading, opinion monitoring, and intelligent operations with production-ready design." --write-media audio/slide7_en.mp3

# 第8页 - 赛道契合度（25秒）
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify 完美契合 Track 2 赛道：与智能体共生与智能市场。第一，超越对话。实现完整的感知到推理到执行的自主决策循环。第二，多模态感知。并发采集社交媒体、预测市场、新闻等多个数据源。第三，人机协同。透明推理链路加人工审批流程，实现真正的人机协同。第四，价值创造。决策质量可量化、可优化、可直接部署到生产环境。" --write-media audio/slide8_cn.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Decisify perfectly aligns with Track 2: beyond chat workflow, multi-modal perception, human-agent symbiosis, and quantifiable value creation." --write-media audio/slide8_en.mp3

# 第9页 - 结尾（20秒）
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "感谢观看！立即访问 Decisify，体验透明的 AI 决策智能。在线演示地址：iridite.github.io/decisify。GitHub 仓库：github.com/iridite/decisify。欢迎 Star 和贡献！" --write-media audio/slide9_cn.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Thank you for watching! Visit Decisify now to experience transparent AI decision intelligence. Live demo at iridite.github.io/decisify, GitHub at github.com/iridite/decisify. Welcome to star and contribute!" --write-media audio/slide9_en.mp3
```

**或者使用一键生成脚本**：

创建 `generate-audio.sh`：
```bash
#!/bin/bash
mkdir -p audio

# 配音脚本在下面的章节中
```

#### 步骤 2：录制幻灯片（15分钟）

**使用 OBS Studio 录制**：

```bash
# 安装 OBS（如果还没有）
sudo pacman -S obs-studio

# 启动 OBS
obs
```

**OBS 设置**：
1. 添加 **浏览器源**
   - URL: `http://localhost:3030`
   - 宽度: 1920
   - 高度: 1080
   - 勾选 "控制音频"

2. 录制设置
   - 格式: MP4
   - 编码: H.264
   - 分辨率: 1920x1080
   - 帧率: 30 FPS

3. 开始录制
   - 按 **F** 进入全屏
   - 按照配音节奏切换幻灯片
   - 每页停留对应时间

**录制时间分配**：
- 第1页（开场）：20秒
- 第2页（挑战）：30秒
- 第3页（方案）：20秒
- 第4页（仪表盘）：30秒
- 第5页（架构）：30秒
- 第6页（创新）：20秒
- 第7页（场景）：25秒
- 第8页（赛道）：25秒
- 第9页（结尾）：20秒

**总计：约 3 分钟**

#### 步骤 3：视频编辑（30分钟）

**使用 Kdenlive 或 DaVinci Resolve**：

```bash
# 安装 Kdenlive
sudo pacman -S kdenlive
```

**编辑流程**：
1. 导入录制的视频
2. 导入所有配音文件
3. 按时间轴对齐视频和音频
4. 添加双语字幕（使用下面的字幕文件）
5. 添加背景音乐（可选，音量 10-15%）
6. 导出视频

#### 步骤 4：添加双语字幕（20分钟）

**创建 SRT 字幕文件**：

```srt
1
00:00:00,000 --> 00:00:05,000
Decisify - 决策智能体
Decisify - AI Decision Intelligence Platform

2
00:00:05,000 --> 00:00:10,000
让 AI 智能体从"能聊天"进化到"能决策"
Evolving AI agents from chat to decision-making

3
00:00:10,000 --> 00:00:20,000
大家好，我是 Decisify 的开发者
Hello everyone, I'm the developer of Decisify

... (继续添加)
```

**字幕样式建议**：
- 中文：上方，白色，黑色描边，字号 36
- 英文：下方，浅灰色，黑色描边，字号 28
- 字体：思源黑体 / Noto Sans

---

### 方案 B：Slidev 自动导出（更简单）

Slidev 支持直接导出为视频！

#### 安装依赖

```bash
cd demo-slides
npm install -D playwright-chromium
```

#### 导出为 PDF（用于预览）

```bash
npm run export
```

这会生成 `slides-export.pdf`

#### 导出为视频（需要额外配置）

```bash
npm run export -- --format mp4
```

**注意**：这个功能需要额外配置，可能比较复杂。推荐使用方案 A。

---

## 🎨 自定义样式

如果需要调整样式，创建 `style.css`：

```css
/* 自定义主题色 */
:root {
  --slidev-theme-primary: #00ffc2;
  --slidev-theme-secondary: #7c3aed;
}

/* 中文字体 */
.slidev-layout {
  font-family: 'Noto Sans CJK SC', 'Source Han Sans CN', sans-serif;
}

/* 代码块样式 */
.slidev-code {
  background: rgba(0, 0, 0, 0.5) !important;
}
```

---

## 📝 完整配音脚本（供参考）

### 中文完整版（约 3 分钟）

```
【第1页 - 20秒】
大家好，我是 Decisify 的开发者。今天我将用 3 分钟向大家展示，如何让 AI 智能体从简单的对话工具，进化为真正的决策引擎。

【第2页 - 30秒】
当前的 AI 智能体面临三大挑战：第一，感知盲区。大多数智能体只依赖单一数据源，导致决策片面。第二，黑盒推理。用户无法理解智能体的决策逻辑，难以建立信任。第三，执行风险。缺乏安全机制，自主行动可能带来不可控的后果。

【第3页 - 20秒】
Decisify 通过四大核心模块解决这些问题：多源感知层，异步并发采集社交媒体、预测市场、新闻等多个数据源。注意力融合引擎，借鉴 Transformer 机制，智能加权不同信号。透明推理链路，完整记录每个决策的思考过程。安全门控机制，确保执行的可靠性和安全性。

【第4页 - 30秒】
这是 Decisify 的实时仪表盘。系统每 5 秒自动运行一个完整的决策周期。同时采集多个数据源的信号：社交媒体情绪、预测市场数据、新闻事件。注意力融合引擎计算每个信号的权重，清晰可见。完整的推理链路展示智能体如何思考，每一步都透明可追溯。安全门控机制实时验证，防止极端决策。

【第5页 - 30秒】
Decisify 采用 Python 加 Rust 混合架构。Python 提供灵活的开发体验，Rust 实现性能关键路径。核心融合算法使用 Rust，决策延迟小于 1 毫秒，性能提升 1.2 到 1.4 倍。异步并发设计，传感器故障时优雅降级，不影响整体系统。完整的测试覆盖，超过 85%，代码质量有保障。

【第6页 - 20秒】
Decisify 的三大创新亮点：第一，首次将 Transformer 注意力机制应用于多源信号融合，实现动态权重分配。第二，完整的透明推理链路，解决 AI 决策黑盒问题，让每个决策都可追溯。第三，Python 加 Rust 混合架构，核心算法性能提升 1.2 到 1.4 倍，决策延迟小于 1 毫秒。

【第7页 - 25秒】
Decisify 可应用于多个实际场景：金融交易辅助，融合市场数据和社交情绪，生成投资建议。舆情监控，实时追踪多平台舆论动态，预警潜在风险。智能运营，整合业务指标和用户反馈，优化决策流程。生产级设计，完整的错误处理、优雅降级、状态管理，可以直接部署到实际业务中。

【第8页 - 25秒】
Decisify 完美契合 Track 2 赛道：与智能体共生与智能市场。第一，超越对话。实现完整的感知到推理到执行的自主决策循环。第二，多模态感知。并发采集社交媒体、预测市场、新闻等多个数据源。第三，人机协同。透明推理链路加人工审批流程，实现真正的人机协同。第四，价值创造。决策质量可量化、可优化、可直接部署到生产环境。

【第9页 - 20秒】
感谢观看！立即访问 Decisify，体验透明的 AI 决策智能。在线演示地址：iridite.github.io/decisify。GitHub 仓库：github.com/iridite/decisify。欢迎 Star 和贡献！
```

---

## ✅ 检查清单

制作完成后检查：

- [ ] 视频时长：2:50-3:10
- [ ] 分辨率：1920x1080
- [ ] 帧率：30 FPS
- [ ] 音频清晰，无杂音
- [ ] 中英双语字幕完整
- [ ] 字幕与配音同步
- [ ] 幻灯片切换流畅
- [ ] 所有链接清晰可见
- [ ] 导出格式：MP4
- [ ] 文件大小：<100MB

---

## 🎯 时间估算

**总时间：约 1.5-2 小时**

1. 生成 AI 配音：10 分钟
2. 录制幻灯片：15 分钟
3. 视频编辑：30 分钟
4. 添加字幕：20 分钟
5. 导出和检查：15 分钟

---

## 💡 额外建议

1. **背景音乐**：可以添加轻柔的科技感音乐（音量 10-15%）
   - 推荐：Epidemic Sound、Artlist 的科技类音乐

2. **转场效果**：Slidev 自带的转场已经很好，不需要额外添加

3. **节奏控制**：
   - 重要信息放慢速度
   - 过渡内容可以加快
   - 保持整体节奏紧凑

4. **测试**：完成后让朋友看一遍，收集反馈

---

## 🚀 快速命令参考

```bash
# 启动开发服务器
npm run dev

# 构建静态网站
npm run build

# 导出 PDF
npm run export

# 生成所有配音（需要先创建脚本）
bash generate-audio.sh

# 录制视频（使用 OBS）
obs
```

---

**准备好了吗？开始制作你的演示视频吧！🎬**
