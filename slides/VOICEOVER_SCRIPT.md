# Decisify 演示视频配音脚本

## 📋 总时长：3 分钟（180 秒）

---

## 🎬 页面 1 - 封面（15 秒）

### 中文配音
```
Decisify，一个让 AI 智能体从对话工具进化为决策引擎的透明智能平台。
```

### 英文配音
```
Decisify - Evolving AI agents from chat tools to decision engines with transparent intelligence.
```

### Edge TTS 命令
```bash
# 中文
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify，一个让 AI 智能体从对话工具进化为决策引擎的透明智能平台。" --write-media voiceover-01-cn.mp3

# 英文
edge-tts --voice en-US-JennyNeural --rate=+0% --text "Decisify - Evolving AI agents from chat tools to decision engines with transparent intelligence." --write-media voiceover-01-en.mp3
```

---

## 🎬 页面 2 - 问题与解决方案（35 秒）

### 中文配音
```
当前 AI 智能体面临三大挑战：感知盲区导致决策片面，黑盒推理让用户无法信任，缺乏安全机制带来执行风险。Decisify 通过多源感知、注意力融合、透明推理和安全门控，构建完整的感知到执行工作流。
```

### 英文配音
```
Current AI agents face three challenges: perception gaps from single data sources, black-box reasoning that users cannot trust, and execution risks from lack of safety mechanisms. Decisify addresses these through multi-source perception, attention fusion, transparent reasoning, and safety guardrails.
```

### Edge TTS 命令
```bash
# 中文
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "当前 AI 智能体面临三大挑战：感知盲区导致决策片面，黑盒推理让用户无法信任，缺乏安全机制带来执行风险。Decisify 通过多源感知、注意力融合、透明推理和安全门控，构建完整的感知到执行工作流。" --write-media voiceover-02-cn.mp3

# 英文
edge-tts --voice en-US-JennyNeural --rate=+0% --text "Current AI agents face three challenges: perception gaps from single data sources, black-box reasoning that users cannot trust, and execution risks from lack of safety mechanisms. Decisify addresses these through multi-source perception, attention fusion, transparent reasoning, and safety guardrails." --write-media voiceover-02-en.mp3
```

---

## 🎬 页面 3 - 决策流程架构（25 秒）

### 中文配音
```
Decisify 的核心是一个完整的决策循环。首先，异步感知层并发采集多源信号。然后，注意力融合引擎使用 Softmax 机制计算权重，智能融合不同来源的信息。接着，生成透明的推理链路，记录每一步思考过程。最后，安全门控机制实时验证，确保决策安全可控。
```

### 英文配音
```
Decisify's core is a complete decision loop. First, the async perception layer concurrently collects multi-source signals. Then, the attention fusion engine uses Softmax mechanism to calculate weights and intelligently fuse information from different sources. Next, it generates transparent reasoning traces, recording every step of the thinking process. Finally, safety guardrails validate in real-time to ensure decisions are safe and controllable.
```

### Edge TTS 命令
```bash
# 中文
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify 的核心是一个完整的决策循环。首先，异步感知层并发采集多源信号。然后，注意力融合引擎使用 Softmax 机制计算权重，智能融合不同来源的信息。接着，生成透明的推理链路，记录每一步思考过程。最后，安全门控机制实时验证，确保决策安全可控。" --write-media voiceover-03-cn.mp3

# 英文
edge-tts --voice en-US-JennyNeural --rate=+0% --text "Decisify's core is a complete decision loop. First, the async perception layer concurrently collects multi-source signals. Then, the attention fusion engine uses Softmax mechanism to calculate weights and intelligently fuse information from different sources. Next, it generates transparent reasoning traces, recording every step of the thinking process. Finally, safety guardrails validate in real-time to ensure decisions are safe and controllable." --write-media voiceover-03-en.mp3
```

---

## 🎬 页面 4 - Dashboard 总览（30 秒）

