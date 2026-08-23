import React, { useRef, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe, TrendingUp, Briefcase, Database, Shield, BarChart2, Heart, Award, Users, Vote, BookOpen, FlaskConical } from 'lucide-react';
import type { NavItem } from '@/types';
import { useClickOutside } from '@/hooks/useClickOutside';
import { navigation } from '@/data/navigation';

const serviceIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Globe, TrendingUp, Briefcase, Database, Shield, BarChart2, Heart, Award, Users, Vote,
};

const courseIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  BookOpen, FlaskConical,
};

const megaMenuVariants = {
  hidden: { opacity: 0, y: -8, scaleY: 0.96 },
  visible: { opacity: 1, y: 0, scaleY: 1, transition: { duration: 0.2, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -6, scaleY: 0.97, transition: { duration: 0.15, ease: 'easeIn' as const } },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } },
};

interface ServicesMegaMenuProps {
  items: NavItem['children'];
  onClose: () => void;
}

export const ServicesMegaMenu: React.FC<ServicesMegaMenuProps> = ({ items, onClose }) => {
  const navigate = useNavigate();
  if (!items) return null;

  // Split into 3 columns
  const col1 = items.slice(0, 4);
  const col2 = items.slice(4, 7);
  const col3 = items.slice(7, 10);

  const handleItemClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={megaMenuVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-[900px] max-w-[96vw] bg-white rounded-2xl shadow-mega border border-tristarc-border z-50 overflow-hidden origin-top"
        role="menu"
        aria-label="Services menu"
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-dark to-primary px-6 py-4">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-4 bg-accent-orange rounded-full" />
            Our Services
          </h3>
          <p className="text-white/70 text-xs mt-0.5">Research, Analytics &amp; Consulting Solutions</p>
        </div>

        {/* Grid */}
        <div className="p-6 grid grid-cols-3 gap-x-6 gap-y-1">
          {[col1, col2, col3].map((col, colIdx) => (
            <div key={colIdx} className="space-y-1">
              {col.map((item) => {
                const IconComponent = item.icon ? serviceIconMap[item.icon] : null;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleItemClick(item.path)}
                    className="w-full text-left group flex items-start gap-3 p-3 rounded-xl hover:bg-primary-light transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    role="menuitem"
                  >
                    {IconComponent && (
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-primary-light group-hover:bg-primary group-hover:text-white text-primary flex items-center justify-center transition-all duration-150 mt-0.5">
                        <IconComponent size={15} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-tristarc-text-primary group-hover:text-primary leading-snug">
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="text-xs text-tristarc-text-muted mt-0.5 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-tristarc-border bg-tristarc-bg px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-tristarc-text-muted">Explore all our research and analytics services</span>
          <button
            onClick={() => handleItemClick('/services')}
            className="text-xs font-semibold text-primary hover:text-accent-orange transition-colors flex items-center gap-1 cursor-pointer"
          >
            View All Services →
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Courses Dropdown ────────────────────────────────────────
interface CoursesDropdownProps {
  items: NavItem['children'];
  onClose: () => void;
}

export const CoursesDropdown: React.FC<CoursesDropdownProps> = ({ items, onClose }) => {
  const navigate = useNavigate();
  if (!items) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={dropdownVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-[520px] max-w-[96vw] bg-white rounded-2xl shadow-mega border border-tristarc-border z-50 overflow-hidden origin-top"
        role="menu"
        aria-label="Courses menu"
      >
        <div className="bg-gradient-to-r from-primary-dark to-primary px-5 py-3.5">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-4 bg-accent-orange rounded-full" />
            Our Courses
          </h3>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {items.map((item) => {
            const IconComponent = item.icon ? courseIconMap[item.icon] : null;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); onClose(); }}
                className="text-left group p-4 rounded-xl border border-tristarc-border hover:border-primary hover:shadow-card bg-tristarc-bg hover:bg-primary-light transition-all duration-200 cursor-pointer"
                role="menuitem"
              >
                {IconComponent && (
                  <div className="w-10 h-10 rounded-xl bg-primary-light group-hover:bg-primary text-primary group-hover:text-white flex items-center justify-center mb-3 transition-all duration-200">
                    <IconComponent size={20} />
                  </div>
                )}
                <p className="text-sm font-semibold text-tristarc-text-primary group-hover:text-primary mb-1">
                  {item.label}
                </p>
                {item.description && (
                  <p className="text-xs text-tristarc-text-muted leading-relaxed">
                    {item.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
        <div className="border-t border-tristarc-border bg-tristarc-bg px-5 py-2.5 text-right">
          <button
            onClick={() => { navigate('/courses'); onClose(); }}
            className="text-xs font-semibold text-primary hover:text-accent-orange transition-colors cursor-pointer"
          >
            View All Courses →
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Navigation ─────────────────────────────────────────
interface MainNavProps {
  isScrolled: boolean;
  onMobileMenuOpen: () => void;
}

export const MainNav: React.FC<MainNavProps> = ({ isScrolled, onMobileMenuOpen }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => setOpenMenu(null), []);

  useClickOutside(navRef as React.RefObject<HTMLElement>, closeMenu);

  // Close on route change
  React.useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  // Keyboard escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closeMenu]);

  const isActive = (path?: string) => path && location.pathname === path;
  const isChildActive = (children?: NavItem['children']) =>
    children?.some((c) => location.pathname.startsWith(c.path.split('/:')[0]));

  return (
    <nav
      ref={navRef}
      className={`bg-primary-dark transition-shadow duration-300 ${isScrolled ? 'shadow-nav' : ''}`}
      aria-label="Main navigation"
    >
      <div className="container-main">
        <div className="flex items-center justify-between lg:justify-center relative min-h-[60px]">
          {/* Desktop Nav Items Centered */}
          <ul className="hidden lg:flex items-center justify-center gap-4 xl:gap-10 mx-auto" role="list">
            {navigation.map((item: NavItem) => {
              const hasChildren = !!item.children?.length;
              const active = isActive(item.path) || isChildActive(item.children);
              const isOpen = openMenu === item.label;

              return (
                <li key={item.label} className="relative" role="none">
                  {hasChildren ? (
                    <button
                      onClick={() => setOpenMenu(isOpen ? null : item.label)}
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      className={`flex items-center gap-1.5 px-4 py-4 text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 relative group cursor-pointer
                        ${active || isOpen ? 'text-white' : 'text-white/80 hover:text-white'}`}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                      {/* Active underline */}
                      <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-accent-orange transition-all duration-200 ${active || isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`} />
                    </button>
                  ) : (
                    <Link
                      to={item.path!}
                      className={`flex items-center px-4 py-4 text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 relative group
                        ${active ? 'text-white' : 'text-white/80 hover:text-white'}`}
                    >
                      {item.label}
                      <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-accent-orange transition-all duration-200 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`} />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Centered Screen Overlay Dropdown Menus */}
          {openMenu && (
            <div className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 z-50 pt-2">
              {openMenu === 'Services' && (
                <ServicesMegaMenu
                  items={navigation.find((n) => n.label === 'Services')?.children}
                  onClose={closeMenu}
                />
              )}
              {openMenu === 'Courses' && (
                <CoursesDropdown
                  items={navigation.find((n) => n.label === 'Courses')?.children}
                  onClose={closeMenu}
                />
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="lg:hidden ml-auto p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg cursor-pointer"
            onClick={onMobileMenuOpen}
            aria-label="Open navigation menu"
            aria-expanded="false"
          >
            <span className="block w-5 h-0.5 bg-white mb-1.5 transition-all" />
            <span className="block w-5 h-0.5 bg-white mb-1.5" />
            <span className="block w-3.5 h-0.5 bg-white ml-1.5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
