import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  Zap,
  Gauge,
  Keyboard,
} from "lucide-react";

export function DemoControls({
  isDemoMode,
  isAutoPlay,
  isFullscreen,
  demoSpeed,
  onToggleDemo,
  onToggleAutoPlay,
  onToggleFullscreen,
  onSpeedChange,
}) {
  return (
    <AnimatePresence>
      {isDemoMode && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="glass-panel px-6 py-3 rounded-full border border-iridyne-green/30 shadow-2xl">
            <div className="flex items-center gap-4">
              {/* Demo Mode Indicator */}
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-2 h-2 rounded-full bg-iridyne-green"
                />
                <span className="text-xs font-mono text-iridyne-green">
                  DEMO MODE
                </span>
              </div>

              <div className="w-px h-6 bg-border-subtle" />

              {/* Auto-play Toggle */}
              <button
                onClick={onToggleAutoPlay}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-border-subtle/30 transition-colors"
                title="Toggle Auto-play (Ctrl+P or Space)"
              >
                {isAutoPlay ? (
                  <Pause className="w-4 h-4 text-volatility-orange" />
                ) : (
                  <Play className="w-4 h-4 text-iridyne-green" />
                )}
                <span className="text-xs font-mono">
                  {isAutoPlay ? "PAUSE" : "PLAY"}
                </span>
              </button>

              {/* Speed Control */}
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-text-secondary" />
                <div className="flex gap-1">
                  {[1, 2, 3].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => onSpeedChange(speed)}
                      className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                        demoSpeed === speed
                          ? "bg-iridyne-green text-midnight-onyx"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                      title={`${speed}x Speed (Ctrl+${speed})`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-px h-6 bg-border-subtle" />

              {/* Fullscreen Toggle */}
              <button
                onClick={onToggleFullscreen}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-border-subtle/30 transition-colors"
                title="Toggle Fullscreen (Ctrl+F)"
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </button>

              {/* Keyboard Shortcuts Hint */}
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-border-subtle/30 transition-colors"
                title="Keyboard Shortcuts"
              >
                <Keyboard className="w-4 h-4 text-text-secondary" />
              </button>

              <div className="w-px h-6 bg-border-subtle" />

              {/* Exit Demo Mode */}
              <button
                onClick={onToggleDemo}
                className="px-3 py-1.5 rounded-lg bg-volatility-orange/20 hover:bg-volatility-orange/30 transition-colors text-xs font-mono"
                title="Exit Demo Mode (Ctrl+D)"
              >
                EXIT
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 glass-panel p-3 rounded-lg text-xs"
          >
            <div className="font-mono text-iridyne-green mb-2">
              KEYBOARD SHORTCUTS
            </div>
            <div className="space-y-1 text-text-secondary">
              <div className="flex justify-between">
                <span>Toggle Demo</span>
                <span className="text-text-primary">Ctrl+D</span>
              </div>
              <div className="flex justify-between">
                <span>Play/Pause</span>
                <span className="text-text-primary">Space / Ctrl+P</span>
              </div>
              <div className="flex justify-between">
                <span>Fullscreen</span>
                <span className="text-text-primary">Ctrl+F</span>
              </div>
              <div className="flex justify-between">
                <span>Speed</span>
                <span className="text-text-primary">Ctrl+1/2/3</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Demo Mode Toggle Button (always visible)
export function DemoModeToggle({ isDemoMode, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      className={`fixed top-6 right-6 z-40 px-4 py-2 rounded-lg font-mono text-sm transition-all ${
        isDemoMode
          ? "bg-iridyne-green text-midnight-onyx"
          : "glass-panel border border-border-subtle hover:border-iridyne-green"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title="Toggle Demo Mode (Ctrl+D)"
    >
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4" />
        {isDemoMode ? "DEMO ON" : "DEMO MODE"}
      </div>
    </motion.button>
  );
}