### 中文配音
```
这是 Decisify 的实时仪表盘。左上角显示当前决策状态和置信度。中间区域展示多源信号的实时数据，包括 Twitter 情绪、市场波动率和新闻情感。右侧是注意力权重分布，可以清楚看到每个信号源的重要程度。底部是完整的推理轨迹，记录了智能体的思考过程。
```

### 英文配音
```
This is Decisify's real-time dashboard. The top-left shows current decision status and confidence. The middle area displays real-time data from multi-source signals, including Twitter sentiment, market volatility, and news sentiment. The right side shows attention weight distribution, clearly indicating the importance of each signal source. The bottom shows complete reasoning traces, recording the agent's thinking process.
```

### Edge TTS 命令
```bash
# 中文
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "这是 Decisify 的实时仪表盘。左上角显示当前决策状态和置信度。中间区域展示多源信号的实时数据，包括 Twitter 情绪、市场波动率和新闻情感。右侧是注意力权重分布，可以清楚看到每个信号源的重要程度。底部是完整的推理轨迹，记录了智能体的思考过程。" --write-media voiceover-04-cn.mp3

# 英文
edge-tts --voice en-US-JennyNeural --rate=+0% --text "This is Decisify's real-time dashboard. The top-left shows current decision status and confidence. The middle area displays real-time data from multi-source signals, including Twitter sentiment, market volatility, and news sentiment. The right side shows attention weight distribution, clearly indicating the importance of each signal source. The bottom shows complete reasoning traces, recording the agent's thinking process." --write-media voiceover-04-en.mp3
```

---

## 🎬 页面 5 - 决策流程详解（35 秒）

### 中文配音
```
让我们深入看看决策过程。第一步，系统采集三个信号源：Twitter 情绪 0.742，市场波动率 0.034，新闻情感 0.521。第二步，注意力融合引擎计算权重：Twitter 42.3%，波动率 35.1%，新闻 22.6%。第三步，加权融合得到综合信号 0.612，判断为 BUY 操作。第四步，安全门检查波动率在阈值内，验证通过，最终输出安全决策。
```

### 英文配音
```
Let's dive into the decision process. Step one, the system collects three signal sources: Twitter sentiment 0.742, market volatility 0.034, news sentiment 0.521. Step two, the attention fusion engine calculates weights: Twitter 42.3%, volatility 35.1%, news 22.6%. Step three, weighted fusion produces a combined signal of 0.612, judged as a BUY operation. Step four, the safety gate checks volatility is within threshold, validation passes, and outputs a safe decision.
```

### Edge TTS 命令
```bash
# 中文
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "让我们深入看看决策过程。第一步，系统采集三个信号源：Twitter 情绪 0.742，市场波动率 0.034，新闻情感 0.521。第二步，注意力融合引擎计算权重：Twitter 42.3%，波动率 35.1%，新闻 22.6%。第三步，加权融合得到综合信号 0.612，判断为 BUY 操作。第四步，安全门检查波动率在阈值内，验证通过，最终输出安全决策。" --write-media voiceover-05-cn.mp3

# 英文
edge-tts --voice en-US-JennyNeural --rate=+0% --text "Let's dive into the decision process. Step one, the system collects three signal sources: Twitter sentiment 0.742, market volatility 0.034, news sentiment 0.521. Step two, the attention fusion engine calculates weights: Twitter 42.3%, volatility 35.1%, news 22.6%. Step three, weighted fusion produces a combined signal of 0.612, judged as a BUY operation. Step four, the safety gate checks volatility is within threshold, validation passes, and outputs a safe decision." --write-media voiceover-05-en.mp3
```

---

## 🎬 页面 6 - 技术架构与性能（30 秒）

