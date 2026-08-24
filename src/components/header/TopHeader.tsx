import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getFullName } from '@/context/AuthContext';

interface TopHeaderProps {
  logoSrc?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  // IMPORTANT: must be an absolute path starting with '/' so it works in
  // both local dev AND the production build served from Hostinger.
  // 'src/assets/logo.jpeg' is a dev-only relative path — never use it here.
  logoSrc = '/images/tristarc-logo.png',
}) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  const initials = user
    ? (user.firstName[0] + (user.lastName?.[0] ?? '')).toUpperCase()
    : 'U';

  return (
    <div className="bg-white border-b border-tristarc-border">
      <div className="container-main">

        {/* ── Desktop Layout (sm and above) ───────────────────────────────── */}
        <div className="hidden sm:flex items-center justify-between py-3 gap-4">
          {/* LEFT — Logo */}
          <Link
            to="/"
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            aria-label="TRISTARC — Home"
          >
            <img
              src={logoSrc}
              alt="TRISTARC Logo"
              className="h-16 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </Link>

          {/* CENTER — Institute Name */}
          <div className="flex-1 text-center">
            <h1 className="text-primary-dark font-bold text-sm sm:text-base lg:text-lg xl:text-xl leading-tight tracking-tight">
              TIRUPATI RAO INSTITUTE OF STATISTICAL
            </h1>
            <p className="text-primary font-semibold text-xs sm:text-sm lg:text-base leading-tight">
              TRAINING, ANALYTICS, RESEARCH &amp; CONSULTANCY
            </p>
          </div>

          {/* RIGHT — Auth Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  id="header-login-btn"
                  className="btn-primary btn-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  id="header-signup-btn"
                  className="btn-accent btn-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  id="header-user-btn"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-primary-light hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {initials}
                  </div>
                  <span className="text-sm font-semibold text-tristarc-text-primary max-w-[120px] truncate">
                    {getFullName(user)}
                  </span>
                  {isAdmin && (
                    <Shield size={12} className="text-accent-orange shrink-0" />
                  )}
                  <ChevronDown
                    size={14}
                    className={`text-tristarc-text-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-mega border border-tristarc-border z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-primary-light border-b border-tristarc-border">
                        <p className="text-sm font-bold text-tristarc-text-primary truncate">
                          {getFullName(user)}
                        </p>
                        <p className="text-xs text-tristarc-text-muted truncate">{user?.email}</p>
                        {isAdmin && (
                          <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-orange/15 text-accent-orange text-xs font-semibold">
                            <Shield size={10} /> Admin
                          </span>
                        )}
                      </div>
                      <div className="py-1.5">
                        {isAdmin ? (
                          <Link
                            to="/admin"
                            id="header-admin-link"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-tristarc-text-secondary hover:bg-primary-light hover:text-primary transition-colors"
                          >
                            <Shield size={15} className="text-accent-orange" />
                            Admin Overview
                          </Link>
                        ) : (
                          <Link
                            to="/dashboard"
                            id="header-dashboard-link"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-tristarc-text-secondary hover:bg-primary-light hover:text-primary transition-colors"
                          >
                            <LayoutDashboard size={15} className="text-primary" />
                            My Dashboard
                          </Link>
                        )}
                        <button
                          id="header-logout-btn"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile Layout (below sm) ─────────────────────────────────────── */}
        <div className="flex sm:hidden items-center justify-between py-2 gap-3">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            aria-label="TRISTARC — Home"
          >
            <img
              src={logoSrc}
              alt="TRISTARC Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </Link>

          {/* Institute Name — centered */}
          <div className="flex-1 text-center min-w-0">
            <p className="text-primary-dark font-bold text-[10px] leading-tight tracking-tight truncate">
              TIRUPATI RAO INSTITUTE OF STATISTICAL
            </p>
            <p className="text-primary font-semibold text-[9px] leading-tight truncate">
              TRAINING, ANALYTICS, RESEARCH &amp; CONSULTANCY
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
