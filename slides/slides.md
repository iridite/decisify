---
layout: center
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
title: 'Decisify - 决策智能体'
exportFilename: decisify-demo
lineNumbers: false
drawings:
  persist: false
mdc: true
clicks: 0
preload: false
glowSeed: 233
routerMode: hash
fonts:
  sans: 'DM Sans'
  serif: 'DM Serif Display'
  mono: 'Fira Code'
  cn: 'Noto Sans SC'
---

<style src="./style.css"></style>



<div translate-x--10>

<h1>
Decisify: 决策智能体
</h1>

AI Decision Intelligence Platform

让 AI 智能体从"能聊天"进化到"能决策"

</div>

---
layout: intro
class: px-24
glowSeed: 128
---

<div flex items-center justify-center>
  <div
    v-click flex flex-col gap-2 items-center justify-center transition duration-500 ease-in-out
    :class="$clicks < 1 ? 'translate-x--20' : 'translate-x-0'"
  >
    <div flex items-center gap-6>
      <div i-carbon:data-base text-8xl text-cyan-400 />
    </div>
    <div text-sm text-cyan-300 mt-2>多源数据</div>
    <div text-xs text-cyan-400 opacity-70>Twitter · Polymarket · News</div>
  </div>
  <div
    v-after pl-15 pr-15 transition duration-500 ease-in-out
    :class="$clicks < 1 ? 'scale-80' : 'scale-100'"
  >
    <div i-carbon:add text-8xl />
  </div>
  <div
    v-after flex flex-col gap-2 items-center justify-center transition duration-500 ease-in-out
    :class="$clicks < 1 ? 'translate-x-20' : 'translate-x-0'"
  >
    <div flex items-center gap-6>
      <div i-carbon:machine-learning text-8xl text-purple-400 />
    </div>
    <div text-sm text-purple-300 mt-2>AI 决策引擎</div>
    <div text-xs text-purple-400 opacity-70>Attention Fusion</div>
  </div>
</div>

<div v-click="2" mt-10 text-center>
  <div text-xl>"多源感知、注意力融合、透明推理"</div>
  <div text-neutral-400 mt-2 text-sm>- 让 AI 智能体真正能决策</div>
  <div v-click="3" mt-6 flex justify-center gap-8 text-xs opacity-60>
    <div>⚡ <1ms 延迟</div>
    <div>🎯 85%+ 测试覆盖</div>
    <div>🔄 5秒决策周期</div>
  </div>
</div>



---
class: py-10
glowSeed: 100
---

# 当前挑战

<span text="white/70">AI 智能体面临三大核心问题</span>

<div mt-10 />

<div grid grid-cols-3 gap-8>
  <div 
    v-click="1" 
    class="border-2 border-red-500/30 rounded-lg p-6 bg-red-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 1 ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'"
  >
    <div text-5xl mb-4 text-center>🔍</div>
    <div text-xl font-bold mb-2 text-red-300 text-center flex items-center justify-center gap-2>
      <div i-carbon:view-off inline-block />感知盲区
    </div>
    <div text-xs text-red-200 text-center mb-3>Perception Gaps</div>
    <div text-sm mb-3>单一数据源，信息片面，缺乏交叉验证</div>
    <div text-xs opacity-70 border-t="~ red-500/20" pt-3>
      <div mb-1 flex items-center><div i-carbon:dot-mark mr-1 />案例：仅依赖价格数据</div>
      <div flex items-center><div i-carbon:dot-mark mr-1 />错失社交媒体预警信号</div>
    </div>
  </div>

  <div 
    v-click="2" 
    class="border-2 border-purple-500/30 rounded-lg p-6 bg-purple-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 2 ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'"
  >
    <div text-5xl mb-4 text-center>🎭</div>
    <div text-xl font-bold mb-2 text-purple-300 text-center flex items-center justify-center gap-2>
      <div i-carbon:unknown inline-block />黑盒推理
    </div>
    <div text-xs text-purple-200 text-center mb-3>Black-box Reasoning</div>
    <div text-sm mb-3>决策过程不透明，难以理解和信任</div>
    <div text-xs opacity-70 border-t="~ purple-500/20" pt-3>
      <div mb-1 flex items-center><div i-carbon:dot-mark mr-1 />案例：AI 给出建议</div>
      <div flex items-center><div i-carbon:dot-mark mr-1 />但无法解释为什么</div>
    </div>
  </div>

  <div 
    v-click="3" 
    class="border-2 border-yellow-500/30 rounded-lg p-6 bg-yellow-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 3 ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'"
  >
    <div text-5xl mb-4 text-center>⚠️</div>
    <div text-xl font-bold mb-2 text-yellow-300 text-center flex items-center justify-center gap-2>
      <div i-carbon:warning inline-block />执行风险
    </div>
    <div text-xs text-yellow-200 text-center mb-3>Execution Risks</div>
    <div text-sm mb-3>缺乏安全机制，后果不可控</div>
    <div text-xs opacity-70 border-t="~ yellow-500/20" pt-3>
      <div mb-1 flex items-center><div i-carbon:dot-mark mr-1 />案例：高波动期</div>
      <div flex items-center><div i-carbon:dot-mark mr-1 />仍执行激进操作</div>
    </div>
  </div>
