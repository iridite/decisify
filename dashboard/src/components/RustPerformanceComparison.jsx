import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Code2, TrendingUp, Info } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

/**
 * RustPerformanceComparison - Rust vs Python 性能对比组件
 * 展示混合架构的性能优势
 */
export function RustPerformanceComparison({ data }) {
  const [showDetails, setShowDetails] = useState(false);

  // 模拟性能数据（实际项目中应从 API 获取）
  const performanceData = [
    {
      scenario: "单次决策",
      python: 0.85,
      rust: 0.62,
      improvement: "1.37x"
    },
    {
      scenario: "批处理 (100)",
      python: 82.5,
      rust: 58.3,
      improvement: "1.42x"
    },
    {
      scenario: "批处理 (1000)",
      python: 825.0,
      rust: 612.5,
      improvement: "1.35x"
    },
    {
      scenario: "高频场景",
      python: 1.2,
      rust: 0.88,
      improvement: "1.36x"
    }
  ];

  const chartData = performanceData.map(item => ({
    name: item.scenario,
    Python: item.python,
    Rust: item.rust,
  }));

  // 计算平均加速比
  const avgSpeedup = performanceData.reduce((acc, item) => {
    return acc + parseFloat(item.improvement);
  }, 0) / performanceData.length;

  return (
    <div className="bento-item p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-iridyne-green/10">
            <Zap className="w-6 h-6 text-iridyne-green" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">
              性能加速对比
            </h3>
            <p className="text-sm text-text-secondary">
              Python vs Rust 混合架构
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 rounded-lg bg-surface-secondary hover:bg-surface-tertiary transition-colors"
        >
          <Info className="w-5 h-5 text-text-secondary" />
        </motion.button>
      </div>

      {/* 平均加速比卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-iridyne-green/10 to-signal-bullish/10 rounded-lg p-4 mb-6 border border-iridyne-green/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-secondary mb-1">平均性能提升</div>
            <div className="text-3xl font-bold text-iridyne-green">
              {avgSpeedup.toFixed(2)}x
            </div>
          </div>
          <TrendingUp className="w-12 h-12 text-iridyne-green opacity-50" />
        </div>
      </motion.div>

      {/* 性能对比图表 */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis
              dataKey="name"
              stroke="#888"
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis
              stroke="#888"
              tick={{ fill: '#888', fontSize: 12 }}
              label={{ value: '延迟 (ms)', angle: -90, position: 'insideLeft', fill: '#888' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend
              wrapperStyle={{ color: '#888' }}
            />
            <Bar dataKey="Python" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Rust" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 详细数据表格 */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="bg-surface-secondary rounded-lg p-4">
            <h4 className="text-sm font-semibold text-text-primary mb-3">
              详细性能数据
            </h4>
            <div className="space-y-2">
              {performanceData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-surface-tertiary last:border-0"
                >
                  <span className="text-sm text-text-secondary">
                    {item.scenario}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-volatility-orange">
                      {item.python}ms
                    </span>
                    <span className="text-sm text-text-secondary">→</span>
                    <span className="text-sm text-signal-bullish">
                      {item.rust}ms
                    </span>
                    <span className="text-sm font-semibold text-iridyne-green">
                      {item.improvement}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 技术说明 */}
          <div className="mt-4 p-4 bg-surface-secondary rounded-lg border border-iridyne-green/20">
            <div className="flex items-start gap-3">
              <Code2 className="w-5 h-5 text-iridyne-green mt-0.5" />
              <div className="text-sm text-text-secondary">
                <p className="mb-2">
                  <strong className="text-text-primary">混合架构优势：</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Python 提供灵活的开发体验和快速原型</li>
                  <li>Rust 通过 PyO3 加速核心融合算法</li>
                  <li>自动回退机制，Rust 扩展可选</li>
                  <li>批处理场景性能提升最显著 (1.2-1.4x)</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 实现状态标签 */}
      <div className="flex items-center gap-2 mt-4">
        <span className="px-3 py-1 rounded-full bg-signal-bullish/10 text-signal-bullish text-xs font-medium">
          ✓ Rust 扩展已实现
        </span>
        <span className="px-3 py-1 rounded-full bg-iridyne-green/10 text-iridyne-green text-xs font-medium">
          PyO3 + Maturin
        </span>
      </div>
    </div>
  );
}
