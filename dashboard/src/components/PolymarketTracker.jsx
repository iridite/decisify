import React, { memo } from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChartLW } from './LightweightChart';

export const PolymarketTracker = memo(function PolymarketTracker({ polymarket }) {
  return (
    <div className="bento-item">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-iridyne-green" />
            Polymarket Odds Tracker
          </h2>
          <p className="text-sm text-text-secondary mt-1">{polymarket.event}</p>
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

      <AreaChartLW data={polymarket.history} height={200} color="#00ffc2" />

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
});