</div>

---
class: py-10
glowSeed: 150
---

# Decisify 解决方案

<span text="white/70">完整的决策工作流</span>

<div mt-8 />

<div grid grid-cols-2 gap-6>
  <div 
    v-click="1" 
    class="border-2 border-cyan-500/30 rounded-lg p-5 bg-cyan-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 1 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
  >
    <div text-4xl mb-2 text-center>🔍</div>
    <div text-lg font-bold mb-1 text-cyan-300 text-center flex items-center justify-center gap-2>
      <div i-carbon:data-base inline-block />多源感知层
    </div>
    <div text-xs text-cyan-200 text-center mb-2>Multi-source Perception</div>
    <div text-sm text-center mb-2>社交媒体、预测市场、新闻事件</div>
    <div text-xs opacity-70 text-center flex items-center justify-center gap-2>
      <div>异步并发采集</div><div>·</div><div>容错降级</div>
    </div>
  </div>

  <div 
    v-click="2" 
    class="border-2 border-purple-500/30 rounded-lg p-5 bg-purple-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 2 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
  >
    <div text-4xl mb-2 text-center>🧠</div>
    <div text-lg font-bold mb-1 text-purple-300 text-center flex items-center justify-center gap-2>
      <div i-carbon:machine-learning inline-block />注意力融合引擎
    </div>
    <div text-xs text-purple-200 text-center mb-2>Attention Fusion</div>
    <div text-sm text-center mb-2>Transformer 机制，动态权重</div>
    <div text-xs opacity-70 text-center font-mono>
      <div>W<sub>i</sub> = exp(S<sub>i</sub>) / Σexp(S<sub>j</sub>)</div>
    </div>
  </div>

  <div 
    v-click="3" 
    class="border-2 border-green-500/30 rounded-lg p-5 bg-green-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 3 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
  >
    <div text-4xl mb-2 text-center>📊</div>
    <div text-lg font-bold mb-1 text-green-300 text-center flex items-center justify-center gap-2>
      <div i-carbon:flow-data inline-block />透明推理链路
    </div>
    <div text-xs text-green-200 text-center mb-2>Transparent Reasoning</div>
    <div text-sm text-center mb-2>完整记录，每步可追溯</div>
    <div text-xs opacity-70 text-center>
      <div>输入 → 权重 → 融合 → 输出</div>
    </div>
  </div>

  <div 
    v-click="4" 
    class="border-2 border-orange-500/30 rounded-lg p-5 bg-orange-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 4 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
  >
    <div text-4xl mb-2 text-center>🛡️</div>
    <div text-lg font-bold mb-1 text-orange-300 text-center flex items-center justify-center gap-2>
      <div i-carbon:security inline-block />安全门控机制
    </div>
    <div text-xs text-orange-200 text-center mb-2>Safety Guardrails</div>
    <div text-sm text-center mb-2>实时验证，人工审批</div>
    <div text-xs opacity-70 text-center flex items-center justify-center gap-2>
      <div>波动率检查</div><div>·</div><div>置信度阈值</div>
    </div>
  </div>
</div>

---
class: py-10
glowSeed: 200
---

# 实时仪表盘

