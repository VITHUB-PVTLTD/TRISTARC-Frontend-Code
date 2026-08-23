import React from 'react';
import { motion } from 'framer-motion';

interface PageLoaderProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading...',
  submessage = 'Please wait while we prepare your page',
  fullScreen = true,
}) => {
  return (
    <div
      className={`${
        fullScreen
          ? 'fixed inset-0 z-50 min-h-screen w-screen bg-slate-50/90 backdrop-blur-xs flex items-center justify-center'
          : 'min-h-[60vh] w-full flex items-center justify-center'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center text-center p-8 max-w-sm"
      >
        {/* Animated Rings & Logo Emblem */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          {/* Outer Glowing Pulse */}
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-75" />

          {/* Outer Spinning Ring */}
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary border-r-primary/40 animate-spin" />

          {/* Inner Reverse Spinning Accent Ring */}
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-accent-orange border-l-accent-orange/50 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
          />

          {/* Center Branded Badge */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D2545] to-[#154A8F] flex items-center justify-center text-white font-black text-sm shadow-md shadow-primary/20">
            <span className="tracking-tighter">T</span>
          </div>
        </div>

        {/* Loading Text */}
        <h3 className="text-base font-bold text-tristarc-text-primary tracking-wide mb-1">
          {message}
        </h3>
        <p className="text-xs text-tristarc-text-muted font-medium">
          {submessage}
        </p>

        {/* Animated Loading Dots Bar */}
        <div className="flex items-center gap-1.5 mt-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-accent-orange animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </motion.div>
    </div>
  );
};

export default PageLoader;
