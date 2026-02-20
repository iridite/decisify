# Decisify 全自动视频制作方案

## 📋 方案对比

| 方案 | 难度 | 质量 | 时间 | 推荐度 |
|------|------|------|------|--------|
| **方案 1：Playwright 自动录制** | ⭐⭐ | ⭐⭐⭐⭐⭐ | 10分钟 | ⭐⭐⭐⭐⭐ |
| 方案 2：FFmpeg 图片合成 | ⭐⭐⭐ | ⭐⭐⭐ | 30分钟 | ⭐⭐⭐ |
| 方案 3：Remotion 代码生成 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 2小时 | ⭐⭐ |
| 方案 4：在线 AI 服务 | ⭐ | ⭐⭐ | 5分钟 | ⭐⭐ |

---

## 🚀 方案 1：Playwright 自动录制（强烈推荐）

### 优点
- ✅ **完全自动化**：一键运行，自动录制和合成
- ✅ **高质量**：真实浏览器渲染，效果完美
- ✅ **快速**：10 分钟内完成整个流程
- ✅ **灵活**：可以轻松调整时长和配音
- ✅ **已准备好**：脚本已经写好，直接使用

### 缺点
- ❌ 需要安装 Playwright（一次性，很简单）
- ❌ 录制时会打开浏览器窗口（可以最小化）

### 使用步骤

#### 1. 安装依赖（首次使用，5分钟）

```bash
cd /home/yixian/Playground/decisify/slides

# 安装 Playwright
uv pip install playwright

# 安装 Chromium 浏览器
playwright install chromium

# 安装 FFmpeg（如果还没装）
sudo pacman -S ffmpeg
```

#### 2. 生成配音（如果还没生成）

```bash
# 安装 edge-tts
uv pip install edge-tts

# 生成配音
chmod +x generate-voiceover-cn.sh
./generate-voiceover-cn.sh
```

#### 3. 运行自动录制脚本

```bash
# 一键运行！
python auto-record.py
```

**就这么简单！** 脚本会自动：
1. 检查依赖和配音文件
2. 启动 Slidev 服务器
3. 打开浏览器并进入全屏模式
4. 按照时间表逐页录制（你可以看到进度）
5. 使用 FFmpeg 合成视频和配音
6. 生成最终视频：`output/Decisify-Demo-Final.mp4`

**预计时间：** 5-10 分钟（大部分时间是录制）

#### 4. 检查结果

```bash
# 播放视频
mpv output/Decisify-Demo-Final.mp4

# 或
vlc output/Decisify-Demo-Final.mp4
```

### 自定义配置

如果需要调整，编辑 `auto-record.py` 中的配置：

```python
# 页面停留时间（秒）
PAGE_DURATIONS = {
    1: 15,  # 封面
    2: 35,  # 问题与解决方案
    3: 25,  # 决策流程架构
    # ... 可以调整每页的时长
}

# 视频分辨率
VIDEO_WIDTH = 1920
VIDEO_HEIGHT = 1080
VIDEO_FPS = 30
```

---

## 📸 方案 2：FFmpeg 图片合成

### 原理
1. 导出每页为 PNG 图片
2. 使用 FFmpeg 将图片和配音合成视频

### 优点
- ✅ 不需要录制，直接合成
- ✅ 可以精确控制每帧

### 缺点
- ❌ 失去动画效果（v-click 等）
- ❌ 需要手动导出图片
- ❌ 质量不如真实录制

### 使用步骤

#### 1. 导出 PDF

```bash
cd /home/yixian/Playground/decisify/slides
npx slidev export --format pdf
```

#### 2. 将 PDF 转换为图片

```bash
# 安装 ImageMagick
sudo pacman -S imagemagick

# 转换 PDF 为 PNG（每页一张）
convert -density 300 slides-export.pdf -quality 100 output/page-%02d.png
```

#### 3. 使用 FFmpeg 合成

```bash
# 创建视频列表文件
cat > output/concat.txt << EOF
file 'page-01.png'
duration 15
file 'page-02.png'
duration 35
file 'page-03.png'
duration 25
# ... 继续添加
EOF

# 合成视频
ffmpeg -f concat -i output/concat.txt \
       -i voiceover/01-cn.mp3 \
       -i voiceover/02-cn.mp3 \
       # ... 添加所有配音
       -filter_complex "[1:a][2:a]...[8:a]concat=n=8:v=0:a=1[audio]" \
       -map 0:v -map "[audio]" \
       -c:v libx264 -c:a aac \
       output/final.mp4
```