<span text="white/70">5 秒决策周期，完整可视化</span>
<div mt-5 />
<div grid grid-cols-2 gap-6>
  <div>
    <img src="/screenshots/dashboard-overview.png" rounded-xl shadow-2xl w-full />
    <div text-xs text-center mt-2 opacity-60>
      实时更新 · 多维度展示 · 交互式探索
    </div>
  </div>
  <div space-y-3>
    <div 
      v-click="1" 
      class="border-2 border-blue-500/30 rounded-lg p-3 bg-blue-900/20 backdrop-blur"
      transition duration-500 ease-in-out
      :class="$clicks < 1 ? 'opacity-0 translate-x-5' : 'opacity-100 translate-x-0'"
    >
      <div text-base font-bold mb-1 text-blue-300 flex items-center>
        <div i-carbon:renew text-lg mr-2 />自动决策循环
      </div>
      <div text-sm text-blue-200 mb-1>
        每 5 秒完整感知→融合→推理→执行
      </div>
      <div text-xs opacity-70>
        异步非阻塞 · 独立于 API 请求
      </div>
    </div>
    <div 
      v-click="2" 
      class="border-2 border-purple-500/30 rounded-lg p-3 bg-purple-900/20 backdrop-blur"
      transition duration-500 ease-in-out
      :class="$clicks < 2 ? 'opacity-0 translate-x-5' : 'opacity-100 translate-x-0'"
    >
      <div text-base font-bold mb-1 text-purple-300 flex items-center>
        <div i-carbon:chart-bar text-lg mr-2 />注意力权重
      </div>
      <div text-sm text-purple-200 mb-1>
        实时显示信号源权重，动态调整
      </div>
      <div text-xs opacity-70>
        Softmax 归一化 · 温度可调
      </div>
    </div>
    <div 
      v-click="3" 
      class="border-2 border-green-500/30 rounded-lg p-3 bg-green-900/20 backdrop-blur"
      transition duration-500 ease-in-out
      :class="$clicks < 3 ? 'opacity-0 translate-x-5' : 'opacity-100 translate-x-0'"
    >
      <div text-base font-bold mb-1 text-green-300 flex items-center>
        <div i-carbon:search text-lg mr-2 />推理轨迹
      </div>
      <div text-sm text-green-200 mb-1>
        完整展示思考过程，透明可追溯
      </div>
      <div text-xs opacity-70>
        信号值 · 权重 · 融合结果 · 安全检查
      </div>
    </div>
  </div>
</div>

---
class: py-10
glowSeed: 250
---

# 技术架构

<span text="white/70">Python + Rust 混合架构</span>

<div mt-5 />

<div grid grid-cols-2 gap-6>
  <div 
    v-click="1" 
    class="border-2 border-cyan-500/30 rounded-lg p-4 bg-cyan-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 1 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
  >
    <div flex items-center justify-center gap-2 mb-2>
      <div i-logos:python text-4xl />
    </div>
    <div text-lg font-bold mb-1 text-cyan-300 text-center flex items-center justify-center gap-2>
      <div i-carbon:application-web inline-block />Python 层
    </div>
    <div text-xs text-cyan-200 text-center mb-2>FastAPI + 异步并发</div>
    <div text-sm text-center mb-2>灵活开发，快速迭代</div>
    <div text-xs opacity-70 border-t="~ cyan-500/20" pt-2>
      <div flex items-center><div i-carbon:checkmark mr-1 />API 服务</div>
      <div flex items-center><div i-carbon:checkmark mr-1 />传感器编排</div>
      <div flex items-center><div i-carbon:checkmark mr-1 />状态管理</div>
    </div>
  </div>

  <div 
    v-click="2" 
    class="border-2 border-orange-500/30 rounded-lg p-4 bg-orange-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 2 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
  >
    <div flex items-center justify-center gap-2 mb-2>
      <div i-logos:rust text-4xl />
    </div>
    <div text-lg font-bold mb-1 text-orange-300 text-center flex items-center justify-center gap-2>
      <div i-carbon:chip inline-block />Rust 层
    </div>
    <div text-xs text-orange-200 text-center mb-2>融合算法 + 零开销</div>
    <div text-sm text-center mb-2>极致性能，内存安全</div>
    <div text-xs opacity-70 border-t="~ orange-500/20" pt-2>
      <div flex items-center><div i-carbon:checkmark mr-1 />注意力计算</div>
      <div flex items-center><div i-carbon:checkmark mr-1 />批量处理</div>
      <div flex items-center><div i-carbon:checkmark mr-1 />PyO3 绑定</div>
    </div>
  </div>
