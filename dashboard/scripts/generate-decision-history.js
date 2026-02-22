/**
 * 生成 Decision History 模拟数据
 * 用于演示历史决策记录功能
 */

// 生成过去 7 天的决策历史
function generateDecisionHistory() {
  const decisions = [];
  const now = new Date();
  const actions = ['BUY', 'SELL', 'HOLD'];
  const eventTypes = [
    'POLYMARKET_ODDS_SHIFT',
    'X_SENTIMENT_SHIFT',
    'NAUTILUS_SIGNAL_CHANGE',
    'VOLATILITY_SPIKE',
    'CORRELATION_BREAK'
  ];

  // 生成 7 天历史，每天 1-3 个决策
  for (let day = 6; day >= 0; day--) {
    const decisionsPerDay = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < decisionsPerDay; i++) {
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - day);
      timestamp.setHours(Math.floor(Math.random() * 24));
      timestamp.setMinutes(Math.floor(Math.random() * 60));

      const action = actions[Math.floor(Math.random() * actions.length)];
      const confidence = 0.5 + Math.random() * 0.4; // 0.5-0.9
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

      // 高 confidence 对应高成功率
      const success = Math.random() < (confidence * 0.8 + 0.2);

      const decision = {
        id: `decision_${timestamp.getTime()}`,
        timestamp: timestamp.toISOString(),
        action: action,
        confidence: parseFloat(confidence.toFixed(2)),
        event_type: eventType,
        reasoning: generateReasoning(action, confidence, eventType),
        attention_weights: {
          polymarket: parseFloat((Math.random() * 0.5 + 0.2).toFixed(2)),
          x_sentiment: parseFloat((Math.random() * 0.4 + 0.2).toFixed(2)),
          nautilus: parseFloat((Math.random() * 0.3 + 0.1).toFixed(2))
        },
        outcome: {
          status: success ? 'SUCCESS' : 'FAILED',
          pnl: success ? parseFloat((Math.random() * 500 + 100).toFixed(2)) : parseFloat((-Math.random() * 300 - 50).toFixed(2)),
          execution_time_ms: Math.floor(Math.random() * 50) + 10
        },
        human_decision: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'approved' : 'rejected') : null,
        safety_gate_triggered: Math.random() > 0.85
      };

      decisions.push(decision);
    }
  }

  // 按时间倒序排列
  return decisions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function generateReasoning(action, confidence, eventType) {
  const templates = {
    BUY: [
      `Strong bullish signal detected. Polymarket odds increased by ${(Math.random() * 5 + 1).toFixed(1)}%, X sentiment positive (${(confidence * 0.9).toFixed(2)}). Recommending BUY with ${(confidence * 100).toFixed(0)}% confidence.`,
      `Market momentum turning positive. ${eventType.replace(/_/g, ' ').toLowerCase()} indicates upward trend. BUY signal with ${(confidence * 100).toFixed(0)}% confidence.`,
      `Triangulation analysis shows convergence on bullish outlook. All three signals aligned. BUY recommendation at ${(confidence * 100).toFixed(0)}% confidence.`
    ],
    SELL: [
      `Bearish indicators detected. Polymarket odds declining, X sentiment negative. Recommending SELL with ${(confidence * 100).toFixed(0)}% confidence.`,
      `Risk signals elevated. ${eventType.replace(/_/g, ' ').toLowerCase()} suggests downward pressure. SELL signal at ${(confidence * 100).toFixed(0)}% confidence.`,
      `Market divergence detected. Nautilus signal bearish, sentiment weakening. SELL recommendation with ${(confidence * 100).toFixed(0)}% confidence.`
    ],
    HOLD: [
      `Mixed signals detected. Insufficient confidence for directional trade. Recommending HOLD with ${(confidence * 100).toFixed(0)}% confidence.`,
      `Market uncertainty elevated. ${eventType.replace(/_/g, ' ').toLowerCase()} shows conflicting data. HOLD position at ${(confidence * 100).toFixed(0)}% confidence.`,
      `Waiting for clearer signal. Current data inconclusive. HOLD recommendation with ${(confidence * 100).toFixed(0)}% confidence.`
    ]
  };

  const options = templates[action];
  return options[Math.floor(Math.random() * options.length)];
}

// 生成统计数据
function generateStats(decisions) {
  const total = decisions.length;
  const successful = decisions.filter(d => d.outcome.status === 'SUCCESS').length;
  const byAction = {
    BUY: decisions.filter(d => d.action === 'BUY').length,
    SELL: decisions.filter(d => d.action === 'SELL').length,
    HOLD: decisions.filter(d => d.action === 'HOLD').length
  };

  const totalPnL = decisions.reduce((sum, d) => sum + d.outcome.pnl, 0);
  const avgConfidence = decisions.reduce((sum, d) => sum + d.confidence, 0) / total;
  const safetyGateTriggered = decisions.filter(d => d.safety_gate_triggered).length;
  const humanApproved = decisions.filter(d => d.human_decision === 'approved').length;
  const humanRejected = decisions.filter(d => d.human_decision === 'rejected').length;

  return {
    total_decisions: total,
    success_rate: parseFloat((successful / total * 100).toFixed(1)),
    decisions_by_action: byAction,
    total_pnl: parseFloat(totalPnL.toFixed(2)),
    avg_confidence: parseFloat(avgConfidence.toFixed(2)),
    safety_gate_triggered: safetyGateTriggered,
    human_approved: humanApproved,
    human_rejected: humanRejected,
    avg_execution_time_ms: parseFloat((decisions.reduce((sum, d) => sum + d.outcome.execution_time_ms, 0) / total).toFixed(1))
  };
}

// 生成完整数据
const decisions = generateDecisionHistory();
const stats = generateStats(decisions);

const output = {
  meta: {
    generated_at: new Date().toISOString(),
    time_range_days: 7,
    total_decisions: decisions.length
  },
  stats: stats,
  decisions: decisions
};

console.log(JSON.stringify(output, null, 2));
