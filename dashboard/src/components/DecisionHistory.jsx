import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Filter,
  BarChart3,
  DollarSign,
  Zap
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function DecisionHistory() {
  const [historyData, setHistoryData] = useState(null);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetch('/decision-history.json')
      .then(res => res.json())
      .then(data => setHistoryData(data))
      .catch(err => console.error('Failed to load decision history:', err));
  }, []);

  if (!historyData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-16 h-16 border-4 border-iridyne-green border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading decision history...</p>
        </div>
      </div>
    );
  }

  const { stats, decisions } = historyData;

  // 过滤决策
  const filteredDecisions = decisions.filter(d => {
    if (filterAction !== 'ALL' && d.action !== filterAction) return false;
    if (filterStatus !== 'ALL' && d.outcome.status !== filterStatus) return false;
    return true;
  });

  // 准备图表数据
  const actionDistribution = [
    { name: 'BUY', value: stats.decisions_by_action.BUY, color: '#10b981' },
    { name: 'SELL', value: stats.decisions_by_action.SELL, color: '#ef4444' },
    { name: 'HOLD', value: stats.decisions_by_action.HOLD, color: '#f59e0b' }
  ];

  // 按天统计 PnL
  const pnlByDay = decisions.reduce((acc, d) => {
    const date = new Date(d.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!acc[date]) {
      acc[date] = { date, pnl: 0, count: 0 };
    }
    acc[date].pnl += d.outcome.pnl;
    acc[date].count += 1;
    return acc;
  }, {});

  const pnlTrend = Object.values(pnlByDay).sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Clock className="w-8 h-8 text-iridyne-green" />
            Decision History
          </h1>
          <p className="text-gray-400">
            Past 7 days • {stats.total_decisions} decisions • {stats.success_rate}% success rate
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<BarChart3 className="w-5 h-5" />}
            label="Total Decisions"
            value={stats.total_decisions}
            color="text-blue-400"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            label="Success Rate"
            value={`${stats.success_rate}%`}
            color="text-green-400"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Total P&L"
            value={`$${stats.total_pnl.toLocaleString()}`}
            color={stats.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'}
          />
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Avg Confidence"
            value={`${(stats.avg_confidence * 100).toFixed(0)}%`}
            color="text-purple-400"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Action Distribution */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4">Decision Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={actionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {actionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* P&L Trend */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4">P&L Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pnlTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="pnl" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter:</span>
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-iridyne-green"
          >
            <option value="ALL">All Actions</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
            <option value="HOLD">HOLD</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-iridyne-green"
          >
            <option value="ALL">All Status</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
          </select>

          <div className="ml-auto text-sm text-gray-400">
            Showing {filteredDecisions.length} of {decisions.length} decisions
          </div>
        </div>

        {/* Decision Timeline */}
        <div className="space-y-4">
          {filteredDecisions.map((decision, index) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              isSelected={selectedDecision?.id === decision.id}
              onClick={() => setSelectedDecision(selectedDecision?.id === decision.id ? null : decision)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
      <div className="flex items-center gap-3">
        <div className={`${color}`}>{icon}</div>
        <div>
          <div className="text-sm text-gray-400">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function DecisionCard({ decision, isSelected, onClick }) {
  const actionConfig = {
    BUY: { icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
    SELL: { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
    HOLD: { icon: Minus, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' }
  };

  const config = actionConfig[decision.action];
  const ActionIcon = config.icon;
  const isSuccess = decision.outcome.status === 'SUCCESS';
  const isProfitable = decision.outcome.pnl > 0;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border ${config.border} overflow-hidden cursor-pointer hover:bg-gray-800/70 transition-colors`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          {/* Left: Action & Time */}
          <div className="flex items-center gap-3">
            <div className={`${config.bg} ${config.color} p-2 rounded-lg border ${config.border}`}>
              <ActionIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{decision.action}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
                  {(decision.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3" />
                {formatTime(decision.timestamp)}
                <span className="text-gray-600">•</span>
                <span className="font-mono text-xs">{decision.event_type.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>

          {/* Right: Outcome */}
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              {isSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-semibold ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                {decision.outcome.status}
              </span>
            </div>
            <div className={`text-lg font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
              {isProfitable ? '+' : ''}{decision.outcome.pnl.toFixed(2)} USD
            </div>
            <div className="text-xs text-gray-500">
              {decision.outcome.execution_time_ms}ms
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-3">
          {decision.safety_gate_triggered && (
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Safety Gate
            </span>
          )}
          {decision.human_decision === 'approved' && (
            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              Approved
            </span>
          )}
          {decision.human_decision === 'rejected' && (
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
              <ThumbsDown className="w-3 h-3" />
              Rejected
            </span>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-700/50"
          >
            <div className="p-4 space-y-4">
              {/* Reasoning */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Reasoning</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{decision.reasoning}</p>
              </div>

              {/* Attention Weights */}
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Attention Weights</h4>
                <div className="space-y-2">
                  {Object.entries(decision.attention_weights).map(([source, weight]) => (
                    <div key={source} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-24 capitalize">{source}</span>
                      <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${weight * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="h-full bg-gradient-to-r from-iridyne-green to-green-400"
                        />
                      </div>
                      <span className="text-xs font-mono text-gray-300 w-12 text-right">
                        {(weight * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
