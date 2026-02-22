import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Target, Zap } from 'lucide-react';

export function AttentionWeightsCard({ weights }) {
  if (!weights) return null;

  const sources = [
    { key: 'polymarket', label: 'Polymarket', color: 'from-blue-500 to-blue-400' },
    { key: 'x_sentiment', label: 'X Sentiment', color: 'from-purple-500 to-purple-400' },
    { key: 'nautilus', label: 'Nautilus', color: 'from-green-500 to-green-400' }
  ];

  return (
    <div className="bento-item">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Brain className="w-5 h-5 text-iridyne-green" />
          Attention Weights
        </h2>
        <span className="text-xs text-gray-500 font-mono">实时权重分配</span>
      </div>

      <div className="space-y-3">
        {sources.map((source, index) => {
          const weight = weights[source.key] || 0;
          return (
            <div key={source.key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-400">{source.label}</span>
                <span className="text-sm font-mono font-bold text-white">
                  {(weight * 100).toFixed(0)}%
                </span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${weight * 100}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${source.color} rounded-full`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          权重总和: <span className="text-iridyne-green font-mono">
            {(Object.values(weights).reduce((sum, w) => sum + w, 0) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function QuickStatsCard({ stats }) {
  if (!stats) return null;

  const metrics = [
    {
      icon: Target,
      label: '总决策数',
      value: stats.total_decisions || 0,
      color: 'text-blue-400'
    },
    {
      icon: TrendingUp,
      label: '成功率',
      value: `${stats.success_rate || 0}%`,
      color: 'text-green-400'
    },
    {
      icon: Zap,
      label: '平均置信度',
      value: `${((stats.avg_confidence || 0) * 100).toFixed(0)}%`,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="bento-item">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Performance Stats</h2>
        <span className="text-xs text-gray-500 font-mono">过去 7 天</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
            >
              <Icon className={`w-4 h-4 ${metric.color} mb-2`} />
              <div className="text-xl font-bold mb-1">{metric.value}</div>
              <div className="text-xs text-gray-500">{metric.label}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
