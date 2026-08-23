import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronRight, LogIn, UserPlus, LayoutDashboard, Shield, LogOut } from 'lucide-react';
import { navigation } from '@/data/navigation';
import type { NavItem } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getFullName } from '@/context/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const drawerVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'tween' as const, duration: 0.28, ease: 'easeOut' as const } },
  exit: { x: '100%', opacity: 0, transition: { type: 'tween' as const, duration: 0.22, ease: 'easeIn' as const } },
};

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  React.useEffect(() => {
    onClose();
  }, [location.pathname]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/');
  };

  const initials = user
    ? (user.firstName[0] + (user.lastName?.[0] ?? '')).toUpperCase()
    : 'U';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-primary-dark z-50 lg:hidden flex flex-col shadow-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <p className="text-white font-bold text-sm">TRISTARC</p>
                <p className="text-white/50 text-xs">Navigation Menu</p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto py-4" aria-label="Mobile navigation">
              <ul className="space-y-0.5 px-3">
                {navigation.map((item: NavItem) => {
                  const hasChildren = !!item.children?.length;
                  const isExpanded = expandedMenu === item.label;

                  return (
                    <li key={item.label}>
                      {hasChildren ? (
                        <>
                          <button
                            onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                            className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-white/85 hover:text-white hover:bg-white/10 transition-all duration-150 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            aria-expanded={isExpanded}
                          >
                            <span>{item.label}</span>
                            <ChevronDown
                              size={16}
                              className={`transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.ul
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden ml-2"
                              >
                                {item.children?.map((child) => (
                                  <li key={child.path}>
                                    <Link
                                      to={child.path}
                                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 group"
                                    >
                                      <ChevronRight size={12} className="text-accent-orange shrink-0" />
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                                <li>
                                  <Link
                                    to={`/${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-accent-orange hover:text-white hover:bg-white/10 transition-all text-xs font-semibold focus-visible:outline-none"
                                  >
                                    View All {item.label} →
                                  </Link>
                                </li>
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          to={item.path!}
                          className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                            ${location.pathname === item.path ? 'bg-white/15 text-white' : 'text-white/85 hover:text-white hover:bg-white/10'}`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Auth Section */}
            <div className="p-4 border-t border-white/10 space-y-2">
              {!isAuthenticated ? (
                /* Guest */
                <>
                  <Link
                    to="/login"
                    id="mobile-login-btn"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    id="mobile-signup-btn"
                    onClick={onClose}
                    className="btn-accent btn-md w-full justify-center"
                  >
                    <UserPlus size={16} />
                    Sign Up
                  </Link>
                </>
              ) : (
                /* Authenticated */
                <>
                  {/* User info */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 mb-1">
                    <div className="w-9 h-9 rounded-full bg-accent-orange flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{getFullName(user)}</p>
                      <p className="text-xs text-white/50 truncate">{user?.email}</p>
                    </div>
                  </div>

                  {isAdmin ? (
                    <Link
                      to="/admin"
                      id="mobile-admin-link"
                      onClick={onClose}
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-accent-orange/15 text-accent-orange text-sm font-semibold hover:bg-accent-orange/25 transition-colors"
                    >
                      <Shield size={16} />
                      Admin Overview
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      id="mobile-dashboard-link"
                      onClick={onClose}
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-primary/20 text-white text-sm font-semibold hover:bg-primary/30 transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      My Dashboard
                    </Link>
                  )}

                  <button
                    id="mobile-logout-btn"
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-red-300 text-sm font-semibold hover:bg-red-500/15 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
