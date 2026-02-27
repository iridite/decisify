import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const MemoryEvent = memo(function MemoryEvent({ event, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30"
    >
      <Activity className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-slate-300">{event.description}</div>
        <div className="text-xs text-slate-500 mt-1">{event.timestamp}</div>
      </div>
    </motion.div>
  );
});

export const ContextMemory = memo(function ContextMemory({ events }) {
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
            <div className="text-xs text-text-secondary mb-1">{event.type}</div>
            <div className="text-xs leading-tight">{event.description}</div>
            <div className="text-xs text-text-secondary mt-1">
              {new Date(event.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
