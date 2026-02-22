import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Brain,
  Target,
  Zap,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Radio,
  Gauge,
  DollarSign,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDataPolling } from "./hooks/useDataPolling";
import { useDemoMode } from "./hooks/useDemoMode";
import { useLiveDataSimulation } from "./hooks/useLiveDataSimulation";
import { DemoControls, DemoModeToggle, DemoModeBanner } from "./components/DemoControls";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { RustPerformanceComparison } from "./components/RustPerformanceComparison";
import { AttentionWeightsCard, QuickStatsCard } from "./components/DashboardEnhancements";
import DataSourceBadge from "./components/DataSourceBadge";

function App() {
  const {
    data: rawData,
    newThoughts,
    isLoading,
    error,
    submitFeedback,
    handleProposal,
  } = useDataPolling();
  const [agentThinking, setAgentThinking] = useState(false);
  const [demoThoughts, setDemoThoughts] = useState([]);
  const [historyStats, setHistoryStats] = useState(null);

  // Load decision history stats
  useEffect(() => {
    fetch('/decision-history.json')
      .then(res => res.json())
      .then(data => setHistoryStats(data.stats))
      .catch(err => console.error('Failed to load history stats:', err));
  }, []);

  // Demo Mode hook
  const {
    isDemoMode,
    isAutoPlay,
    isFullscreen,
    demoSpeed,
    setIsDemoMode,
    setIsAutoPlay,
    toggleFullscreen,
    generateDemoThought,
  } = useDemoMode();

  // Live data simulation - only active in demo mode
  const simulatedData = useLiveDataSimulation(rawData, isDemoMode, demoSpeed);

  // Use simulated data in demo mode, otherwise use raw data
  const data = isDemoMode ? simulatedData : rawData;

  // Simulate "agent is thinking" state when new data arrives
  useEffect(() => {
    if (newThoughts.length > 0) {
      setAgentThinking(true);
      setTimeout(() => setAgentThinking(false), 3000);
    }
  }, [newThoughts]);

  // Demo Mode auto-play: generate fake thoughts periodically
  useEffect(() => {
    if (!isDemoMode || !isAutoPlay) return;

    const baseInterval = 4000; // 4 seconds base
    const interval = baseInterval / demoSpeed;

    const timer = setInterval(() => {
      const newThought = generateDemoThought();
      setDemoThoughts((prev) => [newThought, ...prev].slice(0, 20)); // Keep last 20
      setAgentThinking(true);
      setTimeout(() => setAgentThinking(false), 2000);
    }, interval);

    return () => clearInterval(timer);
  }, [isDemoMode, isAutoPlay, demoSpeed, generateDemoThought]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-16 h-16 border-4 border-iridyne-green border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-text-secondary">
            Initializing Agent Intelligence...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bento-item max-w-md">
          <AlertCircle className="w-12 h-12 text-volatility-orange mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-center">
            Connection Error
          </h2>
          <p className="text-text-secondary text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Use demo thoughts in demo mode, otherwise use real thoughts
  const displayThoughts = isDemoMode ? demoThoughts : newThoughts;
  const allThoughts = isDemoMode ? demoThoughts : data.agent_thoughts;

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Demo Mode Banner - 顶部横幅 */}
      <AnimatePresence>
        {isDemoMode && (
          <DemoModeBanner onExit={() => setIsDemoMode(false)} />
        )}
      </AnimatePresence>

      {/* Demo Mode Toggle - Fixed bottom-right */}
      <DemoModeToggle
        isDemoMode={isDemoMode}
        onToggle={() => setIsDemoMode(!isDemoMode)}
      />

      {/* Demo Controls - Show when in demo mode */}
      <DemoControls
        isDemoMode={isDemoMode}
        isAutoPlay={isAutoPlay}
        isFullscreen={isFullscreen}
        demoSpeed={demoSpeed}
        onToggleDemo={() => setIsDemoMode(!isDemoMode)}
        onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
        onToggleFullscreen={toggleFullscreen}
        onSpeedChange={(speed) => setDemoSpeed(speed)}
      />

      {/* Header */}
      <Header data={data} agentThinking={agentThinking} />

      {/* Performance Metrics - 性能指标卡片 */}
      <div className="mt-6">
        <PerformanceMetrics data={data} />
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-12 gap-4 mt-6">
        {/* Agent Thought Log - Main Center */}
        <div className="col-span-12 lg:col-span-7">
          <AgentThoughtLog
            thoughts={allThoughts}
            newThoughts={displayThoughts}
            onFeedback={submitFeedback}
            agentThinking={agentThinking}
          />
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          {/* Attention Weights */}
          {data.agent_thoughts?.[0]?.inputs?.weights && (
            <AttentionWeightsCard weights={data.agent_thoughts[0].inputs.weights} />
          )}

          {/* Quick Stats */}
          {historyStats && (
            <QuickStatsCard stats={historyStats} />
          )}

          {/* Triangulation Matrix */}
          <TriangulationMatrix matrix={data.triangulation_matrix} />

          {/* X Intelligence Feed */}
          <XIntelligenceFeed
            signals={data.perception.x_intelligence}
            dataSource={data.data_sources?.x_intelligence}
          />
        </div>

        {/* Bottom Row */}
        <div className="col-span-12 lg:col-span-7">
          <PolymarketTracker
            polymarket={data.perception.polymarket}
            dataSource={data.data_sources?.polymarket}
          />
        </div>

        {/* Rust Performance Comparison - 性能对比 */}
        <div className="col-span-12">
          <RustPerformanceComparison data={data} />
        </div>

        {/* Decision Distribution */}
        {historyStats && (
          <div className="col-span-12 lg:col-span-7">
            <DecisionDistributionCard stats={historyStats} />
          </div>
        )}

        <div className="col-span-12 lg:col-span-5 space-y-4">
          {/* Strategy Proposal */}
          <StrategyProposal
            proposal={data.execution.current_proposal}
            onDecision={handleProposal}
          />

          {/* Nautilus Snapshot */}
          <NautilusSnapshot
            nautilus={data.perception.nautilus}
            dataSource={data.data_sources?.nautilus}
          />
        </div>

        {/* Context Memory Tracker */}
        <div className="col-span-12">
          <ContextMemory events={data.context_memory.events} />
        </div>
      </div>
    </div>
  );
}

