import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Clock } from 'lucide-react';

export function XIntelligenceFeed({ signals }) {
  return (
    <div className="bento-item h-[400px] flex flex-col">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Radio className="w-5 h-5 text-iridyne-green" />X Intelligence Feed
      </h2>

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
