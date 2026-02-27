import React, { memo } from 'react';
import { Target } from 'lucide-react';

export const TriangulationMatrix = memo(function TriangulationMatrix({ matrix }) {
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
});
