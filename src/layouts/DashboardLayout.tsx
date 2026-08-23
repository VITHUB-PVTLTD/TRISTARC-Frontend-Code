import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, BookOpen, Briefcase, MessageSquare,
  Bell, FileText, UserCheck, Settings, LogOut, Menu, X,
  ChevronRight, Home, Shield,
} from 'lucide-react';
import { useAuth, getFullName } from '@/context/AuthContext';
import { PageLoader } from '@/components/common/PageLoader';

// -- Nav Items -------------------------------------------------
interface NavItem { label: string; to: string; icon: React.ReactNode; }

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Admin Overview', to: '/admin', icon: <Shield size={18} /> },
  { label: 'Users', to: '/admin/users', icon: <Users size={18} /> },
  { label: 'Courses', to: '/admin/courses', icon: <BookOpen size={18} /> },
  { label: 'Jobs', to: '/admin/jobs', icon: <Briefcase size={18} /> },
  { label: 'Messages', to: '/admin/messages', icon: <MessageSquare size={18} /> },
  { label: 'Notifications', to: '/admin/notifications', icon: <Bell size={18} /> },
  { label: 'Resources', to: '/admin/resources', icon: <FileText size={18} /> },
  { label: 'Team', to: '/admin/team', icon: <UserCheck size={18} /> },
  { label: 'Site Settings', to: '/admin/settings', icon: <Settings size={18} /> },
];

const USER_NAV_ITEMS: NavItem[] = [
  { label: 'My Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Browse Courses', to: '/courses', icon: <BookOpen size={18} /> },
  { label: 'E-Resources', to: '/e-resources', icon: <FileText size={18} /> },
  { label: 'Contact Us', to: '/contact', icon: <MessageSquare size={18} /> },
];

// -- Sidebar ---------------------------------------------------
const Sidebar: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = isAdmin ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;
  const sectionLabel = isAdmin ? 'Administration' : 'My Account';

  return (
    <>
      {/* Overlay (mobile) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 flex flex-col
          bg-[#0D2545] text-white transition-transform duration-300
          lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <span className="text-lg font-bold tracking-wide">TRISTARC</span>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-accent-orange flex items-center justify-center font-bold text-sm mb-2">
            {user ? ((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')).toUpperCase() || 'U' : 'U'}
          </div>
          <p className="text-sm font-semibold truncate">{getFullName(user)}</p>
          <p className="text-xs text-white/50 truncate">{user?.email}</p>
          {isAdmin ? (
            <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-orange/20 text-accent-orange text-xs font-medium">
              <Shield size={10} /> Admin
            </span>
          ) : (
            <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium">
              Member
            </span>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/30">{sectionLabel}</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin' || item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5
                 ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'}`
              }
              onClick={onClose}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 py-3 border-t border-white/10 space-y-1">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:bg-white/8 hover:text-white transition-all"
          >
            <Home size={18} /> Public Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

// -- Topbar ----------------------------------------------------
const Topbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const location = useLocation();
  const { user } = useAuth();

  const routeTitles: Record<string, string> = {
    '/dashboard': 'My Dashboard',
    '/admin': 'Admin Overview',
    '/admin/users': 'User Management',
    '/admin/courses': 'Course Management',
    '/admin/jobs': 'Job Management',
    '/admin/messages': 'Contact Messages',
    '/admin/notifications': 'Notifications',
    '/admin/resources': 'E-Resources',
    '/admin/team': 'Team Members',
    '/admin/settings': 'Site Settings',
  };// Build breadcrumb from pathname
  const parts = location.pathname.split('/').filter(Boolean);
  const crumbs = parts.map((p, i) => ({
    label: p.charAt(0).toUpperCase() + p.slice(1),
    path: '/' + parts.slice(0, i + 1).join('/'),
  }));

  return (
    <header className="h-14 bg-white border-b border-tristarc-border flex items-center px-4 gap-4 sticky top-0 z-20">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-tristarc-text-muted hover:text-tristarc-text-primary transition-colors"
      >
        <Menu size={22} />
      </button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm flex-1 min-w-0">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb.path}>
            {i > 0 && <ChevronRight size={14} className="text-tristarc-text-muted shrink-0" />}
            <span className={`truncate ${i === crumbs.length - 1 ? 'text-tristarc-text-primary font-semibold' : 'text-tristarc-text-muted'}`}>
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* User pill */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:block text-right">
          <p className="text-xs font-semibold text-tristarc-text-primary">{getFullName(user)}</p>
          <p className="text-xs text-tristarc-text-muted">{user?.email}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
          {user ? ((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')).toUpperCase() || 'U' : 'U'}
        </div>
      </div>
    </header>
  );
};

// -- Layout ----------------------------------------------------
const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <PageLoader fullScreen message="Loading Dashboard..." submessage="Verifying your credentials..." />;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-tristarc-bg flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main content � offset by sidebar on desktop */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

