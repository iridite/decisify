import { motion } from "framer-motion";

// Skeleton loader component
export function SkeletonLoader({ className = "" }) {
  return (
    <motion.div
      className={`bg-border-subtle/20 rounded ${className}`}
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Loading state for different components
export function ThoughtLogSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 rounded bg-border-subtle/10">
          <SkeletonLoader className="h-4 w-3/4 mb-2" />
          <SkeletonLoader className="h-3 w-full mb-1" />
          <SkeletonLoader className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  );
}

export function MatrixSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[...Array(9)].map((_, i) => (
        <SkeletonLoader key={i} className="aspect-square" />
      ))}
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-3 rounded bg-border-subtle/10">
          <div className="flex items-start gap-2 mb-2">
            <SkeletonLoader className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <SkeletonLoader className="h-3 w-24 mb-1" />
              <SkeletonLoader className="h-2 w-16" />
            </div>
          </div>
          <SkeletonLoader className="h-3 w-full mb-1" />
          <SkeletonLoader className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="space-y-2">
      <SkeletonLoader className="h-4 w-32 mb-4" />
      <SkeletonLoader className="h-48 w-full" />
    </div>
  );
}

// Generic loading overlay
export function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className="absolute inset-0 bg-midnight-onyx/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          className="w-12 h-12 border-2 border-iridyne-green/30 border-t-iridyne-green rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-text-secondary">{message}</p>
      </div>
    </div>
  );
}
