import React from 'react';
import { motion } from 'framer-motion';
import { type BreadcrumbItem, Breadcrumb } from './UIElements';

interface PageHeroProps {
  title: string;
  description?: string;
  breadcrumb?: BreadcrumbItem[];
  compact?: boolean;
  gradient?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  description,
  breadcrumb,
  compact = false,
  gradient = 'from-primary-dark via-primary to-primary-600',
}) => {
  return (
    <section
      className={`relative bg-gradient-to-br ${gradient} overflow-hidden ${compact ? 'py-12 lg:py-16' : 'py-16 lg:py-24'}`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 mega-menu-grid pointer-events-none" />
      
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

      <div className="container-main relative z-10">
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb items={breadcrumb} className="mb-4" />
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-display-sm lg:text-display-md text-white font-bold mb-4 max-w-3xl">
            {title}
          </h1>
          {description && (
            <p className="text-body-lg text-white/80 max-w-2xl">{description}</p>
          )}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-tristarc-bg to-transparent pointer-events-none" />
    </section>
  );
};
