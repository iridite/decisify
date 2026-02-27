import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';

/**
 * GuidedTour - 新用户引导组件
 *
 * 为评委和新用户提供交互式引导，快速理解 Decisify 的核心功能
 */
export function GuidedTour({ run, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      target: 'body',
      content: (
        <div>
          <h2 className="text-xl font-bold mb-2">欢迎来到 Decisify 🎯</h2>
          <p className="text-sm text-gray-300 mb-3">
            这是一个 AI 驱动的决策智能平台，通过融合多源数据实现自主决策循环。
          </p>
          <p className="text-xs text-gray-400">
            让我们用 30 秒快速了解核心功能 →
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="agent-thoughts"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🧠 Agent 推理日志</h3>
          <p className="text-sm text-gray-300 mb-2">
            实时显示 AI Agent 的思考过程，包括：
          </p>
          <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
            <li>推理类型（三角验证、风险评估）</li>
            <li>置信度评分</li>
            <li>自然语言解释</li>
          </ul>
          <p className="text-xs text-iridyne-green mt-2">
            ✨ 完全透明，每个决策都有完整推理轨迹
          </p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="triangulation"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🔺 三角验证矩阵</h3>
          <p className="text-sm text-gray-300 mb-2">
            跨数据源相关性分析，确保决策可靠性：
          </p>
          <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
            <li>Polymarket ↔ X Intelligence 相关性</li>
            <li>X ↔ Nautilus 信号对齐度</li>
            <li>整体一致性评分</li>
          </ul>
          <p className="text-xs text-iridyne-green mt-2">
            ✨ 多源验证，避免单点失败
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="polymarket"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">📊 Polymarket 预测市场</h3>
          <p className="text-sm text-gray-300 mb-2">
            实时追踪预测市场赔率变化：
          </p>
          <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
            <li>当前赔率 + 1 小时变化</li>
            <li>24 小时交易量</li>
            <li>历史趋势图</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="x-intelligence"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🐦 X Intelligence 情绪分析</h3>
          <p className="text-sm text-gray-300 mb-2">
            社交媒体情绪实时监控：
          </p>
          <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
            <li>情绪评分（BULLISH/BEARISH）</li>
            <li>Agent 相关性评分</li>
            <li>影响力权重</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="nautilus"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">⚓ Nautilus 量化信号</h3>
          <p className="text-sm text-gray-300 mb-2">
            专业量化交易策略信号：
          </p>
          <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
            <li>策略类型（Keltner Channel）</li>
            <li>信号强度 + 持仓状态</li>
            <li>未实现盈亏</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="proposal"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🎯 决策提案系统</h3>
          <p className="text-sm text-gray-300 mb-2">
            AI 生成的决策提案，等待人工审批：
          </p>
          <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
            <li>决策动作（BUY/SELL/HOLD）</li>
            <li>风险等级 + 预期收益</li>
            <li>完整推理解释</li>
          </ul>
          <p className="text-xs text-iridyne-green mt-2">
            ✨ 人在回路（Human-in-the-Loop）确保安全
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="attention-weights"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">🧮 注意力权重可视化</h3>
          <p className="text-sm text-gray-300 mb-2">
            显示每个数据源对最终决策的影响程度：
          </p>
          <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
            <li>动态权重分配（Softmax 机制）</li>
            <li>温度参数控制决策锐度</li>
            <li>完全可解释的融合过程</li>
          </ul>
          <p className="text-xs text-iridyne-green mt-2">
            ✨ 这是 Decisify 的核心创新
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: 'body',
      content: (
        <div>
          <h2 className="text-xl font-bold mb-2">🎉 引导完成！</h2>
          <p className="text-sm text-gray-300 mb-3">
            现在你已经了解了 Decisify 的核心功能。
          </p>
          <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-400 mb-2">💡 快速提示：</p>
            <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
              <li>点击右上角导航查看决策历史和错误日志</li>
              <li>按 <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Ctrl+D</kbd> 切换演示模式</li>
              <li>在演示模式下，数据会实时动态变化</li>
            </ul>
          </div>
          <p className="text-xs text-gray-400">
            随时可以在设置中重新启动引导 →
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status, index, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // 引导完成或跳过
      if (onComplete) {
        onComplete();
      }
    }

    // 更新当前步骤
    if (type === 'step:after') {
      setStepIndex(index + 1);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#00ff9d', // iridyne-green
          backgroundColor: '#1a1a1a',
          textColor: '#e5e5e5',
          overlayColor: 'rgba(0, 0, 0, 0.8)',
          arrowColor: '#1a1a1a',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
          fontSize: 14,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#00ff9d',
          color: '#000',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: 14,
          fontWeight: 600,
        },
        buttonBack: {
          color: '#9ca3af',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#9ca3af',
        },
        beacon: {
          inner: '#00ff9d',
          outer: '#00ff9d',
        },
      }}
      locale={{
        back: '上一步',
        close: '关闭',
        last: '完成',
        next: '下一步',
        skip: '跳过引导',
      }}
    />
  );
}

/**
 * useTourState - 管理引导状态的 Hook
 */
export function useTourState() {
  const [runTour, setRunTour] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);

  useEffect(() => {
    // 检查用户是否已完成引导
    const completed = localStorage.getItem('decisify_tour_completed');

    if (!completed) {
      // 首次访问，延迟 1 秒后启动引导
      const timer = setTimeout(() => {
        setRunTour(true);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setTourCompleted(true);
    }
  }, []);

  const handleTourComplete = () => {
    setRunTour(false);
    setTourCompleted(true);
    localStorage.setItem('decisify_tour_completed', 'true');
  };

  const restartTour = () => {
    setRunTour(true);
    setTourCompleted(false);
  };

  return {
    runTour,
    tourCompleted,
    handleTourComplete,
    restartTour,
  };
}
