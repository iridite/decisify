import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  XCircle,
  Info,
  CheckCircle2,
  Clock,
  Filter,
  TrendingDown,
  Activity,
  Shield,
  Zap
} from 'lucide-react';
import { LineChartLW, PieChartLW } from './LightweightChart';
import { createLogger } from '../utils/logger';

const logger = createLogger('ErrorLogs');

export function ErrorLogs() {
  const [logsData, setLogsData] = useState(null);
  const [selectedError, setSelectedError] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterResolved, setFilterResolved] = useState('ALL');

  useEffect(() => {
    fetch('/error-logs.json')
      .then(res => res.json())
      .then(data => setLogsData(data))
      .catch(err => logger.error('Failed to load error logs:', err));
  }, []);

  if (!logsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-16 h-16 border-4 border-iridyne-green border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading error logs...</p>
        </div>
      </div>
    );
  }

  const { stats, errors } = logsData;

  // 过滤错误
  const filteredErrors = useMemo(() => {
    return errors.filter(e => {
      if (filterSeverity !== 'ALL' && e.severity !== filterSeverity) return false;
      if (filterResolved === 'RESOLVED' && !e.resolved) return false;
      if (filterResolved === 'UNRESOLVED' && e.resolved) return false;
      return true;
    });
  }, [errors, filterSeverity, filterResolved]);

  // 准备图表数据
  const severityData = useMemo(() => [
    { name: 'ERROR', value: stats.errors_by_severity.ERROR, color: '#ef4444' },
    { name: 'WARNING', value: stats.errors_by_severity.WARNING, color: '#f59e0b' },
    { name: 'INFO', value: stats.errors_by_severity.INFO, color: '#3b82f6' }
  ], [stats.errors_by_severity]);

  const typeData = useMemo(() => {
    return Object.entries(stats.errors_by_type).map(([type, count]) => ({
      type: type.replace(/_/g, ' '),
      count
    }));
  }, [stats.errors_by_type]);

  // 按小时统计错误
  const hourlyTrend = useMemo(() => {
    const errorsByHour = errors.reduce((acc, e) => {
      const hour = new Date(e.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      errors: errorsByHour[i] || 0
    }));
  }, [errors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
            Error Logs & System Health
          </h1>
          <p className="text-gray-400">
            Past 24 hours • {stats.total_errors} errors • {stats.resolution_rate}% resolved
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Activity className="w-5 h-5" />}
            label="Total Errors"
            value={stats.total_errors}
            color="text-red-400"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5" />}
            label="Resolved"
            value={`${stats.resolved_errors} (${stats.resolution_rate}%)`}
            color="text-green-400"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="Avg Resolution Time"
            value={`${stats.avg_resolution_time_minutes}m`}
            color="text-blue-400"
          />
          <StatCard
            icon={<Shield className="w-5 h-5" />}
            label="System Uptime"
            value="99.2%"
            color="text-purple-400"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Severity Distribution */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4">Errors by Severity</h3>
            <PieChartLW data={severityData} height={200} />
          </div>

          {/* Error Types - 使用简单的条形图展示 */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold mb-4">Errors by Type</h3>
            <div className="space-y-3">
              {typeData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-32 truncate">{item.type}</span>
                  <div className="flex-1 h-6 bg-gray-700/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / Math.max(...typeData.map(t => t.count))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono text-white w-8 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hourly Trend */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
          <h3 className="text-lg font-semibold mb-4">Error Frequency (24h)</h3>
          <LineChartLW
            data={hourlyTrend}
            height={150}
            lines={[{ dataKey: 'errors', color: '#ef4444', name: 'Errors' }]}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter:</span>
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-iridyne-green"
          >
            <option value="ALL">All Severities</option>
            <option value="ERROR">Error</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>

          <select
            value={filterResolved}
            onChange={(e) => setFilterResolved(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-iridyne-green"
          >
            <option value="ALL">All Status</option>
            <option value="RESOLVED">Resolved</option>
            <option value="UNRESOLVED">Unresolved</option>
          </select>

          <div className="ml-auto text-sm text-gray-400">
            Showing {filteredErrors.length} of {errors.length} errors
          </div>
        </div>

        {/* Error List */}
        <div className="space-y-3">
          {filteredErrors.map((error) => (
            <ErrorCard
              key={error.id}
              error={error}
              isSelected={selectedError?.id === error.id}
              onClick={() => setSelectedError(selectedError?.id === error.id ? null : error)}
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
          <div className="text-xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}

function ErrorCard({ error, isSelected, onClick }) {
  const severityConfig = {
    ERROR: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' },
    WARNING: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
    INFO: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' }
  };

  const config = severityConfig[error.severity];
  const SeverityIcon = config.icon;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins}m ago`;
    return `${diffHours}h ago`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border ${config.border} overflow-hidden cursor-pointer hover:bg-gray-800/70 transition-colors`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          {/* Left: Severity & Message */}
          <div className="flex items-start gap-3 flex-1">
            <div className={`${config.bg} ${config.color} p-2 rounded-lg border ${config.border} mt-0.5`}>
              <SeverityIcon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
                  {error.severity}
                </span>
                <span className="text-xs text-gray-500 font-mono">{error.type.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-sm text-gray-300 mb-2">{error.message}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(error.timestamp)}
                </span>
                <span>•</span>
                <span className="font-mono">{error.source}</span>
              </div>
            </div>
          </div>

          {/* Right: Status */}
          <div className="text-right ml-4">
            {error.resolved ? (
              <div className="flex items-center gap-1.5 text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-semibold">Resolved</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-yellow-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">Active</span>
              </div>
            )}
          </div>
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
            <div className="p-4 space-y-3 bg-gray-900/30">
              {/* Impact */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 mb-1">Impact</h4>
                <p className="text-sm text-gray-300">{error.impact}</p>
              </div>

              {/* Resolution */}
              {error.resolved && error.resolution && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 mb-1">Resolution</h4>
                  <p className="text-sm text-green-400">{error.resolution}</p>
                </div>
              )}

              {/* Timestamp */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 mb-1">Timestamp</h4>
                <p className="text-xs font-mono text-gray-500">{error.timestamp}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
