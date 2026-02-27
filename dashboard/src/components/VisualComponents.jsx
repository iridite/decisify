import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target } from 'lucide-react';

/**
 * KeyMetricsBar - 顶部关键指标栏
 *
 * 突出显示最重要的决策信息，让评委一眼看到核心价值
 */
export function KeyMetricsBar({ proposal, triangulation }) {
  if (!proposal) return null;

  const actionColors = {
    BUY: 'from-green-500 to-emerald-400',
    SELL: 'from-red-500 to-rose-400',
    HOLD: 'from-yellow-500 to-amber-400',
  };

  const actionIcons = {
    BUY: TrendingUp,
    SELL: TrendingDown,
    HOLD: Target,
  };

  const ActionIcon = actionIcons[proposal.action] || Target;
  const actionGradient = actionColors[proposal.action] || actionColors.HOLD;

  const riskColors = {
    LOW: 'text-green-400 bg-green-500/10 border-green-500/30',
    MEDIUM: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    HIGH: 'text-red-400 bg-red-500/10 border-red-500/30',
  };

  const alignmentScore = triangulation?.overall_alignment || 0;
  const alignmentColor = alignmentScore > 0.7 ? 'text-green-400' : alignmentScore > 0.5 ? 'text-yellow-400' : 'text-red-400';

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 shadow-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 决策动作 - 最突出 */}
        <div className="md:col-span-1">
          <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Current Decision</div>
          <div className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${actionGradient} bg-opacity-10`}>
            <ActionIcon className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold">{proposal.action}</div>
              <div className="text-xs opacity-80">{proposal.asset}</div>
            </div>
          </div>
        </div>

        {/* 置信度 */}
        <div>
          <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Confidence</div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-bold text-iridyne-green">
              {(proposal.confidence * 100).toFixed(0)}
            </div>
            <div className="text-lg text-gray-400 mb-1">%</div>
          </div>
          <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${proposal.confidence * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-iridyne-green to-green-400"
            />
          </div>
        </div>

        {/* 风险等级 */}
        <div>
          <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Risk Level</div>
          <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl border ${riskColors[proposal.risk_level]}`}>
            <AlertTriangle className="w-5 h-5" />
            <span className="text-lg font-bold">{proposal.risk_level}</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Expected Return: <span className="text-iridyne-green font-mono">
              {(proposal.expected_return * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* 数据对齐度 */}
        <div>
          <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Data Alignment</div>
          <div className="flex items-end gap-2">
            <div className={`text-4xl font-bold ${alignmentColor}`}>
              {(alignmentScore * 100).toFixed(0)}
            </div>
            <div className="text-lg text-gray-400 mb-1">%</div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
            <CheckCircle className="w-3 h-3" />
            <span>{triangulation?.interpretation || 'ANALYZING'}</span>
          </div>
        </div>
      </div>

      {/* 推理摘要 */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Reasoning</div>
        <p className="text-sm text-gray-300 leading-relaxed">
          {proposal.reasoning}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * SectionHeader - 统一的区域标题组件
 */
export function SectionHeader({ icon: Icon, title, subtitle, badge }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-iridyne-green/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-iridyne-green" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {badge && (
        <div className="px-3 py-1 rounded-full bg-gray-800 text-xs text-gray-400 font-mono">
          {badge}
        </div>
      )}
    </div>
  );
}

/**
 * MetricCard - 统一的指标卡片
 */
export function MetricCard({ label, value, unit, trend, color = 'text-white' }) {
  return (
    <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
      <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">{label}</div>
      <div className="flex items-end gap-1">
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        {unit && <div className="text-sm text-gray-400 mb-0.5">{unit}</div>}
      </div>
      {trend !== undefined && (
        <div className={`text-xs mt-1 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(2)}%
        </div>
      )}
    </div>
  );
}

/**
 * StatusBadge - 状态徽章组件
 */
export function StatusBadge({ status, size = 'md' }) {
  const statusConfig = {
    ACTIVE: { color: 'bg-green-500', text: 'Active', pulse: true },
    PENDING: { color: 'bg-yellow-500', text: 'Pending', pulse: true },
    COMPLETED: { color: 'bg-blue-500', text: 'Completed', pulse: false },
    FAILED: { color: 'bg-red-500', text: 'Failed', pulse: false },
  };

  const config = statusConfig[status] || statusConfig.ACTIVE;
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full ${config.color}`} />
        {config.pulse && (
          <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full ${config.color} opacity-75 animate-ping`} />
        )}
      </div>
      <span className="text-xs text-gray-400">{config.text}</span>
    </div>
  );
}
