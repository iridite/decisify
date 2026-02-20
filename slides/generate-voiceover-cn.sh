#!/bin/bash
# 批量生成 Decisify 演示视频中文配音
# 使用 Edge TTS 生成高质量 AI 配音

set -e

echo "开始生成中文配音..."
echo "================================"

# 创建配音目录
mkdir -p voiceover

# 页面 1 - 封面（15秒）
echo "生成第 1 页配音..."
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% \
  --text "Decisify，一个让 AI 智能体从对话工具进化为决策引擎的透明智能平台。" \
  --write-media voiceover/01-cn.mp3

# 页面 2 - 当前挑战（20秒）
echo "生成第 2 页配音..."
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% \
  --text "当前 AI 智能体面临三大挑战：感知盲区导致决策片面，黑盒推理让用户无法信任，缺乏安全机制带来执行风险。" \
  --write-media voiceover/02-cn.mp3

# 页面 3 - Decisify 解决方案（20秒）
echo "生成第 3 页配音..."
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% \
  --text "Decisify 通过四大核心模块构建完整的决策工作流：多源感知层并发采集信号，注意力融合引擎动态计算权重，透明推理链路记录每步过程，安全门控机制实时验证决策。" \
  --write-media voiceover/03-cn.mp3

# 页面 4 - 实时仪表盘（25秒）
echo "生成第 4 页配音..."
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% \
  --text "这是 Decisify 的实时仪表盘。系统每 5 秒自动执行一次完整的决策循环，实时显示注意力权重分布，并展示完整的推理轨迹，让决策过程透明可追溯。" \
  --write-media voiceover/04-cn.mp3

# 页面 5 - 技术架构（25秒）
echo "生成第 5 页配音..."
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% \
  --text "Decisify 采用 Python 加 Rust 混合架构。Python 层负责 API 服务和传感器编排，提供灵活的开发体验。Rust 层实现核心融合算法，提供极致性能和内存安全。这种架构带来 1.2 到 1.4 倍的性能提升，决策延迟小于 1 毫秒。" \
  --write-media voiceover/05-cn.mp3

# 页面 6 - 核心创新（30秒）
echo "生成第 6 页配音..."
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% \
  --text "Decisify 的三大核心创新。第一，注意力机制。首次将 Transformer 注意力机制应用于多源信号融合，实现动态权重分配。第二，透明推理。完整记录从原始信号到最终输出的每一步决策过程，全程可追溯可审计。第三，极致性能。使用 Rust 实现核心算法，决策延迟小于 1 毫秒，支持零拷贝数据传递和 SIMD 向量化。" \
  --write-media voiceover/06-cn.mp3

# 页面 7 - 应用场景（25秒）
echo "生成第 7 页配音..."
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% \
  --text "Decisify 可应用于多个实际场景。在金融交易领域，融合市场数据和社交情绪生成投资建议。在舆情监控方面，实时追踪多平台动态预警风险。在智能运营中，整合业务指标优化决策流程。系统具有完整的错误处理和超过 85% 的测试覆盖率，可直接部署到生产环境。" \
  --write-media voiceover/07-cn.mp3

# 页面 8 - 赛道契合度（20秒）
echo "生成第 8 页配音..."
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% \
  --text "Decisify 完美契合 Hackathon Track 2 的要求。实现了超越对话的自主决策循环，具备多模态感知能力，通过透明推理实现人机协同，决策质量可量化、可优化，创造实际价值。" \
  --write-media voiceover/08-cn.mp3

# 页面 9 - Thank you（10秒）
echo "生成第 9 页配音..."
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% \
  --text "立即访问 Decisify，体验透明的 AI 决策智能。" \
  --write-media voiceover/09-cn.mp3

echo "================================"
echo "✅ 所有中文配音生成完成！"
echo "配音文件保存在 voiceover/ 目录"
echo ""
echo "生成的文件："
ls -lh voiceover/*.mp3
echo ""
echo "总时长约 3 分钟"
echo ""
echo "录制时间表："
echo "页面 1 - 封面：15秒"
echo "页面 2 - 当前挑战：20秒"
echo "页面 3 - 解决方案：20秒"
echo "页面 4 - 实时仪表盘：25秒"
echo "页面 5 - 技术架构：25秒"
echo "页面 6 - 核心创新：30秒"
echo "页面 7 - 应用场景：25秒"
echo "页面 8 - 赛道契合度：20秒"
echo "页面 9 - Thank you：10秒"
