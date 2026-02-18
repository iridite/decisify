import React from "react";
import { motion } from "framer-motion";

// Optimized loading skeleton with shimmer effect
export function LoadingSkeleton() {
  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header Skeleton */}
      <div className="bento-item mb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-border-subtle rounded animate-pulse" />
            <div className="h-4 w-32 bg-border-subtle rounded animate-pulse" />
          </div>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-6 w-24 bg-border-subtle rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-12 gap-4">
        {/* Large card */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bento-item h-[600px]">
            <div className="h-6 w-48 bg-border-subtle rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-border-subtle rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Side cards */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bento-item h-[290px]">
              <div className="h-6 w-32 bg-border-subtle rounded animate-pulse mb-4" />
              <div className="h-48 bg-border-subtle rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Bottom cards */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bento-item h-[400px]">
            <div className="h-6 w-40 bg-border-subtle rounded animate-pulse mb-4" />
            <div className="h-64 bg-border-subtle rounded animate-pulse" />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bento-item h-[190px]">
              <div className="h-6 w-32 bg-border-subtle rounded animate-pulse mb-4" />
              <div className="h-32 bg-border-subtle rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Fast initial loading screen
export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-onyx"
    >
      <div className="text-center">
        {/* Animated logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold">
            <span className="text-text-secondary">Iridyne /</span>{" "}
            <span className="gradient-text">Decisify</span>
          </h1>
        </motion.div>

        {/* Loading spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-iridyne-green border-t-transparent rounded-full mx-auto mb-4"
        />

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-text-secondary font-mono text-sm"
        >
          Initializing Agent Intelligence...
        </motion.p>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-border-subtle rounded-full overflow-hidden mx-auto mt-4">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-iridyne-green"
          />
        </div>
      </div>
    </motion.div>
  );
}

// Error boundary fallback
export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bento-item max-w-2xl text-center"
      >
        <div className="w-20 h-20 rounded-full bg-volatility-orange/20 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-volatility-orange"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-4">System Error</h2>
        <p className="text-text-secondary mb-6">
          The agent intelligence system encountered an unexpected error.
        </p>

        <details className="text-left mb-6">
          <summary className="cursor-pointer text-sm text-text-secondary hover:text-text-primary mb-2">
            Technical Details
          </summary>
          <pre className="text-xs bg-border-subtle/30 p-4 rounded overflow-auto max-h-48">
            {error.message}
            {"\n\n"}
            {error.stack}
          </pre>
        </details>

        <button
          onClick={resetErrorBoundary}
          className="px-6 py-3 bg-iridyne-green text-midnight-onyx rounded-lg font-mono hover:bg-iridyne-green/80 transition-colors"
        >
          Restart System
        </button>
      </motion.div>
    </div>
  );
}

// Network error state
export function NetworkError({ onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bento-item max-w-md mx-auto mt-20"
    >
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-volatility-orange/20 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-volatility-orange"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold mb-2">Connection Lost</h3>
        <p className="text-text-secondary mb-6">
          Unable to reach the agent intelligence system. Check your network
          connection.
        </p>

        <button
          onClick={onRetry}
          className="px-6 py-2 bg-iridyne-green text-midnight-onyx rounded-lg font-mono hover:bg-iridyne-green/80 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </motion.div>
  );
}
