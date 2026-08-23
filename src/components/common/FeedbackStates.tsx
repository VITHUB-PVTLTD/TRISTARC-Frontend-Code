import React from 'react';
import { motion } from 'framer-motion';

// ─── Loading Skeleton ────────────────────────────────────────
const SkeletonBlock: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`} />
);

export const CardSkeleton: React.FC = () => (
  <div className="card p-6 space-y-4">
    <SkeletonBlock className="h-40 w-full rounded-xl" />
    <SkeletonBlock className="h-5 w-3/4" />
    <SkeletonBlock className="h-4 w-full" />
    <SkeletonBlock className="h-4 w-5/6" />
    <div className="flex gap-2 pt-2">
      <SkeletonBlock className="h-6 w-16 rounded-full" />
      <SkeletonBlock className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card p-5 flex gap-4">
        <SkeletonBlock className="h-14 w-14 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2.5">
          <SkeletonBlock className="h-5 w-2/3" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

interface LoadingStateProps {
  type?: 'card' | 'list' | 'spinner';
  count?: number;
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'card',
  count = 3,
  message,
}) => {
  if (type === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3.5 text-center">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary border-r-primary/40 animate-spin" />
          <div
            className="absolute inset-1 rounded-full border-2 border-transparent border-b-accent-orange border-l-accent-orange/50 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
          />
          <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center text-white font-bold text-[10px]">
            T
          </div>
        </div>
        <p className="text-tristarc-text-secondary text-xs font-semibold tracking-wide">
          {message || 'Loading content...'}
        </p>
      </div>
    );
  }
  if (type === 'list') {
    return <ListSkeleton count={count} />;
  }
  return (
    <div className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'No content available',
  description = 'No content is available at the moment.',
  action,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    {icon && (
      <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-semibold text-tristarc-text-primary mb-2">{title}</h3>
    <p className="text-tristarc-text-secondary text-sm max-w-md mb-6">{description}</p>
    {action}
  </motion.div>
);

// ─── Error State ─────────────────────────────────────────────
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load content',
  description = 'Something went wrong while loading this content. Please try again.',
  onRetry,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-16 h-16 rounded-2xl bg-accent-red-light flex items-center justify-center mb-4">
      <span className="text-accent-red text-2xl font-bold">!</span>
    </div>
    <h3 className="text-lg font-semibold text-tristarc-text-primary mb-2">{title}</h3>
    <p className="text-tristarc-text-secondary text-sm max-w-md mb-6">{description}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn-primary btn-md">
        Try Again
      </button>
    )}
  </motion.div>
);
