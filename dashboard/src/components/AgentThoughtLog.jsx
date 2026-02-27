import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ThumbsUp, ThumbsDown } from 'lucide-react';
import { SectionHeader } from './VisualComponents';

export function AgentThoughtLog({ thoughts, newThoughts, onFeedback, agentThinking }) {
  return (
    <div className="bento-item h-[600px] flex flex-col">
      <SectionHeader
        icon={Brain}
        title="Agent Reasoning Trace"
        subtitle="实时推理过程与决策轨迹"
        badge={agentThinking ? "THINKING..." : `${thoughts.length} thoughts`}
      />

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
            data-tour="attention-weights"
          >
            <div className="text-xs space-y-2">
              <div>
                <span className="text-text-secondary">Input Sources & Attention Weights:</span>
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
