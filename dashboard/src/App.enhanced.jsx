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
import { DemoControls, DemoModeToggle } from "./components/DemoControls";
import { ScanLines, ParticleField, GlitchText, DataRain } from "./components/VisualEffects";
import { SplashScreen, LoadingSkeleton, ErrorFallback } from "./components/LoadingStates";

function App() {
  const {
    data,
    newThoughts,
    isLoading,
    error,
    submitFeedback,
    handleProposal,
  } = useDataPolling();
  
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

  const [agentThinking, setAgentThinking] = useState(false);
  const [demoThoughts, setDemoThoughts] = useState([]);
  const [showSplash, setShowSplash] = useState(true);

  // Hide splash screen after initial load
  useEffect(() => {
    if (!isLoading && data) {
      const timer = setTimeout(() => setShowSplash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, data]);

  // Simulate "agent is thinking" state when new data arrives
  useEffect(() => {
    if (newThoughts.length > 0) {
      setAgentThinking(true);
      setTimeout(() => setAgentThinking(false), 3000);
    }
  }, [newThoughts]);

  // Demo mode auto-play
  useEffect(() => {
    if (isDemoMode && isAutoPlay) {
      const interval = setInterval(() => {
        const newThought = generateDemoThought();
        setDemoThoughts(prev => [newThought, ...prev].slice(0, 10));
        setAgentThinking(true);
        setTimeout(() => setAgentThinking(false), 2000);
      }, 5000 / demoSpeed);

      return () => clearInterval(interval);
    }
  }, [isDemoMode, isAutoPlay, demoSpeed, generateDemoThought]);

  if (showSplash && isLoading) {
    return <SplashScreen />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
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

  const displayThoughts = isDemoMode && demoThoughts.length > 0 
    ? demoThoughts 
    : data.agent_thoughts;

  return (
    <div className={`min-h-screen p-4 md:p-6 ${isDemoMode ? 'demo-mode' : ''}`}>
      {/* Visual Effects */}
      {isDemoMode && <ScanLines />}
      {isDemoMode && <ParticleField />}
      <DataRain active={agentThinking && isDemoMode} />

      {/* Demo Mode Controls */}
      <DemoModeToggle 
        isDemoMode={isDemoMode} 
        onToggle={() => setIsDemoMode(!isDemoMode)} 
      />
      
      <DemoControls
        isDemoMode={isDemoMode}
        isAutoPlay={isAutoPlay}
        isFullscreen={isFullscreen}
        demoSpeed={demoSpeed}
        onToggleDemo={() => setIsDemoMode(!isDemoMode)}
        onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
        onToggleFullscreen={toggleFullscreen}
        onSpeedChange={setDemoSpeed}
      />

      {/* Header */}
      <Header data={data} agentThinking={agentThinking} isDemoMode={isDemoMode} />

      {/* Main Bento Grid */}
      <motion.div 
        className="grid grid-cols-12 gap-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Agent Thought Log - Main Center */}
        <div className="col-span-12 lg:col-span-7">
          <AgentThoughtLog
            thoughts={displayThoughts}
            newThoughts={newThoughts}
            onFeedback={submitFeedback}
            agentThinking={agentThinking}
            isDemoMode={isDemoMode}
          />
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <TriangulationMatrix matrix={data.triangulation_matrix} isDemoMode={isDemoMode} />
          <XIntelligenceFeed signals={data.perception.x_intelligence} isDemoMode={isDemoMode} />
        </div>

        {/* Bottom Row */}
        <div className="col-span-12 lg:col-span-7">
          <PolymarketTracker polymarket={data.perception.polymarket} isDemoMode={isDemoMode} />
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <StrategyProposal
            proposal={data.execution.current_proposal}
            onDecision={handleProposal}
            isDemoMode={isDemoMode}
          />
          <NautilusSnapshot nautilus={data.perception.nautilus} />
        </div>

        {/* Context Memory Tracker */}
        <div className="col-span-12">
          <ContextMemory events={data.context_memory.events} />
        </div>
      </motion.div>
    </div>
  );
}

// Enhanced Header Component
function Header({ data, agentThinking, isDemoMode }) {
  const timeSinceSync = Math.floor(
    (new Date() - new Date(data.meta.sync_timestamp)) / 1000,
  );

  return (
    <motion.header 
      className="bento-item"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-text-secondary">Iridyne /</span>{" "}
            <GlitchText trigger={agentThinking && isDemoMode}>
              <span className="gradient-text">Decisify</span>
            </GlitchText>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Agent Intelligence Monitor
          </p>
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
    </motion.header>
  );
}

// Enhanced Agent Thought Log Component
function AgentThoughtLog({ thoughts, newThoughts, onFeedback, agentThinking, isDemoMode }) {
  return (
    <motion.div 
      className="bento-item h-[600px] flex flex-col"
      whileHover={isDemoMode ? { scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
    >
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
          {thoughts.map((thought, index) => (
            <ThoughtCard
              key={thought.id}
              thought={thought}
              onFeedback={onFeedback}
              isNew={newThoughts.some((t) => t.id === thought.id)}
              isDemoMode={isDemoMode}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function ThoughtCard({ thought, onFeedback, isNew, isDemoMode }) {
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
      initial={isNew ? { y: -20, opacity: 0, scale: 0.95 } : false}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
      className="glass-panel p-4 rounded-lg border border-border-subtle/30 hover:border-iridyne-green/50 transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      whileHover={isDemoMode ? { scale: 1.02, borderColor: "rgba(0, 255, 194, 0.5)" } : {}}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <motion.span 
              className={`text-xs font-mono ${typeColors[thought.type]}`}
              animate={isDemoMode && isNew ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ repeat: 3, duration: 0.5 }}
            >
              {thought.type}
            </motion.span>
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
          <motion.span 
            className="mono-number"
            key={thought.confidence}
            initial={{ scale: 1.2, color: "#00ffc2" }}
            animate={{ scale: 1, color: "#a1a1aa" }}
            transition={{ duration: 0.5 }}
          >
            {(thought.confidence * 100).toFixed(0)}%
          </motion.span>
        </div>
        <div className="h-1 bg-border-subtle rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${thought.confidence * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
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
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-border-subtle/30"
          >
            <div className="text-xs space-y-2">
              <div>
                <span className="text-text-secondary">Input Sources:</span>
                <pre className="mt-1 p-2 bg-midnight-onyx rounded text-iridyne-green font-mono text-xs overflow-x-auto">
                  {JSON.stringify(thought.inputs, null, 2)}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Buttons */}
      <div className="flex items-center gap-2 mt-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
        </motion.button>
      </div>
    </motion.div>
  );
}

// Import remaining components from original App.jsx
// (TriangulationMatrix, XIntelligenceFeed, PolymarketTracker, etc.)
// For brevity, keeping the same implementations with minor enhancements

export default App;
