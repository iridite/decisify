import { useState, useEffect, useCallback } from "react";

/**
 * useLiveDataSimulation - Simulate live data changes for demo mode
 *
 * Gradually mutates data to create realistic live updates:
 * - Polymarket odds drift
 * - X sentiment shifts
 * - Nautilus price updates
 * - New events in context memory
 */
export const useLiveDataSimulation = (
  initialData,
  isActive = false,
  speed = 1,
) => {
  const [simulatedData, setSimulatedData] = useState(initialData);

  // Generate random walk for values
  const randomWalk = useCallback((current, min, max, volatility = 0.02) => {
    const change = (Math.random() - 0.5) * volatility;
    const newValue = current + change;
    return Math.max(min, Math.min(max, newValue));
  }, []);

  // Simulate data changes
  useEffect(() => {
    if (!isActive || !initialData) return;

    const interval = setInterval(() => {
      setSimulatedData((prevData) => {
        if (!prevData) return prevData;

        const newData = JSON.parse(JSON.stringify(prevData)); // Deep clone

        // 1. Update Polymarket odds (faster drift for visible changes)
        if (newData.perception?.polymarket) {
          const currentOdds = newData.perception.polymarket.current_odds;
          newData.perception.polymarket.current_odds = randomWalk(
            currentOdds,
            0.5,
            0.85,
            0.05, // Increased for more visible changes
          );

          // Update delta
          const oldOdds =
            newData.perception.polymarket.history[
              newData.perception.polymarket.history.length - 1
            ]?.odds || currentOdds;
          newData.perception.polymarket.delta_1h =
            newData.perception.polymarket.current_odds - oldOdds;

          // Update volume (random fluctuation)
          newData.perception.polymarket.volume_24h = Math.floor(
            newData.perception.polymarket.volume_24h *
              (0.95 + Math.random() * 0.1),
          );
        }

        // 2. Update X Intelligence sentiment scores
        if (newData.perception?.x_intelligence) {
          newData.perception.x_intelligence =
            newData.perception.x_intelligence.map((tweet) => ({
              ...tweet,
              sentiment_score: randomWalk(
                tweet.sentiment_score,
                0.2,
                0.95,
                0.05,
              ),
              agent_relevance_score: randomWalk(
                tweet.agent_relevance_score,
                0.5,
                0.98,
                0.04,
              ),
            }));
        }

        // 3. Update Nautilus trading data (more volatile)
        if (newData.perception?.nautilus) {
          const priceChange = (Math.random() - 0.5) * 300; // Increased for more visible changes
          newData.perception.nautilus.current_price += priceChange;
          newData.perception.nautilus.unrealized_pnl =
            newData.perception.nautilus.current_price -
            newData.perception.nautilus.entry_price;

          newData.perception.nautilus.daily_pnl += priceChange * 0.2; // Increased multiplier

          // Update signal strength (more dynamic)
          newData.perception.nautilus.signal_strength = randomWalk(
            newData.perception.nautilus.signal_strength,
            0.2,
            0.8,
            0.1, // Increased volatility
          );
        }

        // 4. Update triangulation matrix
        if (newData.triangulation_matrix) {
          newData.triangulation_matrix.polymarket_x_correlation = randomWalk(
            newData.triangulation_matrix.polymarket_x_correlation,
            0.3,
            0.95,
            0.05,
          );
          newData.triangulation_matrix.x_nautilus_correlation = randomWalk(
            newData.triangulation_matrix.x_nautilus_correlation,
            0.3,
            0.85,
            0.06,
          );
          newData.triangulation_matrix.overall_alignment =
            (newData.triangulation_matrix.polymarket_x_correlation +
              newData.triangulation_matrix.x_nautilus_correlation) /
            2;
        }

        // 5. Frequently add new context events (increased probability)
        if (Math.random() < 0.35 && newData.context_memory?.events) {
          const eventTypes = [
            "POLYMARKET_SPIKE",
            "X_SENTIMENT_SHIFT",
            "VOLATILITY_SPIKE",
            "NAUTILUS_SIGNAL",
          ];
          const randomType =
            eventTypes[Math.floor(Math.random() * eventTypes.length)];

          const newEvent = {
            id: `evt_${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: randomType,
            description: `${randomType.replace(/_/g, " ").toLowerCase()} detected`,
            relevance_decay: 1.0,
            impact: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
          };

          // Add to front, keep only last 8 events
          newData.context_memory.events = [
            newEvent,
            ...newData.context_memory.events.slice(0, 7),
          ];
        }

        // 6. Update event relevance decay
        if (newData.context_memory?.events) {
          newData.context_memory.events = newData.context_memory.events.map(
            (event) => ({
              ...event,
              relevance_decay: Math.max(0.3, event.relevance_decay * 0.98),
            }),
          );
        }

        // 7. Update meta timestamps
        if (newData.meta) {
          newData.meta.timestamp = new Date().toISOString();
          newData.meta.sync_timestamp = new Date().toISOString();
        }

        return newData;
      });
    }, 1200 / speed); // Faster interval for more visible updates

    return () => clearInterval(interval);
  }, [isActive, speed, randomWalk, initialData]);

  return simulatedData;
};
