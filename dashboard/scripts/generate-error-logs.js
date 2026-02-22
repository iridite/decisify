/**
 * 生成 Error Logs 模拟数据
 * 用于演示错误处理和系统鲁棒性
 */

function generateErrorLogs() {
  const errors = [];
  const now = new Date();

  const errorTypes = [
    {
      type: 'SENSOR_TIMEOUT',
      severity: 'WARNING',
      sources: ['polymarket', 'x_intelligence', 'nautilus'],
      messages: [
        'Sensor timeout: {source} failed to respond within 5s',
        'Connection timeout to {source} API',
        'No response from {source} after 3 retries'
      ]
    },
    {
      type: 'SAFETY_GATE_TRIGGERED',
      severity: 'INFO',
      sources: ['volatility_check', 'confidence_threshold', 'correlation_check'],
      messages: [
        'Safety Gate blocked: {source} threshold exceeded',
        'Risk control activated: {source} triggered',
        'Decision rejected by {source} safety rule'
      ]
    },
    {
      type: 'DATA_QUALITY_ISSUE',
      severity: 'WARNING',
      sources: ['polymarket', 'x_intelligence', 'nautilus'],
      messages: [
        'Data quality degraded: {source} returned incomplete data',
        'Stale data detected from {source} (>10min old)',
        'Anomaly detected in {source} signal'
      ]
    },
    {
      type: 'ATTENTION_WEIGHT_ANOMALY',
      severity: 'ERROR',
      sources: ['attention_mechanism'],
      messages: [
        'Attention weights sum != 1.0 (sum={value})',
        'Negative attention weight detected for {source}',
        'Attention weight overflow: {source} > 1.0'
      ]
    },
    {
      type: 'EXECUTION_FAILURE',
      severity: 'ERROR',
      sources: ['nautilus_trader'],
      messages: [
        'Order execution failed: {source} rejected trade',
        'Insufficient balance for {source} execution',
        'Market closed: {source} cannot execute'
      ]
    }
  ];

  // 生成过去 24 小时的错误日志
  for (let hour = 23; hour >= 0; hour--) {
    // 每小时 0-2 个错误
    const errorsPerHour = Math.floor(Math.random() * 3);

    for (let i = 0; i < errorsPerHour; i++) {
      const timestamp = new Date(now);
      timestamp.setHours(timestamp.getHours() - hour);
      timestamp.setMinutes(Math.floor(Math.random() * 60));

      const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)];
      const source = errorType.sources[Math.floor(Math.random() * errorType.sources.length)];
      const messageTemplate = errorType.messages[Math.floor(Math.random() * errorType.messages.length)];

      const message = messageTemplate
        .replace('{source}', source)
        .replace('{value}', (Math.random() * 0.2 + 0.9).toFixed(3));

      const error = {
        id: `error_${timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: timestamp.toISOString(),
        type: errorType.type,
        severity: errorType.severity,
        source: source,
        message: message,
        resolved: Math.random() > 0.3, // 70% 已解决
        resolution: null,
        impact: generateImpact(errorType.type)
      };

      if (error.resolved) {
        error.resolution = generateResolution(errorType.type, source);
      }

      errors.push(error);
    }
  }

  // 按时间倒序排列
  return errors.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function generateImpact(errorType) {
  const impacts = {
    SENSOR_TIMEOUT: 'Decision delayed by 2-5s, fallback to cached data',
    SAFETY_GATE_TRIGGERED: 'Proposed action blocked, no trade executed',
    DATA_QUALITY_ISSUE: 'Reduced confidence score by 10-20%',
    ATTENTION_WEIGHT_ANOMALY: 'Decision aborted, system reset required',
    EXECUTION_FAILURE: 'Trade not executed, position unchanged'
  };

  return impacts[errorType] || 'Unknown impact';
}

function generateResolution(errorType, source) {
  const resolutions = {
    SENSOR_TIMEOUT: [
      `Retried ${source} connection, succeeded on 2nd attempt`,
      `Switched to backup ${source} endpoint`,
      `Used cached ${source} data from 30s ago`
    ],
    SAFETY_GATE_TRIGGERED: [
      `Volatility decreased below threshold, gate cleared`,
      `Confidence improved to acceptable level`,
      `Correlation normalized, safety check passed`
    ],
    DATA_QUALITY_ISSUE: [
      `${source} API recovered, fresh data received`,
      `Data validation passed after cleanup`,
      `Anomaly resolved, signal back to normal`
    ],
    ATTENTION_WEIGHT_ANOMALY: [
      'Attention mechanism reinitialized',
      'Weights renormalized successfully',
      'System reset completed'
    ],
    EXECUTION_FAILURE: [
      `${source} connection restored`,
      'Sufficient balance confirmed, retry succeeded',
      'Market reopened, order placed'
    ]
  };

  const options = resolutions[errorType] || ['Issue resolved'];
  return options[Math.floor(Math.random() * options.length)];
}

// 生成统计数据
function generateStats(errors) {
  const total = errors.length;
  const resolved = errors.filter(e => e.resolved).length;
  const bySeverity = {
    ERROR: errors.filter(e => e.severity === 'ERROR').length,
    WARNING: errors.filter(e => e.severity === 'WARNING').length,
    INFO: errors.filter(e => e.severity === 'INFO').length
  };

  const byType = errors.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  const last24h = errors.filter(e => {
    const diff = Date.now() - new Date(e.timestamp).getTime();
    return diff < 24 * 60 * 60 * 1000;
  }).length;

  return {
    total_errors: total,
    resolved_errors: resolved,
    resolution_rate: parseFloat((resolved / total * 100).toFixed(1)),
    errors_by_severity: bySeverity,
    errors_by_type: byType,
    errors_last_24h: last24h,
    avg_resolution_time_minutes: parseFloat((Math.random() * 10 + 2).toFixed(1))
  };
}

// 生成完整数据
const errors = generateErrorLogs();
const stats = generateStats(errors);

const output = {
  meta: {
    generated_at: new Date().toISOString(),
    time_range_hours: 24,
    total_errors: errors.length
  },
  stats: stats,
  errors: errors
};

console.log(JSON.stringify(output, null, 2));