// Header Component
function Header({ data, agentThinking }) {
  const timeSinceSync = Math.floor(
    (new Date() - new Date(data.meta.sync_timestamp)) / 1000,
  );

  return (
    <header className="bento-item">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Brand with Logo */}
        <div className="flex items-center gap-4">
          <img
            src="/logo.svg"
            alt="Decisify Logo"
            className="w-12 h-12 opacity-90"
          />
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-text-secondary">Iridyne /</span>{" "}
              <span className="gradient-text">Decisify</span>
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Agent Intelligence Monitor
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-6">
          {/* System Live */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <motion.div
                className="w-3 h-3 rounded-full bg-iridyne-green"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-iridyne-green opacity-75 animate-ping" />
            </div>
            <span className="text-sm font-mono status-live">SYSTEM LIVE</span>
          </div>

          {/* Agent Status */}
          <div className="flex items-center gap-2">
            <Brain
              className={`w-4 h-4 ${agentThinking ? "text-volatility-orange animate-pulse" : "text-iridyne-green"}`}
            />
            <span className="text-sm font-mono">
              {agentThinking ? "REASONING" : data.meta.agent_status}
            </span>
          </div>

          {/* Sync Status */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">
              Sync: {timeSinceSync}s ago
            </span>
          </div>

          {/* Context Window */}
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">
              {data.meta.total_events_tracked} events |{" "}
              {data.meta.context_window_hours}h window
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

// Agent Thought Log Component
function AgentThoughtLog({ thoughts, newThoughts, onFeedback, agentThinking }) {
  return (
    <div className="bento-item h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Brain className="w-5 h-5 text-iridyne-green" />
          Agent Reasoning Trace
        </h2>
        {agentThinking && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm text-volatility-orange"
          >
            <Zap className="w-4 h-4 animate-pulse" />
            Agent is thinking...
          </motion.div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        <AnimatePresence>
          {thoughts.map((thought) => (
            <ThoughtCard
              key={thought.id}
              thought={thought}
              onFeedback={onFeedback}
              isNew={newThoughts.some((t) => t.id === thought.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ThoughtCard({ thought, onFeedback, isNew }) {
  const [expanded, setExpanded] = useState(false);

  const typeColors = {
    TRIANGULATION: "text-iridyne-green",
    SENTIMENT_ANALYSIS: "text-blue-400",
    RISK_ASSESSMENT: "text-volatility-orange",
  };

  const confidenceColor =
    thought.confidence > 0.7
      ? "bg-iridyne-green"
      : thought.confidence > 0.5
        ? "bg-yellow-500"
        : "bg-volatility-orange";

  return (
    <motion.div
      initial={isNew ? { y: -20, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-panel p-4 rounded-lg border border-border-subtle/30 hover:border-border-subtle transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-mono ${typeColors[thought.type]}`}>
              {thought.type}
            </span>
            <span className="text-xs text-text-secondary">
              {new Date(thought.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm leading-relaxed">{thought.reasoning}</p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mt-3 mb-2">
        <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
          <span>Confidence</span>
          <span className="mono-number">
            {(thought.confidence * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-1 bg-border-subtle rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${thought.confidence * 100}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`h-full ${confidenceColor}`}
          />
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-border-subtle/30"
          >
            <div className="text-xs space-y-2">
              <div>
                <span className="text-text-secondary">Input Sources:</span>
                <pre className="mt-1 p-2 bg-midnight-onyx rounded text-iridyne-green font-mono">
                  {JSON.stringify(thought.inputs, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Buttons */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFeedback(thought.id, "positive");
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
            thought.human_feedback === "positive"
              ? "bg-iridyne-green/20 text-iridyne-green"
              : "bg-border-subtle/30 text-text-secondary hover:bg-border-subtle"
          }`}
        >
          <ThumbsUp className="w-3 h-3" />
          Correct
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFeedback(thought.id, "negative");
          }}
          className={`flex items-center gap-1 px-3 py-1 rounded text-xs transition-colors ${
            thought.human_feedback === "negative"
              ? "bg-volatility-orange/20 text-volatility-orange"
              : "bg-border-subtle/30 text-text-secondary hover:bg-border-subtle"
          }`}
        >
          <ThumbsDown className="w-3 h-3" />
          Incorrect
        </button>
      </div>
    </motion.div>
  );
}

// Triangulation Matrix Component
function TriangulationMatrix({ matrix }) {
  const sources = ["Polymarket", "X Sentiment", "Nautilus"];
  const correlations = [
    [
      1.0,
      matrix.polymarket_x_correlation,
      matrix.polymarket_nautilus_correlation,
    ],
    [matrix.polymarket_x_correlation, 1.0, matrix.x_nautilus_correlation],
    [
      matrix.polymarket_nautilus_correlation,
      matrix.x_nautilus_correlation,
      1.0,
    ],
  ];

  return (
    <div className="bento-item">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-iridyne-green" />
        Triangulation Matrix
      </h2>

      <div className="grid grid-cols-4 gap-2 text-xs">
        <div></div>
        {sources.map((source) => (
          <div
            key={source}
            className="text-center text-text-secondary font-mono"
          >
            {source.split(" ")[0]}
          </div>
        ))}

        {sources.map((source, i) => (
          <React.Fragment key={source}>
            <div className="text-text-secondary font-mono">
              {source.split(" ")[0]}
            </div>
            {correlations[i].map((corr, j) => (
              <div
                key={j}
                className="p-2 rounded text-center font-mono font-bold"
                style={{
                  backgroundColor: `rgba(0, 255, 194, ${corr * 0.3})`,
                  color: corr > 0.7 ? "#00ffc2" : "#fafafa",
                }}
              >
                {i === j ? "—" : (corr * 100).toFixed(0) + "%"}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-4 p-3 bg-border-subtle/20 rounded">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Overall Alignment</span>
          <span className="text-lg font-mono font-bold text-iridyne-green">
            {(matrix.overall_alignment * 100).toFixed(0)}%
          </span>
        </div>
        <div className="mt-2 text-xs text-text-secondary">
          {matrix.interpretation}
        </div>
      </div>
    </div>
  );
}

// X Intelligence Feed Component
function XIntelligenceFeed({ signals, dataSource }) {
  return (
    <div className="bento-item h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Radio className="w-5 h-5 text-iridyne-green" />X Intelligence Feed
        </h2>
        {dataSource && (
          <DataSourceBadge
            type={dataSource.type}
            source={dataSource.source}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
        <AnimatePresence>
          {signals.map((signal, index) => (
            <motion.div
              key={signal.id}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-3 rounded border border-border-subtle/30"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-iridyne-green">
                    {signal.handle}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      signal.sentiment === "BULLISH"
                        ? "bg-iridyne-green/20 text-iridyne-green"
                        : signal.sentiment === "BEARISH"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-border-subtle/20 text-text-secondary"
                    }`}
                  >
                    {signal.sentiment}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary">
                    Impact: {signal.impact_score.toFixed(1)}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: `rgba(0, 255, 194, ${signal.agent_relevance_score})`,
                    }}
                  />
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {signal.content}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-text-secondary">
                <Clock className="w-3 h-3" />
                {new Date(signal.timestamp).toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Polymarket Tracker Component
function PolymarketTracker({ polymarket, dataSource }) {
  const chartData = polymarket.history.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    odds: point.odds * 100,
  }));

  return (
    <div className="bento-item">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-iridyne-green" />
              Polymarket Odds Tracker
            </h2>
            <p className="text-sm text-text-secondary mt-1">{polymarket.event}</p>
          </div>
          {dataSource && (
            <DataSourceBadge
              type={dataSource.type}
              source={dataSource.source}
            />
          )}
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-iridyne-green">
            {(polymarket.current_odds * 100).toFixed(1)}%
          </div>
          <div
            className={`text-sm font-mono flex items-center gap-1 ${
              polymarket.delta_1h > 0 ? "text-iridyne-green" : "text-red-400"
            }`}
          >
            {polymarket.delta_1h > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {polymarket.delta_1h > 0 ? "+" : ""}
            {(polymarket.delta_1h * 100).toFixed(1)}% (1h)
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="oddsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ffc2" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00ffc2" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="time"
            stroke="#a1a1aa"
            style={{ fontSize: "12px", fontFamily: "monospace" }}
          />
          <YAxis
            stroke="#a1a1aa"
            style={{ fontSize: "12px", fontFamily: "monospace" }}
            domain={[60, 70]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#09090b",
              border: "1px solid #27272a",
              borderRadius: "8px",
            }}
          />
          <Area
            type="monotone"
            dataKey="odds"
            stroke="#00ffc2"
            strokeWidth={2}
            fill="url(#oddsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
        <div>
          <div className="text-text-secondary">24h Volume</div>
          <div className="font-mono font-bold">
            ${(polymarket.volume_24h / 1000000).toFixed(2)}M
          </div>
        </div>
        <div>
          <div className="text-text-secondary">Liquidity</div>
          <div className="font-mono font-bold">
            ${(polymarket.liquidity / 1000000).toFixed(2)}M
          </div>
        </div>
        <div>
          <div className="text-text-secondary">Last Trade</div>
          <div className="font-mono text-xs">
            {new Date(polymarket.last_trade).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Strategy Proposal Component
function StrategyProposal({ proposal, onDecision }) {
  if (!proposal) return null;

  const riskColors = {
    LOW: "text-iridyne-green",
    MEDIUM: "text-yellow-500",
    HIGH: "text-volatility-orange",
  };

  const isPending = proposal.status === "ACTIVE" && !proposal.human_decision;

  return (
    <div className="bento-item">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-iridyne-green" />
        Strategy Proposal
      </h2>

      <div className="space-y-3">
        <div>
          <div className="text-sm text-text-secondary mb-1">
            Recommended Action
          </div>
          <div className="text-2xl font-mono font-bold text-iridyne-green">
            {proposal.action}
          </div>
          <div className="text-sm text-text-secondary">{proposal.asset}</div>
        </div>

        <div>
          <div className="text-sm text-text-secondary mb-1">Reasoning</div>
          <p className="text-sm leading-relaxed">{proposal.reasoning}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-secondary">Risk Level</div>
            <div
              className={`font-mono font-bold ${riskColors[proposal.risk_level]}`}
            >
              {proposal.risk_level}
            </div>
          </div>
          <div>
            <div className="text-sm text-text-secondary">Confidence</div>
            <div className="font-mono font-bold text-iridyne-green">
              {(proposal.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {isPending && (
          <div className="flex gap-2 pt-3 border-t border-border-subtle/30">
            <button
              onClick={() => onDecision(proposal.id, "approved")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-iridyne-green/20 hover:bg-iridyne-green/30 text-iridyne-green rounded transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Execute
            </button>
            <button
              onClick={() => onDecision(proposal.id, "rejected")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        )}

        {proposal.human_decision && (
          <div
            className={`p-3 rounded ${
              proposal.human_decision === "approved"
                ? "bg-iridyne-green/20 text-iridyne-green"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            <div className="text-sm font-mono">
              {proposal.human_decision === "approved"
                ? "✓ Approved by Human"
                : "✗ Rejected by Human"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Nautilus Snapshot Component
function NautilusSnapshot({ nautilus, dataSource }) {
  const pnlPositive = nautilus.daily_pnl > 0;

  return (
    <div className="bento-item">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Nautilus Quant Snapshot</h2>
        {dataSource && (
          <DataSourceBadge
            type={dataSource.type}
            source={dataSource.source}
          />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-sm text-text-secondary">Strategy</div>
          <div className="font-mono">{nautilus.strategy}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-text-secondary">Position</div>
            <div className="font-mono font-bold text-iridyne-green">
              {nautilus.position}
            </div>
          </div>
          <div>
            <div className="text-sm text-text-secondary">Signal Strength</div>
            <div className="font-mono font-bold">
              {(nautilus.signal_strength * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm text-text-secondary">Daily P&L</div>
          <div
            className={`text-2xl font-mono font-bold ${pnlPositive ? "text-iridyne-green" : "text-red-400"}`}
          >
            {pnlPositive ? "+" : ""}
            {nautilus.daily_pnl.toFixed(2)} USDT
          </div>
        </div>

        <div className="pt-3 border-t border-border-subtle/30">
          <div className="text-sm text-text-secondary mb-2">
            Technical Indicators
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>Upper: {nautilus.indicators.keltner_upper.toFixed(2)}</div>
            <div>ATR: {nautilus.indicators.atr.toFixed(2)}</div>
            <div>Middle: {nautilus.indicators.keltner_middle.toFixed(2)}</div>
            <div>Trend: {nautilus.indicators.trend}</div>
          </div>
        </div>

        <div
          className={`p-2 rounded text-center text-sm font-mono ${
            nautilus.status === "ACTIVE"
              ? "bg-iridyne-green/20 text-iridyne-green"
              : "bg-yellow-500/20 text-yellow-500"
          }`}
        >
          {nautilus.status}
        </div>
      </div>
    </div>
  );
}

// Context Memory Component
function ContextMemory({ events }) {
  // Format event type for display
  const formatEventType = (type) => {
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="bento-item">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-iridyne-green" />
        Context Memory Tracker
      </h2>

      <div className="flex items-center gap-2 mb-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: event.relevance_decay, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="w-3 h-3 rounded-full bg-iridyne-green"
            style={{ opacity: event.relevance_decay }}
            title={event.description}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        {events.slice(0, 4).map((event) => (
          <div
            key={event.id}
            className="p-3 rounded bg-border-subtle/20"
            style={{ opacity: event.relevance_decay }}
          >
            <div className="text-xs text-text-secondary mb-1">{formatEventType(event.type)}</div>
            <div className="text-xs leading-tight">{event.description}</div>
            <div className="text-xs text-text-secondary mt-1">
              {new Date(event.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bento-item max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-volatility-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-text-secondary mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-iridyne-green/20 hover:bg-iridyne-green/30 text-iridyne-green rounded transition-colors"
            >
              Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the main App export with ErrorBoundary
const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;
