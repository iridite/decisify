import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, TrendingUp, BarChart3 } from 'lucide-react';

/**
 * SkeletonLoader - 骨架屏加载组件
 *
 * 提供优雅的加载体验，避免白屏
 */
export function SkeletonLoader() {
  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header Skeleton */}
      <div className="bento-item mb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-700/50 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-700/30 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-6">
            <div className="h-6 w-24 bg-gray-700/50 rounded animate-pulse" />
            <div className="h-6 w-24 bg-gray-700/50 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Key Metrics Bar Skeleton */}
      <div className="mb-6 p-6 rounded-2xl bg-gray-900/90 border border-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 w-24 bg-gray-700/30 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-700/50 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <SkeletonCard height="h-[600px]" icon={Brain} title="Agent Reasoning" />
          <SkeletonCard height="h-64" icon={TrendingUp} title="Market Data" />
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <SkeletonCard height="h-48" icon={Activity} title="Triangulation" />
          <SkeletonCard height="h-64" icon={BarChart3} title="Intelligence" />
          <SkeletonCard height="h-48" icon={TrendingUp} title="Proposal" />
        </div>
      </div>

      {/* Loading Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-8 right-8 flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900/90 backdrop-blur-sm border border-gray-700/50 shadow-2xl"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-5 h-5 border-2 border-iridyne-green border-t-transparent rounded-full"
        />
        <span className="text-sm text-gray-300">Initializing Agent Intelligence...</span>
      </motion.div>
    </div>
  );
}

function SkeletonCard({ height, icon: Icon, title }) {
  return (
    <div className={`bento-item ${height}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-700/30 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-700/50 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-700/30 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-700/20 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}

/**
 * ProgressBar - 顶部进度条
 */
export function ProgressBar({ progress }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: progress / 100 }}
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-iridyne-green to-green-400 origin-left z-50"
      style={{ transformOrigin: 'left' }}
    />
  );
}

/**
 * LazyLoadWrapper - 懒加载包装器
 */
export function LazyLoadWrapper({ children, fallback = <SkeletonCard height="h-64" /> }) {
  return (
    <React.Suspense fallback={fallback}>
      {children}
    </React.Suspense>
  );
}

/**
 * ErrorFallback - 错误回退组件
 */
export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bento-item max-w-md text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-400 mb-6">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-3 bg-iridyne-green/20 hover:bg-iridyne-green/30 text-iridyne-green rounded-xl transition-colors font-medium"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}

/**
 * useProgressiveLoad - 渐进式加载 Hook
 */
export function useProgressiveLoad(steps = 3, interval = 500) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  React.useEffect(() => {
    if (currentStep >= steps) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, interval);

    return () => clearTimeout(timer);
  }, [currentStep, steps, interval]);

  return {
    currentStep,
    progress: (currentStep / steps) * 100,
    isComplete,
  };
}