### 中文配音
```
Decisify 采用 Python 加 Rust 混合架构。Python 层使用 FastAPI 和异步并发，提供灵活的开发体验和快速迭代能力。Rust 层实现核心融合算法，提供零开销抽象和内存安全保证。这种混合架构带来了 1.2 到 1.4 倍的性能提升，决策延迟小于 1 毫秒。同时，系统具有完整的错误处理、优雅降级和超过 85% 的测试覆盖率。
```

### 英文配音
```
Decisify uses a Python plus Rust hybrid architecture. The Python layer uses FastAPI and async concurrency, providing flexible development experience and rapid iteration capability. The Rust layer implements core fusion algorithms, providing zero-cost abstractions and memory safety guarantees. This hybrid architecture delivers 1.2 to 1.4x performance improvement with sub-millisecond decision latency. The system also features complete error handling, graceful degradation, and over 85% test coverage.
```

### Edge TTS 命令
```bash
# 中文
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify 采用 Python 加 Rust 混合架构。Python 层使用 FastAPI 和异步并发，提供灵活的开发体验和快速迭代能力。Rust 层实现核心融合算法，提供零开销抽象和内存安全保证。这种混合架构带来了 1.2 到 1.4 倍的性能提升，决策延迟小于 1 毫秒。同时，系统具有完整的错误处理、优雅降级和超过 85% 的测试覆盖率。" --write-media voiceover-06-cn.mp3

# 英文
edge-tts --voice en-US-JennyNeural --rate=+0% --text "Decisify uses a Python plus Rust hybrid architecture. The Python layer uses FastAPI and async concurrency, providing flexible development experience and rapid iteration capability. The Rust layer implements core fusion algorithms, providing zero-cost abstractions and memory safety guarantees. This hybrid architecture delivers 1.2 to 1.4x performance improvement with sub-millisecond decision latency. The system also features complete error handling, graceful degradation, and over 85% test coverage." --write-media voiceover-06-en.mp3
```

---

## 🎬 页面 7 - 应用场景与价值（25 秒）

### 中文配音
```
Decisify 可应用于多个实际场景。在金融交易领域，融合市场数据和社交情绪生成投资建议。在舆情监控方面，实时追踪多平台动态预警风险。在智能运营中，整合业务指标优化决策流程。Decisify 完美契合 Hackathon Track 2 的要求：超越对话的自主决策循环，多模态感知，人机协同，以及可量化的价值创造。
```

### 英文配音
```
Decisify applies to multiple real-world scenarios. In financial trading, it fuses market data and social sentiment to generate investment advice. For public opinion monitoring, it tracks multi-platform dynamics in real-time to warn of risks. In intelligent operations, it integrates business metrics to optimize decision processes. Decisify perfectly aligns with Hackathon Track 2 requirements: autonomous decision loops beyond chat, multi-modal perception, human-agent collaboration, and quantifiable value creation.
```

### Edge TTS 命令
```bash
# 中文
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify 可应用于多个实际场景。在金融交易领域，融合市场数据和社交情绪生成投资建议。在舆情监控方面，实时追踪多平台动态预警风险。在智能运营中，整合业务指标优化决策流程。Decisify 完美契合 Hackathon Track 2 的要求：超越对话的自主决策循环，多模态感知，人机协同，以及可量化的价值创造。" --write-media voiceover-07-cn.mp3

# 英文
edge-tts --voice en-US-JennyNeural --rate=+0% --text "Decisify applies to multiple real-world scenarios. In financial trading, it fuses market data and social sentiment to generate investment advice. For public opinion monitoring, it tracks multi-platform dynamics in real-time to warn of risks. In intelligent operations, it integrates business metrics to optimize decision processes. Decisify perfectly aligns with Hackathon Track 2 requirements: autonomous decision loops beyond chat, multi-modal perception, human-agent collaboration, and quantifiable value creation." --write-media voiceover-07-en.mp3
```

---

## 🎬 页面 8 - 结尾 CTA（10 秒）

### 中文配音
```
立即访问 Decisify，体验透明的 AI 决策智能。
```

### 英文配音
```
Visit Decisify now to experience transparent AI decision intelligence.
```

