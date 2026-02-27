/**
 * Data Simulator - Generate realistic market data with random fluctuations
 * Used for demo mode to simulate real-time data updates
 */

// Base state that evolves over time
let basePrice = 42000;
let baseOdds = 0.65;
let baseSentiment = 0.7;
let baseSignal = 0.5;
let eventCounter = 42;

/**
 * Apply random walk to a value within bounds
 */
function randomWalk(current, min, max, volatility = 0.02) {
  const change = (Math.random() - 0.5) * 2 * volatility;
  const newValue = current * (1 + change);
  return Math.max(min, Math.min(max, newValue));
}

/**
 * Generate realistic fluctuating market data
 */
export function generateLiveData(previousData = null) {
  // Evolve base values with random walk
  basePrice = randomWalk(basePrice, 38000, 46000, 0.005);
  baseOdds = randomWalk(baseOdds, 0.3, 0.85, 0.03);
  baseSentiment = randomWalk(baseSentiment, 0.2, 0.95, 0.04);
  baseSignal = randomWalk(baseSignal, 0.15, 0.85, 0.035);

  const now = new Date().toISOString();

  // Calculate derived values
  const currentPrice = basePrice + (Math.random() - 0.5) * 200;
  const entryPrice = basePrice - Math.random() * 300;

  const delta1h = (Math.random() - 0.5) * 0.08;
  const delta24h = (Math.random() - 0.5) * 0.15;

  const sentiment = baseSentiment > 0.6 ? "BULLISH" : baseSentiment < 0.4 ? "BEARISH" : "NEUTRAL";
  const action = baseSentiment > 0.65 ? "BUY" : baseSentiment < 0.35 ? "SELL" : "HOLD";
  const position = baseSignal > 0.5 ? "LONG" : baseSignal < 0.3 ? "SHORT" : "FLAT";

  // Random weights that sum to 1.0
  const w1 = 0.3 + Math.random() * 0.2;
  const w2 = 0.2 + Math.random() * 0.2;
  const w3 = 1.0 - w1 - w2;

  // Correlations
  const pmXCorr = 0.6 + Math.random() * 0.35;
  const pmNCorr = 0.5 + Math.random() * 0.35;
  const xNCorr = 0.5 + Math.random() * 0.3;
  const overall = (pmXCorr + pmNCorr + xNCorr) / 3;

  const interpretation = overall > 0.75 ? "HIGH_BULLISH" :
                        overall > 0.6 ? "MODERATE_BULLISH" :
                        overall > 0.4 ? "NEUTRAL" : "BEARISH";

  // Random tweet content
  const tweetTemplates = [
    `BTC breaking resistance at $${(currentPrice / 1000).toFixed(0)}k. Strong momentum building. #Bitcoin`,
    `Market showing ${sentiment.toLowerCase()} signals. Volume increasing at $${(currentPrice / 1000).toFixed(0)}k level. #Crypto`,
    `Technical analysis suggests $${(currentPrice / 1000).toFixed(0)}k is key support. Watch closely. #BTC`,
    `Institutional interest growing. BTC holding $${(currentPrice / 1000).toFixed(0)}k. #Bitcoin #Crypto`,
    `On-chain metrics ${sentiment.toLowerCase()}. Price action at $${(currentPrice / 1000).toFixed(0)}k looking strong. #BTC`,
    `Breaking: BTC ${delta1h > 0 ? 'surges' : 'dips'} ${Math.abs(delta1h * 100).toFixed(1)}% in last hour. Currently at $${(currentPrice / 1000).toFixed(0)}k. #Bitcoin`,
    `Market update: ${sentiment} sentiment dominates. BTC trading at $${(currentPrice / 1000).toFixed(0)}k. #Crypto`,
  ];
  const tweetContent = tweetTemplates[Math.floor(Math.random() * tweetTemplates.length)];

  const confidence = 0.55 + Math.random() * 0.3;
  const unrealizedPnl = currentPrice - entryPrice;
  const dailyPnl = -500 + Math.random() * 2500;

  eventCounter += Math.random() > 0.7 ? 1 : 0; // Occasionally increment

  const timestamp = Date.now();

  return {
    meta: {
      timestamp: now,
      agent_status: ["REASONING", "ANALYZING", "MONITORING"][Math.floor(Math.random() * 3)],
      context_window_hours: 8,
      total_events_tracked: eventCounter,
      system_status: "LIVE",
      sync_timestamp: now,
    },
    data_sources: {
      polymarket: {
        type: "LIVE",
        source: "实时市场数据",
        last_update: now,
        status: "active",
      },
      x_intelligence: {
        type: "LIVE",
        source: "实时社交媒体分析",
        last_update: now,
        status: "active",
      },
      nautilus: {
        type: "LIVE",
        source: "实时交易信号",
        last_update: now,
        status: "active",
      },
    },
    agent_thoughts: [
      {
        id: `thought_${timestamp}`,
        timestamp: now,
        type: "TRIANGULATION",
        reasoning: `实时分析: 市场信号置信度 ${(confidence * 100).toFixed(0)}%。Polymarket 显示 ${sentiment.toLowerCase()} 趋势 (${delta1h >= 0 ? '+' : ''}${(delta1h * 100).toFixed(1)}% 1h)，X 情感指数 ${baseSentiment.toFixed(2)}，Nautilus 信号强度 ${baseSignal.toFixed(2)}。`,
        inputs: {
          weights: {
            polymarket: parseFloat(w1.toFixed(2)),
            x_sentiment: parseFloat(w2.toFixed(2)),
            nautilus: parseFloat(w3.toFixed(2))
          },
          action: action,
        },
        confidence: parseFloat(confidence.toFixed(2)),
        human_feedback: null,
      },
    ],
    triangulation_matrix: {
      polymarket_x_correlation: parseFloat(pmXCorr.toFixed(2)),
      polymarket_nautilus_correlation: parseFloat(pmNCorr.toFixed(2)),
      x_nautilus_correlation: parseFloat(xNCorr.toFixed(2)),
      overall_alignment: parseFloat(overall.toFixed(2)),
      interpretation: interpretation,
    },
    perception: {
      polymarket: {
        event: "BTC 价格预测市场",
        current_odds: parseFloat(baseOdds.toFixed(2)),
        delta_1h: parseFloat(delta1h.toFixed(3)),
        delta_24h: parseFloat(delta24h.toFixed(3)),
        volume_24h: Math.floor(800000 + Math.random() * 1200000),
        liquidity: Math.floor(2500000 + Math.random() * 2000000),
        last_trade: now,
        history: [{ timestamp: now, odds: parseFloat(baseOdds.toFixed(2)) }],
      },
      x_intelligence: [
        {
          id: `tweet_live_${timestamp}`,
          handle: ["@crypto_analyst", "@btc_trader", "@market_watch", "@chain_analysis", "@whale_alert"][Math.floor(Math.random() * 5)],
          content: tweetContent,
          timestamp: now,
          sentiment: sentiment,
          sentiment_score: parseFloat(baseSentiment.toFixed(2)),
          agent_relevance_score: parseFloat((0.7 + Math.random() * 0.25).toFixed(2)),
          extracted_entities: ["BTC", "resistance", "momentum"],
          impact_score: parseFloat((baseSentiment * 10).toFixed(1)),
          follower_count: Math.floor(50000 + Math.random() * 150000),
        },
      ],
      nautilus: {
        strategy: "Keltner Channel Breakout",
        position: position,
        signal_strength: parseFloat(baseSignal.toFixed(2)),
        entry_price: parseFloat(entryPrice.toFixed(2)),
        current_price: parseFloat(currentPrice.toFixed(2)),
        unrealized_pnl: parseFloat(unrealizedPnl.toFixed(2)),
        daily_pnl: parseFloat(dailyPnl.toFixed(2)),
        position_size: parseFloat((0.5 + Math.random() * 1.0).toFixed(1)),
        status: position !== "FLAT" ? "ACTIVE" : "IDLE",
        indicators: {
          keltner_upper: parseFloat((currentPrice + 600).toFixed(2)),
          keltner_middle: parseFloat(currentPrice.toFixed(2)),
          keltner_lower: parseFloat((currentPrice - 600).toFixed(2)),
          atr: parseFloat((350 + Math.random() * 200).toFixed(2)),
          trend: baseSignal > 0.5 ? "BULLISH" : "BEARISH",
        },
      },
    },
    execution: {
      current_proposal: {
        id: `prop_${timestamp}`,
        action: action,
        asset: "BTC",
        reasoning: `市场分析: Polymarket 赔率 ${baseOdds.toFixed(2)} (${delta1h >= 0 ? '+' : ''}${(delta1h * 100).toFixed(1)}% 1h)，X 情感 ${sentiment.toLowerCase()} (${baseSentiment.toFixed(2)})，Nautilus ${position.toLowerCase()} 信号 (${baseSignal.toFixed(2)})。风险调整置信度: ${(confidence * 100).toFixed(0)}%。`,
        risk_level: ["LOW", "MEDIUM", "MEDIUM", "HIGH"][Math.floor(Math.random() * 4)],
        expected_return: action !== "HOLD" ? parseFloat((-0.02 + Math.random() * 0.1).toFixed(3)) : null,
        confidence: parseFloat(confidence.toFixed(2)),
        status: ["ACTIVE", "PENDING_APPROVAL", "PENDING_APPROVAL"][Math.floor(Math.random() * 3)],
        created_at: now,
        human_decision: null,
      },
      proposal_history: [],
    },
    context_memory: {
      events: Array.from({ length: 8 }, (_, i) => {
        const eventTime = new Date(Date.now() - i * 15 * 60 * 1000);
        return {
          id: `evt_${i}`,
          timestamp: eventTime.toISOString(),
          type: ["X_SENTIMENT_SHIFT", "POLYMARKET_ODDS_CHANGE", "NAUTILUS_SIGNAL"][i % 3],
          description: `市场事件 ${i}: 检测到信号`,
          relevance_decay: parseFloat((1.0 - i * 0.1).toFixed(2)),
          impact: i < 3 ? "HIGH" : i < 6 ? "MEDIUM" : "LOW",
        };
      }),
    },
    github_actions: {
      last_run: now,
      status: "success",
      workflow: "live-update",
      duration_seconds: Math.floor(8 + Math.random() * 10),
      next_run: new Date(Date.now() + 2000).toISOString(),
    },
  };
}

/**
 * Reset base values (useful for testing)
 */
export function resetSimulator() {
  basePrice = 42000;
  baseOdds = 0.65;
  baseSentiment = 0.7;
  baseSignal = 0.5;
  eventCounter = 42;
}
