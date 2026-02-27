import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useDataPolling } from "./hooks/useDataPolling";
import { useDemoMode } from "./hooks/useDemoMode";
import { useLiveDataSimulation } from "./hooks/useLiveDataSimulation";
import {
  DemoControls,
  DemoModeToggle,
  DemoModeBanner,
} from "./components/DemoControls";
import { GuidedTour, useTourState } from "./components/GuidedTour";
import { KeyMetricsBar } from "./components/VisualComponents";
import { SkeletonLoader, ProgressBar } from "./components/LoadingComponents";
import { Header } from "./components/Header";
import { AgentThoughtLog } from "./components/AgentThoughtLog";
import { TriangulationMatrix } from "./components/TriangulationMatrix";
import { XIntelligenceFeed } from "./components/XIntelligenceFeed";
import { PolymarketTracker } from "./components/PolymarketTracker";
import { StrategyProposal } from "./components/StrategyProposal";
import { NautilusSnapshot } from "./components/NautilusSnapshot";
import { ContextMemory } from "./components/ContextMemory";

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

  // Track timeout IDs for cleanup
  const timeoutIdsRef = useRef([]);

  // Guided Tour state
  const { runTour, handleTourComplete, restartTour } = useTourState();

  // Demo Mode hook
  const {
    isDemoMode,
    isAutoPlay,
    isFullscreen,
    demoSpeed,
    setIsDemoMode,
    setIsAutoPlay,
    setDemoSpeed,
    toggleFullscreen,
    generateDemoThought,
  } = useDemoMode();

  // Auto-enable Demo Mode on GitHub Pages for impressive live demo
  useEffect(() => {
    const isGitHubPages = window.location.hostname.includes("github.io");
    if (isGitHubPages && !isDemoMode) {
      setIsDemoMode(true);
      setIsAutoPlay(true);
      setDemoSpeed(2); // Faster for more visible updates
    }
  }, []); // Only run once on mount

  // Check if running on GitHub Pages
  const isGitHubPages = window.location.hostname.includes("github.io");

  // Live data simulation - only active in demo mode
  const simulatedData = useLiveDataSimulation(rawData, isDemoMode, demoSpeed);

  // Use simulated data in demo mode, otherwise use raw data
  const data = isDemoMode ? simulatedData : rawData;

  // Simulate "agent is thinking" state when new data arrives
  useEffect(() => {
    if (newThoughts.length > 0) {
      setAgentThinking(true);
      const timeoutId = setTimeout(() => setAgentThinking(false), 3000);
      return () => clearTimeout(timeoutId);
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

      // Track timeout for cleanup
      const timeoutId = setTimeout(() => setAgentThinking(false), 2000);
      timeoutIdsRef.current.push(timeoutId);
    }, interval);

    return () => {
      clearInterval(timer);
      // Clear all pending timeouts
      timeoutIdsRef.current.forEach(clearTimeout);
      timeoutIdsRef.current = [];
    };
  }, [isDemoMode, isAutoPlay, demoSpeed, generateDemoThought]);

  if (isLoading) {
    return (
      <>
        <ProgressBar progress={50} />
        <SkeletonLoader />
      </>
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
    <div
      className={`min-h-screen p-4 md:p-6 ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}
    >
      {/* Guided Tour */}
      <GuidedTour run={runTour} onComplete={handleTourComplete} />

      {/* Demo Mode Banner - Hidden on GitHub Pages for realistic demo */}
      <AnimatePresence>
        {isDemoMode && !isGitHubPages && (
          <DemoModeBanner onExit={() => setIsDemoMode(false)} />
        )}
      </AnimatePresence>

      {/* Demo Mode Toggle - Hidden on GitHub Pages */}
      {!isGitHubPages && (
        <DemoModeToggle
          isDemoMode={isDemoMode}
          onToggle={() => setIsDemoMode(!isDemoMode)}
        />
      )}

      {/* Demo Controls - Hidden on GitHub Pages for clean demo */}
      {!isGitHubPages && isDemoMode && (
        <DemoControls
          isAutoPlay={isAutoPlay}
          isFullscreen={isFullscreen}
          demoSpeed={demoSpeed}
          onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
          onToggleFullscreen={toggleFullscreen}
        />
      )}

      {/* Header */}
      <Header data={data} agentThinking={agentThinking} />

      {/* Key Metrics Bar - 突出显示核心决策信息 */}
      <KeyMetricsBar
        proposal={data.execution.current_proposal}
        triangulation={data.triangulation_matrix}
      />

      {/* Main Bento Grid */}
      <div className="grid grid-cols-12 gap-4 mt-6">
        {/* Agent Thought Log - Main Center */}
        <div className="col-span-12 lg:col-span-7" data-tour="agent-thoughts">
          <AgentThoughtLog
            thoughts={allThoughts}
            newThoughts={displayThoughts}
            onFeedback={submitFeedback}
            agentThinking={agentThinking}
          />
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          {/* Triangulation Matrix */}
          <div data-tour="triangulation">
            <TriangulationMatrix matrix={data.triangulation_matrix} />
          </div>

          {/* X Intelligence Feed */}
          <div data-tour="x-intelligence">
            <XIntelligenceFeed signals={data.perception.x_intelligence} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="col-span-12 lg:col-span-7" data-tour="polymarket">
          <PolymarketTracker polymarket={data.perception.polymarket} />
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          {/* Strategy Proposal */}
          <div data-tour="proposal">
            <StrategyProposal
              proposal={data.execution.current_proposal}
              onDecision={handleProposal}
            />
          </div>

          {/* Nautilus Snapshot */}
          <div data-tour="nautilus">
            <NautilusSnapshot nautilus={data.perception.nautilus} />
          </div>
        </div>

        {/* Context Memory Tracker */}
        <div className="col-span-12">
          <ContextMemory events={data.context_memory.events} />
        </div>
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
