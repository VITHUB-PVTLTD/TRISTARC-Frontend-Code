import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-1 text-sm ${className}`}>
      <Link
        to="/"
        className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
      >
        <Home size={14} />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="text-white/40 shrink-0" />
          {item.path && index < items.length - 1 ? (
            <Link
              to={item.path}
              className="text-white/70 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

interface SectionHeadingProps {
  overline?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  overline,
  title,
  subtitle,
  centered = false,
  light = false,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={`${centered ? 'text-center' : ''} ${className}`}
    >
      {overline && (
        <span className={`section-overline mb-3 block ${light ? 'text-accent-orange' : ''}`}>
          {overline}
        </span>
      )}
      <h2 className={`section-title mb-4 ${light ? 'text-white' : ''}`}>{title}</h2>
      {subtitle && (
        <p className={`section-subtitle ${centered ? 'mx-auto' : ''} ${light ? 'text-white/75' : ''}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'orange' | 'green' | 'red';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue', className = '' }) => {
  const classes = {
    blue: 'badge-blue',
    orange: 'badge-orange',
    green: 'badge-green',
    red: 'badge-red',
  };
  return <span className={`${classes[variant]} ${className}`}>{children}</span>;
};
