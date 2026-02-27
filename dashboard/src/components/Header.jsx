import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, Activity } from 'lucide-react';

export function Header({ data, agentThinking }) {
  const timeSinceSync = Math.floor(
    (new Date() - new Date(data.meta.sync_timestamp)) / 1000,
  );

  return (
    <header className="bento-item">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-text-secondary">Iridyne /</span>{" "}
            <span className="gradient-text">Decisify</span>
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
    </header>
  );
}
