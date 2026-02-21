#!/usr/bin/env python3
"""
Decisify 演示视频全自动录制脚本

使用 Playwright 自动控制浏览器录制 Slidev 演示文稿，
然后使用 FFmpeg 合成配音和字幕。

依赖：
    pip install playwright
    playwright install chromium

使用方法：
    python auto-record.py
"""

import asyncio
import subprocess
import sys
import time
from pathlib import Path

from playwright.async_api import async_playwright

# ============================================================================
# 配置
# ============================================================================

# 项目路径
SLIDES_DIR = Path(__file__).parent
OUTPUT_DIR = SLIDES_DIR / "output"
VOICEOVER_DIR = SLIDES_DIR / "voiceover"

# Slidev 配置
SLIDEV_URL = "http://localhost:3030"
SLIDEV_PORT = 3030

# 视频配置
VIDEO_WIDTH = 1920
VIDEO_HEIGHT = 1080
VIDEO_FPS = 30

# 页面配置（页码: 停留时间（秒））
PAGE_DURATIONS = {
    1: 15,  # 封面
    2: 35,  # 问题与解决方案
    3: 25,  # 决策流程架构
    4: 30,  # Dashboard 总览
    5: 35,  # 决策流程详解
    6: 30,  # 技术架构与性能
    7: 25,  # 应用场景与价值
    8: 10,  # 结尾 CTA
}

# 配音文件
VOICEOVER_FILES = [VOICEOVER_DIR / f"{i:02d}-cn.mp3" for i in range(1, 9)]

# 输出文件
RAW_VIDEO = OUTPUT_DIR / "raw-recording.webm"
FINAL_VIDEO = OUTPUT_DIR / "Decisify-Demo-Final.mp4"

# ============================================================================
# 工具函数
# ============================================================================


def check_dependencies():
    """检查依赖是否安装"""
    print("🔍 检查依赖...")

    # 检查 FFmpeg
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        print("  ✅ FFmpeg 已安装")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("  ❌ FFmpeg 未安装，请先安装：")
        print("     sudo pacman -S ffmpeg")
        sys.exit(1)

    # 检查配音文件
    missing_files = [f for f in VOICEOVER_FILES if not f.exists()]
    if missing_files:
        print("  ❌ 缺少配音文件：")
        for f in missing_files:
            print(f"     {f}")
        print("\n  请先运行：./generate-voiceover-cn.sh")
        sys.exit(1)
    print(f"  ✅ 找到 {len(VOICEOVER_FILES)} 个配音文件")

    # 创建输出目录
    OUTPUT_DIR.mkdir(exist_ok=True)
    print(f"  ✅ 输出目录：{OUTPUT_DIR}")