</div>

<div 
  v-click="3" 
  mt-4 flex justify-center
  transition duration-500 ease-in-out
  :class="$clicks < 3 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
>
  <div class="border-2 border-green-500/30 rounded-xl p-3 bg-green-900/20 backdrop-blur">
    <div text-lg font-bold text-green-300 mb-2 text-center flex items-center justify-center gap-2>
      <div i-carbon:rocket inline-block />性能提升 1.2-1.4x
    </div>
    <div grid grid-cols-3 gap-4 text-sm text-center>
      <div>
        <div text-lg font-bold text-green-400 mb-1>&lt;1ms</div>
        <div text-xs opacity-70>决策延迟</div>
      </div>
      <div>
        <div text-lg font-bold text-green-400 mb-1>85%+</div>
        <div text-xs opacity-70>测试覆盖</div>
      </div>
      <div>
        <div text-lg font-bold text-green-400 mb-1>0</div>
        <div text-xs opacity-70>运行时开销</div>
      </div>
    </div>
  </div>
</div>

---
class: py-10
glowSeed: 300
---

# 核心创新

<span text="white/70">三大技术突破</span>

<div mt-6 />

<div grid grid-cols-3 gap-5>
  <div 
    v-click="1" 
    class="border-2 border-cyan-500/30 rounded-lg p-5 bg-cyan-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 1 ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'"
  >
    <div flex items-center justify-center mb-3>
      <div i-carbon:machine-learning text-5xl text-cyan-400 />
    </div>
    <div text-lg font-bold mb-1 text-cyan-300 text-center>注意力机制</div>
    <div text-xs text-cyan-200 text-center mb-3>Attention Mechanism</div>
    <div text-sm mb-2>
      首次将 Transformer 注意力机制应用于多源信号融合，实现动态权重分配
    </div>
    <div text-xs opacity-70 border-t="~ cyan-500/20" pt-2 font-mono text-center>
      <div mb-1>W<sub>i</sub> = exp(S<sub>i</sub>/T) / Σexp(S<sub>j</sub>/T)</div>
      <div text-xs>温度参数 T 控制锐度</div>
    </div>
  </div>

  <div 
    v-click="2" 
    class="border-2 border-purple-500/30 rounded-lg p-5 bg-purple-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 2 ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'"
  >
    <div flex items-center justify-center mb-3>
      <div i-carbon:flow-data text-5xl text-purple-400 />
    </div>
    <div text-lg font-bold mb-1 text-purple-300 text-center>透明推理</div>
    <div text-xs text-purple-200 text-center mb-3>Transparent Reasoning</div>
    <div text-sm mb-2>
      完整记录每步决策过程，从原始信号到最终输出，全程可追溯可审计
    </div>
    <div text-xs opacity-70 border-t="~ purple-500/20" pt-2>
      <div flex items-center><div i-carbon:checkmark mr-1 />信号采集日志</div>
      <div flex items-center><div i-carbon:checkmark mr-1 />权重计算过程</div>
      <div flex items-center><div i-carbon:checkmark mr-1 />融合结果记录</div>
      <div flex items-center><div i-carbon:checkmark mr-1 />安全检查轨迹</div>
    </div>
  </div>

  <div 
    v-click="3" 
    class="border-2 border-green-500/30 rounded-lg p-5 bg-green-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 3 ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'"
  >
    <div flex items-center justify-center mb-3>
      <div i-carbon:flash text-5xl text-green-400 />
    </div>
    <div text-lg font-bold mb-1 text-green-300 text-center>极致性能</div>
    <div text-xs text-green-200 text-center mb-3>Ultra Performance</div>
    <div text-sm mb-2>
      Rust 实现核心算法，<1ms 决策延迟，支持高频交易场景
    </div>
    <div text-xs opacity-70 border-t="~ green-500/20" pt-2>
      <div flex items-center><div i-carbon:checkmark mr-1 />零拷贝数据传递</div>
      <div flex items-center><div i-carbon:checkmark mr-1 />SIMD 向量化</div>
      <div flex items-center><div i-carbon:checkmark mr-1 />批量并行处理</div>
    </div>
  </div>