**预计时间：** 30 分钟（需要手动操作）

---

## 🎨 方案 3：Remotion（React 视频生成）

### 原理
使用 React 代码生成视频，完全程序化控制

### 优点
- ✅ 完全代码控制，可以实现任何效果
- ✅ 可以添加复杂动画和特效
- ✅ 可重复性强

### 缺点
- ❌ 学习曲线陡峭
- ❌ 需要重写整个演示文稿
- ❌ 时间成本高

### 使用步骤

```bash
# 安装 Remotion
npm install -g @remotion/cli

# 创建项目
npx create-video@latest

# 需要用 React 重写所有幻灯片...
# 不推荐用于快速制作
```

**预计时间：** 2-4 小时（需要编写代码）

---

## 🌐 方案 4：在线 AI 视频生成服务

### 可用服务
- **Synthesia**：AI 虚拟主播
- **D-ID**：AI 数字人
- **Pictory**：文本转视频
- **Lumen5**：自动视频生成

### 优点
- ✅ 零技术门槛
- ✅ 快速生成

### 缺点
- ❌ 需要付费（通常很贵）
- ❌ 无法完全控制样式
- ❌ 可能有水印
- ❌ 不适合技术演示

**不推荐用于 Decisify 项目**

---

## 🎯 推荐方案

### 如果你想要：

**最快速、最简单、最高质量** → **方案 1：Playwright 自动录制**
- 10 分钟完成
- 一键运行
- 效果完美

**完全控制、不介意花时间** → **方案 3：Remotion**
- 可以实现任何效果
- 需要编程经验

**只是测试、不在乎质量** → **方案 2：FFmpeg 图片合成**
- 快速预览
- 失去动画效果

---

## 📝 添加字幕（可选）

如果需要双语字幕，可以在生成视频后添加：

### 方法 1：使用 FFmpeg 硬编码字幕

```bash
# 创建字幕文件 subtitles.srt
cat > subtitles.srt << 'EOF'
1
00:00:00,000 --> 00:00:15,000
Decisify: 决策智能体
Decisify: AI Decision Intelligence Platform

2
00:00:15,000 --> 00:00:50,000
当前 AI 智能体面临三大挑战...
Current AI agents face three major challenges...

# ... 继续添加
EOF

# 添加字幕到视频
ffmpeg -i output/Decisify-Demo-Final.mp4 \
       -vf "subtitles=subtitles.srt:force_style='FontName=Noto Sans CJK SC,FontSize=24'" \
       output/Decisify-Demo-With-Subtitles.mp4
```

### 方法 2：使用视频编辑软件

在 Kdenlive 或 DaVinci Resolve 中手动添加字幕（参考 VIDEO_RECORDING_GUIDE.md）

---

## 🔧 故障排除

### 问题 1：Playwright 安装失败

```bash
# 使用国内镜像
export PLAYWRIGHT_DOWNLOAD_HOST=https://npmmirror.com/mirrors/playwright/

# 重新安装
playwright install chromium
```

### 问题 2：录制的视频是黑屏

**原因：** Wayland 兼容性问题

**解决：**
```bash
# 使用 X11 运行脚本
export DISPLAY=:0
python auto-record.py
```

### 问题 3：FFmpeg 合成失败

**检查：**
- 配音文件是否都存在
- FFmpeg 版本是否足够新（>= 4.0）

```bash
# 更新 FFmpeg
sudo pacman -Syu ffmpeg
```

### 问题 4：视频和音频不同步

**调整：** 在 `auto-record.py` 中微调 `PAGE_DURATIONS`

---

## ✅ 快速开始清单

使用方案 1（Playwright 自动录制）：

- [ ] 安装 Playwright：`uv pip install playwright`
- [ ] 安装浏览器：`playwright install chromium`
- [ ] 安装 FFmpeg：`sudo pacman -S ffmpeg`
- [ ] 生成配音：`./generate-voiceover-cn.sh`
- [ ] 运行录制：`python auto-record.py`
- [ ] 检查视频：`mpv output/Decisify-Demo-Final.mp4`
- [ ] （可选）添加字幕

**总时间：** 15-20 分钟（包括首次安装）

---

## 🎉 完成！

使用方案 1，你可以在 **10 分钟内** 获得一个高质量的演示视频！

有任何问题，参考：
- `VIDEO_RECORDING_GUIDE.md` - 手动录制指南
- `VOICEOVER_SCRIPT.md` - 配音脚本
- `auto-record.py` - 自动录制脚本源码