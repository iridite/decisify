import React from "react";
import { motion } from "framer-motion";
import { Zap, Activity, Clock, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * PerformanceMetrics - 性能指标卡片组件
 * 展示系统关键性能指标：决策延迟、信号源状态、总决策次数、系统运行时间
 */
export function PerformanceMetrics({ data }) {
  const metrics = data?.metrics || {};
  const status = data?.status || {};

  // 计算平均决策延迟
  const avgLatency = metrics.avg_decision_latency_ms || 0;

  // 计算信号源健康度
  const signalSources = Object.keys(data?.signals || {});
  const healthySignals = signalSources.filter(
    source => data.signals[source]?.value !== null
  ).length;
  const signalHealth = signalSources.length > 0
    ? (healthySignals / signalSources.length) * 100
    : 0;

  // 系统运行时间（秒转换为可读格式）
  const uptime = status.uptime_seconds || 0;
  const uptimeFormatted = formatUptime(uptime);

  // 总决策次数
  const totalDecisions = status.cycle_count || 0;

  const metricsData = [
    {
      icon: Clock,
      label: "决策延迟",
      value: `${avgLatency.toFixed(2)}ms`,
      status: avgLatency < 100 ? "good" : avgLatency < 500 ? "warning" : "critical",
      description: "平均决策处理时间"
    },
    {
      icon: Activity,
      label: "信号源健康",
      value: `${signalHealth.toFixed(0)}%`,
      status: signalHealth > 80 ? "good" : signalHealth > 50 ? "warning" : "critical",
      description: `${healthySignals}/${signalSources.length} 源在线`
    },
    {
      icon: CheckCircle2,
      label: "总决策数",
      value: totalDecisions.toLocaleString(),
      status: "good",
      description: "自启动以来的决策次数"
    },
    {
      icon: Zap,
      label: "系统运行时间",
      value: uptimeFormatted,
      status: "good",
      description: "持续运行时长"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsData.map((metric, index) => (
        <MetricCard key={index} metric={metric} index={index} />
      ))}
    </div>
  );
}

function MetricCard({ metric, index }) {
  const Icon = metric.icon;

  const statusColors = {
    good: "text-signal-bullish",
    warning: "text-volatility-orange",
    critical: "text-signal-bearish"
  };

  const statusBgColors = {
    good: "bg-signal-bullish/10",
    warning: "bg-volatility-orange/10",
    critical: "bg-signal-bearish/10"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bento-item p-4 hover:scale-105 transition-transform"
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg ${statusBgColors[metric.status]}`}>
          <Icon className={`w-5 h-5 ${statusColors[metric.status]}`} />
        </div>
        <StatusIndicator status={metric.status} />
      </div>

      <div className="mt-3">
        <div className={`text-2xl font-bold ${statusColors[metric.status]}`}>
          {metric.value}
        </div>
        <div className="text-sm font-medium text-text-primary mt-1">
          {metric.label}
        </div>
        <div className="text-xs text-text-secondary mt-1">
          {metric.description}
        </div>
      </div>
    </motion.div>
  );
}

function StatusIndicator({ status }) {
  const colors = {
    good: "bg-signal-bullish",
    warning: "bg-volatility-orange",
    critical: "bg-signal-bearish"
  };

  return (
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className={`w-2 h-2 rounded-full ${colors[status]}`}
    />
  );
}

function formatUptime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}