</div>

---
class: py-10
glowSeed: 350
---

# 应用场景

<span text="white/70">生产级设计，可直接部署</span>

<div mt-5 />

<div grid grid-cols-3 gap-6>
  <div 
    v-click="1" 
    class="border-2 border-yellow-500/30 rounded-lg p-4 bg-yellow-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 1 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
  >
    <div flex items-center justify-center mb-2>
      <div i-carbon:currency text-4xl text-yellow-400 />
    </div>
    <div text-lg font-bold mb-1 text-yellow-300 text-center flex items-center justify-center gap-2>
      <div i-carbon:chart-line inline-block />金融交易
    </div>
    <div text-xs text-yellow-200 text-center mb-2>Financial Trading</div>
    <div text-sm text-center mb-2>融合市场数据与社交情绪</div>
    <div text-xs opacity-70 border-t="~ yellow-500/20" pt-2>
      <div mb-1 flex items-center><div i-carbon:chart-line mr-1 />实时信号融合</div>
      <div mb-1 flex items-center><div i-carbon:security mr-1 />风险控制</div>
      <div flex items-center><div i-carbon:flash mr-1 />高频决策支持</div>
    </div>
  </div>

  <div 
    v-click="2" 
    class="border-2 border-blue-500/30 rounded-lg p-4 bg-blue-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 2 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
  >
    <div flex items-center justify-center mb-2>
      <div i-carbon:document text-4xl text-blue-400 />
    </div>
    <div text-lg font-bold mb-1 text-blue-300 text-center flex items-center justify-center gap-2>
      <div i-carbon:search inline-block />舆情监控
    </div>
    <div text-xs text-blue-200 text-center mb-2>Opinion Monitoring</div>
    <div text-sm text-center mb-2>实时追踪多平台舆论</div>
    <div text-xs opacity-70 border-t="~ blue-500/20" pt-2>
      <div mb-1 flex items-center><div i-carbon:data-base mr-1 />多源数据聚合</div>
      <div mb-1 flex items-center><div i-carbon:warning mr-1 />风险预警</div>
      <div flex items-center><div i-carbon:chart-bar mr-1 />趋势分析</div>
    </div>
  </div>

  <div 
    v-click="3" 
    class="border-2 border-purple-500/30 rounded-lg p-4 bg-purple-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 3 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
  >
    <div flex items-center justify-center mb-2>
      <div i-carbon:operations-record text-4xl text-purple-400 />
    </div>
    <div text-lg font-bold mb-1 text-purple-300 text-center flex items-center justify-center gap-2>
      <div i-carbon:ai-governance inline-block />智能运营
    </div>
    <div text-xs text-purple-200 text-center mb-2>Intelligent Ops</div>
    <div text-sm text-center mb-2>整合业务指标优化决策</div>
    <div text-xs opacity-70 border-t="~ purple-500/20" pt-2>
      <div mb-1 flex items-center><div i-carbon:dashboard mr-1 />指标监控</div>
      <div mb-1 flex items-center><div i-carbon:bot mr-1 />自动化决策</div>
      <div flex items-center><div i-carbon:renew mr-1 />持续优化</div>
    </div>
  </div>
</div>

<div 
  v-click="4" 
  mt-4 flex justify-center
  transition duration-500 ease-in-out
  :class="$clicks < 4 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
>
  <div class="border-2 border-green-500/30 rounded-xl p-3 bg-green-900/20 backdrop-blur">
    <div text-base font-bold text-green-300 mb-2 text-center flex items-center justify-center gap-2>
      <div i-carbon:rocket inline-block />生产级设计
    </div>
    <div grid grid-cols-4 gap-3 text-xs>
      <div flex items-center><div i-carbon:checkmark mr-1 />错误处理</div>
      <div flex items-center><div i-carbon:checkmark mr-1 />优雅降级</div>
      <div flex items-center><div i-carbon:checkmark mr-1 />状态管理</div>
      <div flex items-center><div i-carbon:checkmark mr-1 />测试 >85%</div>
    </div>
    <div text-xs text-center mt-2 opacity-70>
      可扩展架构 · 模块化设计 · 文档完善
    </div>
  </div>
