import { useState, useEffect, useCallback } from "react";

/**
 * useDemoMode - Hackathon Demo Mode Hook
 *
 * Features:
 * 1. Auto-play mode that simulates live agent activity
 * 2. Keyboard shortcuts for presentation control
 * 3. Fake data streaming for impressive live demos
 * 4. Fullscreen mode toggle
 */
export const useDemoMode = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [demoSpeed, setDemoSpeed] = useState(1); // 1x, 2x, 3x

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + D: Toggle demo mode
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        setIsDemoMode((prev) => !prev);
      }

      // Ctrl/Cmd + P: Toggle auto-play
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setIsAutoPlay((prev) => !prev);
      }

      // Ctrl/Cmd + F: Toggle fullscreen
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        toggleFullscreen();
      }

      // Ctrl/Cmd + 1/2/3: Change demo speed
      if ((e.ctrlKey || e.metaKey) && ["1", "2", "3"].includes(e.key)) {
        e.preventDefault();
        setDemoSpeed(parseInt(e.key));
      }

      // Space: Pause/Resume auto-play
      if (e.key === " " && isDemoMode) {
        e.preventDefault();
        setIsAutoPlay((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isDemoMode]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []); // toggleFullscreen is stable, no need to include

  // Generate fake streaming data for demo
  const generateDemoThought = useCallback(() => {
    const types = ["TRIANGULATION", "SENTIMENT_ANALYSIS", "RISK_ASSESSMENT"];
    const reasonings = [
      "Detecting strong correlation between Polymarket odds surge and X sentiment spike. Technical confirmation pending.",
      "Market sentiment shifting bullish. High-impact accounts showing 85% positive conviction.",
      "Volatility spike detected. Safety protocols engaged. Overriding aggressive signals.",
      "Cross-source validation complete. All perception channels aligned. High confidence signal.",
      "Nautilus Keltner breakout confirmed. Polymarket odds at 72%. Executing position increase.",
    ];

    return {
      id: `demo_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: types[Math.floor(Math.random() * types.length)],
      reasoning: reasonings[Math.floor(Math.random() * reasonings.length)],
      confidence: 0.6 + Math.random() * 0.35,
      inputs: {
        polymarket_delta: (Math.random() * 0.05).toFixed(3),
        x_sentiment_current: (0.6 + Math.random() * 0.3).toFixed(2),
        nautilus_signal_strength: (0.3 + Math.random() * 0.5).toFixed(2),
      },
      human_feedback: null,
    };
  }, []);

  return {
    isDemoMode,
    isAutoPlay,
    isFullscreen,
    demoSpeed,
    setIsDemoMode,
    setIsAutoPlay,
    setDemoSpeed,
    toggleFullscreen,
    generateDemoThought,
  };
};