### Edge TTS 命令
```bash
# 中文
edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "立即访问 Decisify，体验透明的 AI 决策智能。" --write-media voiceover-08-cn.mp3

# 英文
edge-tts --voice en-US-JennyNeural --rate=+0% --text "Visit Decisify now to experience transparent AI decision intelligence." --write-media voiceover-08-en.mp3
```

---

## 🎯 批量生成脚本

### 生成所有中文配音
```bash
#!/bin/bash
# generate-voiceover-cn.sh

edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify，一个让 AI 智能体从对话工具进化为决策引擎的透明智能平台。" --write-media voiceover-01-cn.mp3

edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "当前 AI 智能体面临三大挑战：感知盲区导致决策片面，黑盒推理让用户无法信任，缺乏安全机制带来执行风险。Decisify 通过多源感知、注意力融合、透明推理和安全门控，构建完整的感知到执行工作流。" --write-media voiceover-02-cn.mp3

edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify 的核心是一个完整的决策循环。首先，异步感知层并发采集多源信号。然后，注意力融合引擎使用 Softmax 机制计算权重，智能融合不同来源的信息。接着，生成透明的推理链路，记录每一步思考过程。最后，安全门控机制实时验证，确保决策安全可控。" --write-media voiceover-03-cn.mp3

edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "这是 Decisify 的实时仪表盘。左上角显示当前决策状态和置信度。中间区域展示多源信号的实时数据，包括 Twitter 情绪、市场波动率和新闻情感。右侧是注意力权重分布，可以清楚看到每个信号源的重要程度。底部是完整的推理轨迹，记录了智能体的思考过程。" --write-media voiceover-04-cn.mp3

edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "让我们深入看看决策过程。第一步，系统采集三个信号源：Twitter 情绪 0.742，市场波动率 0.034，新闻情感 0.521。第二步，注意力融合引擎计算权重：Twitter 42.3%，波动率 35.1%，新闻 22.6%。第三步，加权融合得到综合信号 0.612，判断为 BUY 操作。第四步，安全门检查波动率在阈值内，验证通过，最终输出安全决策。" --write-media voiceover-05-cn.mp3

edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify 采用 Python 加 Rust 混合架构。Python 层使用 FastAPI 和异步并发，提供灵活的开发体验和快速迭代能力。Rust 层实现核心融合算法，提供零开销抽象和内存安全保证。这种混合架构带来了 1.2 到 1.4 倍的性能提升，决策延迟小于 1 毫秒。同时，系统具有完整的错误处理、优雅降级和超过 85% 的测试覆盖率。" --write-media voiceover-06-cn.mp3

edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "Decisify 可应用于多个实际场景。在金融交易领域，融合市场数据和社交情绪生成投资建议。在舆情监控方面，实时追踪多平台动态预警风险。在智能运营中，整合业务指标优化决策流程。Decisify 完美契合 Hackathon Track 2 的要求：超越对话的自主决策循环，多模态感知，人机协同，以及可量化的价值创造。" --write-media voiceover-07-cn.mp3

edge-tts --voice zh-CN-XiaoxiaoNeural --rate=+0% --text "立即访问 Decisify，体验透明的 AI 决策智能。" --write-media voiceover-08-cn.mp3

echo "所有中文配音生成完成！"
```