</div>

---
class: py-10
glowSeed: 400
---

# 赛道契合度

<span text="white/70">Track 2: 与智能体共生与智能市场</span>

<div mt-6 />

<div 
  v-click="1" 
  flex items-center justify-center mb-6
  transition duration-500 ease-in-out
  :class="$clicks < 1 ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
>
  <div i-carbon:target text-5xl text-cyan-400 />
  <div ml-4 text-xl>完美契合赛道要求</div>
</div>

<div grid grid-cols-2 gap-5>
  <div 
    v-click="2" 
    class="border-2 border-blue-500/30 rounded-lg p-5 bg-blue-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 2 ? 'opacity-0 translate-x--5' : 'opacity-100 translate-x-0'"
  >
    <div text-lg font-bold mb-2 text-blue-300 flex items-center>
      <div i-carbon:checkmark-filled mr-2 />超越对话
    </div>
    <div text-sm text-blue-200 mb-2>
      完整的感知→推理→执行工作流，实现真正的自主决策循环
    </div>
    <div text-xs opacity-70>
      5秒周期 · 异步非阻塞 · 主动监控
    </div>
  </div>

  <div 
    v-click="3" 
    class="border-2 border-purple-500/30 rounded-lg p-5 bg-purple-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 3 ? 'opacity-0 translate-x-5' : 'opacity-100 translate-x-0'"
  >
    <div text-lg font-bold mb-2 text-purple-300 flex items-center>
      <div i-carbon:checkmark-filled mr-2 />多模态感知
    </div>
    <div text-sm text-purple-200 mb-2>
      并发采集社交媒体、预测市场、新闻等多个数据源
    </div>
    <div text-xs opacity-70>
      Twitter · Polymarket · News · 可扩展
    </div>
  </div>

  <div 
    v-click="4" 
    class="border-2 border-green-500/30 rounded-lg p-5 bg-green-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 4 ? 'opacity-0 translate-x--5' : 'opacity-100 translate-x-0'"
  >
    <div text-lg font-bold mb-2 text-green-300 flex items-center>
      <div i-carbon:checkmark-filled mr-2 />人机协同
    </div>
    <div text-sm text-green-200 mb-2>
      透明推理链路 + 人工审批流程，实现真正的人机协同
    </div>
    <div text-xs opacity-70>
      完整追溯 · 安全门控 · 反馈循环
    </div>
  </div>

  <div 
    v-click="5" 
    class="border-2 border-orange-500/30 rounded-lg p-5 bg-orange-900/20 backdrop-blur"
    transition duration-500 ease-in-out
    :class="$clicks < 5 ? 'opacity-0 translate-x-5' : 'opacity-100 translate-x-0'"
  >
    <div text-lg font-bold mb-2 text-orange-300 flex items-center>
      <div i-carbon:checkmark-filled mr-2 />价值创造
    </div>
    <div text-sm text-orange-200 mb-2>
      决策质量可量化、可优化、可直接部署到生产环境
    </div>
    <div text-xs opacity-70>
      性能指标 · 回测支持 · 生产就绪
    </div>
  </div>
</div>

---
title: Thank you
class: py-10
glowSeed: 450
---

<div flex>
  <div flex-1>
    <div mt-40 />
    <div flex flex-col gap-3>
      <div text-6xl>🚀</div>
      <div text="[48px]" font-bold>Decisify</div>
      <div text-3xl opacity-90>决策智能体</div>
      <div text-xl text="white/50">AI Decision Intelligence Platform</div>
      <div mt-6 text-lg text="white/70">
        让 AI 智能体从"能聊天"进化到"能决策"
      </div>
    </div>
  </div>
  <div text-sm text="zinc-300" text-right flex flex-col gap-3 mt-3>
    <div>
      项目开源在 <a href="https://github.com/iridite/decisify"><div inline-block mr-1 translate-y-0.8 i-ri:github-fill />github.com/iridite/decisify</a>
    </div>
    <div>
      在线演示: <a href="https://iridite.github.io/decisify/">iridite.github.io/decisify</a>
    </div>
    <div>
      演示文稿使用 <a href="https://sli.dev"><div inline-block mr-1 translate-y-0.8 i-logos:slidev />sli.dev</a> 构建
    </div>
  </div>
</div>
