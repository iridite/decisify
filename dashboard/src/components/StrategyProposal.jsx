import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export function StrategyProposal({ proposal, onDecision }) {
  const [toast, setToast] = useState(null);

  if (!proposal) return null;

  const riskColors = {
    LOW: "text-iridyne-green",
    MEDIUM: "text-yellow-500",
    HIGH: "text-volatility-orange",
  };

  const isPending = proposal.status === "ACTIVE" && !proposal.human_decision;

  const handleDecision = (proposalId, decision) => {
    onDecision(proposalId, decision);

    // Show toast notification
    const message =
      decision === "approved"
        ? "✓ Strategy approved and executing..."
        : "✗ Strategy rejected";
    const color =
      decision === "approved"
        ? "bg-iridyne-green/20 text-iridyne-green border-iridyne-green/30"
        : "bg-red-500/20 text-red-400 border-red-500/30";

    setToast({ message, color });

    // Clear toast after 4 seconds
    setTimeout(() => setToast(null), 4000);
  };

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
              onClick={() => handleDecision(proposal.id, "approved")}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-iridyne-green/20 hover:bg-iridyne-green/30 text-iridyne-green rounded transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Execute
            </button>
            <button
              onClick={() => handleDecision(proposal.id, "rejected")}
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

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-3 p-3 rounded border ${toast.color}`}
            >
              <div className="text-sm font-medium">{toast.message}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
