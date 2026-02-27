import React from 'react';

export function NautilusSnapshot({ nautilus }) {
  const pnlPositive = nautilus.daily_pnl > 0;

  return (
    <div className="bento-item">
      <h2 className="text-lg font-bold mb-4">Nautilus Quant Snapshot</h2>

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