### 生成所有英文配音
```bash
#!/bin/bash
# generate-voiceover-en.sh

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Decisify - Evolving AI agents from chat tools to decision engines with transparent intelligence." --write-media voiceover-01-en.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Current AI agents face three challenges: perception gaps from single data sources, black-box reasoning that users cannot trust, and execution risks from lack of safety mechanisms. Decisify addresses these through multi-source perception, attention fusion, transparent reasoning, and safety guardrails." --write-media voiceover-02-en.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Decisify's core is a complete decision loop. First, the async perception layer concurrently collects multi-source signals. Then, the attention fusion engine uses Softmax mechanism to calculate weights and intelligently fuse information from different sources. Next, it generates transparent reasoning traces, recording every step of the thinking process. Finally, safety guardrails validate in real-time to ensure decisions are safe and controllable." --write-media voiceover-03-en.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "This is Decisify's real-time dashboard. The top-left shows current decision status and confidence. The middle area displays real-time data from multi-source signals, including Twitter sentiment, market volatility, and news sentiment. The right side shows attention weight distribution, clearly indicating the importance of each signal source. The bottom shows complete reasoning traces, recording the agent's thinking process." --write-media voiceover-04-en.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Let's dive into the decision process. Step one, the system collects three signal sources: Twitter sentiment 0.742, market volatility 0.034, news sentiment 0.521. Step two, the attention fusion engine calculates weights: Twitter 42.3%, volatility 35.1%, news 22.6%. Step three, weighted fusion produces a combined signal of 0.612, judged as a BUY operation. Step four, the safety gate checks volatility is within threshold, validation passes, and outputs a safe decision." --write-media voiceover-05-en.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Decisify uses a Python plus Rust hybrid architecture. The Python layer uses FastAPI and async concurrency, providing flexible development experience and rapid iteration capability. The Rust layer implements core fusion algorithms, providing zero-cost abstractions and memory safety guarantees. This hybrid architecture delivers 1.2 to 1.4x performance improvement with sub-millisecond decision latency. The system also features complete error handling, graceful degradation, and over 85% test coverage." --write-media voiceover-06-en.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Decisify applies to multiple real-world scenarios. In financial trading, it fuses market data and social sentiment to generate investment advice. For public opinion monitoring, it tracks multi-platform dynamics in real-time to warn of risks. In intelligent operations, it integrates business metrics to optimize decision processes. Decisify perfectly aligns with Hackathon Track 2 requirements: autonomous decision loops beyond chat, multi-modal perception, human-agent collaboration, and quantifiable value creation." --write-media voiceover-07-en.mp3

edge-tts --voice en-US-JennyNeural --rate=+0% --text "Visit Decisify now to experience transparent AI decision intelligence." --write-media voiceover-08-en.mp3

echo "所有英文配音生成完成！"
```

---

## 📊 时间轴总结

| 页面 | 时长 | 累计时间 | 内容 |
|------|------|----------|------|
| 1 | 15s | 0:15 | 封面 |
| 2 | 35s | 0:50 | 问题与解决方案 |
| 3 | 25s | 1:15 | 决策流程架构 |
| 4 | 30s | 1:45 | Dashboard 总览 |
| 5 | 35s | 2:20 | 决策流程详解 |
| 6 | 30s | 2:50 | 技术架构与性能 |
| 7 | 25s | 3:15 | 应用场景与价值 |
| 8 | 10s | 3:25 | 结尾 CTA |

**实际总时长：3 分 25 秒**（留有 25 秒缓冲）

---

## 🎙️ 推荐语音选项

### 中文语音
- **zh-CN-XiaoxiaoNeural** - 女声，自然、专业（推荐）
- **zh-CN-YunxiNeural** - 男声，沉稳、权威
- **zh-CN-XiaoyiNeural** - 女声，活泼、年轻

### 英文语音
- **en-US-JennyNeural** - 女声，清晰、专业（推荐）
- **en-US-GuyNeural** - 男声，友好、可信
- **en-US-AriaNeural** - 女声，温暖、自然

---

## 💡 使用建议

1. **语速调整**：如果觉得太快，可以设置 `--rate=-10%`；太慢则 `--rate=+10%`
2. **音量调整**：使用 `--volume=+20%` 或 `--volume=-20%`
3. **测试试听**：先生成一两个片段试听，确认满意后再批量生成
4. **文件命名**：建议按页面顺序命名，方便后期编辑
5. **备份脚本**：保存生成脚本，方便后续修改重新生成