def start_slidev_server():
    """启动 Slidev 开发服务器"""
    print("\n🚀 启动 Slidev 服务器...")

    # 检查服务器是否已经运行
    try:
        import urllib.request

        urllib.request.urlopen(SLIDEV_URL, timeout=1)
        print(f"  ✅ Slidev 已在 {SLIDEV_URL} 运行")
        return None
    except Exception:
        pass

    # 启动服务器
    print(f"  启动服务器在端口 {SLIDEV_PORT}...")
    process = subprocess.Popen(
        ["npm", "run", "dev", "--", "--port", str(SLIDEV_PORT)],
        cwd=SLIDES_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    # 等待服务器启动
    print("  等待服务器启动...", end="", flush=True)
    for _ in range(30):
        try:
            import urllib.request

            urllib.request.urlopen(SLIDEV_URL, timeout=1)
            print(" ✅")
            time.sleep(2)  # 额外等待确保完全加载
            return process
        except:
            print(".", end="", flush=True)
            time.sleep(1)

    print(" ❌")
    print("  服务器启动超时")
    process.kill()
    sys.exit(1)


async def record_presentation():
    """使用 Playwright 录制演示文稿"""
    print("\n🎬 开始录制演示文稿...")

    async with async_playwright() as p:
        # 启动浏览器
        print("  启动浏览器...")
        browser = await p.chromium.launch(
            headless=False,  # 显示浏览器窗口以便观察
            args=[
                f"--window-size={VIDEO_WIDTH},{VIDEO_HEIGHT}",
                "--disable-blink-features=AutomationControlled",
            ],
        )

        # 创建上下文并开始录制
        context = await browser.new_context(
            viewport={"width": VIDEO_WIDTH, "height": VIDEO_HEIGHT},
            record_video_dir=str(OUTPUT_DIR),
            record_video_size={"width": VIDEO_WIDTH, "height": VIDEO_HEIGHT},
        )

        page = await context.new_page()

        # 访问 Slidev
        print(f"  访问 {SLIDEV_URL}...")
        await page.goto(SLIDEV_URL, wait_until="networkidle")

        # 等待页面完全加载
        await asyncio.sleep(3)

        # 进入全屏演示模式
        print("  进入全屏演示模式...")
        await page.keyboard.press("f")
        await asyncio.sleep(2)

        # 逐页录制
        total_pages = len(PAGE_DURATIONS)
        total_duration = sum(PAGE_DURATIONS.values())

        print(f"\n  录制 {total_pages} 页，预计时长 {total_duration} 秒")
        print("  " + "=" * 50)

        for page_num, duration in PAGE_DURATIONS.items():
            print(
                f"  📄 第 {page_num}/{total_pages} 页 - 停留 {duration} 秒...", end="", flush=True
            )

            # 停留指定时间
            await asyncio.sleep(duration)

            # 切换到下一页（除了最后一页）
            if page_num < total_pages:
                await page.keyboard.press("ArrowRight")
                await asyncio.sleep(0.5)  # 等待切换动画

            print(" ✅")

        print("  " + "=" * 50)
        print(f"  ✅ 录制完成！总时长：{total_duration} 秒")

        # 关闭浏览器（会自动保存视频）
        await context.close()
        await browser.close()

        # 查找生成的视频文件
        video_files = list(OUTPUT_DIR.glob("*.webm"))
        if video_files:
            # Playwright 生成的视频文件名是随机的，重命名为固定名称
            video_files[0].rename(RAW_VIDEO)
            print(f"  📹 原始视频：{RAW_VIDEO}")
            return RAW_VIDEO
        else:
            print("  ❌ 未找到录制的视频文件")
            sys.exit(1)


def merge_audio_video():
    """使用 FFmpeg 合成视频和配音"""
    print("\n🎵 合成视频和配音...")

    # 创建 FFmpeg 输入列表
    inputs = ["-i", str(RAW_VIDEO)]

    # 添加所有配音文件
    for voiceover in VOICEOVER_FILES:
        inputs.extend(["-i", str(voiceover)])

    # 构建 FFmpeg 命令
    # 策略：将所有配音文件连接成一个音频流，然后与视频合成

    # 1. 先连接所有配音文件
    concat_filter = "".join([f"[{i + 1}:a]" for i in range(len(VOICEOVER_FILES))])
    concat_filter += f"concat=n={len(VOICEOVER_FILES)}:v=0:a=1[audio]"

    cmd = [
        "ffmpeg",
        "-y",  # 覆盖输出文件
        *inputs,
        "-filter_complex",
        concat_filter,
        "-map",
        "0:v",  # 使用原始视频
        "-map",
        "[audio]",  # 使用合成的音频
        "-c:v",
        "libx264",  # 视频编码器
        "-preset",
        "medium",  # 编码速度
        "-crf",
        "23",  # 质量（18-28，越小质量越好）
        "-c:a",
        "aac",  # 音频编码器
        "-b:a",
        "192k",  # 音频比特率
        "-shortest",  # 以最短的流为准
        str(FINAL_VIDEO),
    ]

    print(f"  执行 FFmpeg 命令...")
    print(f"  输出：{FINAL_VIDEO}")

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print("  ✅ 视频合成完成！")
        return FINAL_VIDEO
    except subprocess.CalledProcessError as e:
        print(f"  ❌ FFmpeg 错误：")
        print(e.stderr)
        sys.exit(1)


def get_video_info(video_path):
    """获取视频信息"""
    cmd = [
        "ffprobe",
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        str(video_path),
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        import json

        return json.loads(result.stdout)
    return None


def print_summary():
    """打印制作总结"""
    print("\n" + "=" * 60)
    print("🎉 视频制作完成！")
    print("=" * 60)

    if FINAL_VIDEO.exists():
        # 获取视频信息
        info = get_video_info(FINAL_VIDEO)
        if info:
            duration = float(info["format"]["duration"])
            size_mb = int(info["format"]["size"]) / (1024 * 1024)

            print(f"\n📹 视频信息：")
            print(f"  文件：{FINAL_VIDEO}")
            print(f"  时长：{duration:.1f} 秒 ({duration / 60:.1f} 分钟)")
            print(f"  大小：{size_mb:.1f} MB")
            print(f"  分辨率：{VIDEO_WIDTH}x{VIDEO_HEIGHT}")
            print(f"  帧率：{VIDEO_FPS} FPS")
        else:
            print(f"\n📹 输出文件：{FINAL_VIDEO}")
            print(f"  大小：{FINAL_VIDEO.stat().st_size / (1024 * 1024):.1f} MB")

    print("\n📝 下一步：")
    print("  1. 播放视频检查质量：")
    print(f"     mpv {FINAL_VIDEO}")
    print("  2. 如需添加字幕，可以使用视频编辑软件")
    print("  3. 上传到视频平台分享")

    print("\n💡 提示：")
    print("  - 原始录制文件保存在：", RAW_VIDEO)
    print("  - 如需重新合成，可以直接运行 FFmpeg 命令")
    print("  - 如需调整配音，重新生成后再次运行本脚本")


def cleanup(slidev_process):
    """清理资源"""
    if slidev_process:
        print("\n🧹 停止 Slidev 服务器...")
        slidev_process.terminate()
        slidev_process.wait(timeout=5)


# ============================================================================
# 主函数
# ============================================================================


async def main():
    """主函数"""
    print("=" * 60)
    print("🎬 Decisify 演示视频全自动制作")
    print("=" * 60)

    slidev_process = None

    try:
        # 1. 检查依赖
        check_dependencies()

        # 2. 启动 Slidev 服务器
        slidev_process = start_slidev_server()

        # 3. 录制演示文稿
        await record_presentation()

        # 4. 合成视频和配音
        merge_audio_video()

        # 5. 打印总结
        print_summary()

    except KeyboardInterrupt:
        print("\n\n⚠️  用户中断")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ 错误：{e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)
    finally:
        # 清理资源
        cleanup(slidev_process)


if __name__ == "__main__":
    # 运行异步主函数
    asyncio.run(main())
