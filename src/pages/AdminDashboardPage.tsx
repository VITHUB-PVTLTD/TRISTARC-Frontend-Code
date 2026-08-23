import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, BookOpen, Briefcase, MessageSquare, Bell, FileText,
  Clock, AlertTriangle, ArrowRight, UserCheck, FolderOpen,
  TrendingUp, Shield, Activity, ExternalLink
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { AdminStats, ContactMessage, JobApplication } from '@/types';

// -- KPI Card Component -----------------------------------------
interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
  badgeText?: string;
  badgeColor?: string;
  bgGradient: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  to: string;
  delay?: number;
}

const KpiCard: React.FC<KpiCardProps> = ({
  icon,
  label,
  value,
  sub,
  badgeText,
  badgeColor = 'bg-slate-100 text-slate-700',
  bgGradient,
  iconBg,
  iconColor,
  borderColor,
  to,
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    className="h-full"
  >
    <Link
      to={to}
      className={`group block h-full bg-white rounded-2xl border ${borderColor} shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden relative p-5 flex flex-col justify-between hover:-translate-y-0.5`}
    >
      {/* Subtle top gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${bgGradient}`} />

      {/* Card Header: Icon & Top Action */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105 shrink-0`}>
            {icon}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-tristarc-text-muted group-hover:text-primary transition-colors">
            {badgeText && (
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${badgeColor}`}>
                {badgeText}
              </span>
            )}
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 text-slate-400 group-hover:text-primary" />
          </div>
        </div>

        {/* Metric Label & Count */}
        <p className="text-xs font-bold uppercase tracking-wider text-tristarc-text-muted mb-1">
          {label}
        </p>
        <p className="text-3xl font-extrabold text-tristarc-text-primary tracking-tight">
          {value}
        </p>
      </div>

      {/* Card Footer: Subtitle */}
      {sub && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center text-xs text-tristarc-text-secondary font-medium">
          <span>{sub}</span>
        </div>
      )}
    </Link>
  </motion.div>
);

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    READ: 'bg-gray-100 text-gray-600',
    RESPONDED: 'bg-green-100 text-green-700',
    ARCHIVED: 'bg-gray-100 text-gray-500',
    PENDING: 'bg-amber-100 text-amber-700',
    REVIEWING: 'bg-blue-100 text-blue-700',
    SHORTLISTED: 'bg-purple-100 text-purple-700',
    REJECTED: 'bg-red-100 text-red-700',
    HIRED: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// -- Admin Dashboard Page ---------------------------------------
export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [s, m, a] = await Promise.all([
          adminService.getStats(),
          adminService.getMessages(1, 5),
          adminService.getApplications(1, 5),
        ]);
        if (!mounted) return;
        setStats(s);
        setMessages(m.data ?? []);
        setApplications(a.data ?? []);
      } catch (e: any) {
        if (mounted) setError(e?.response?.data?.message ?? 'Failed to load dashboard statistics.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const kpiItems: KpiCardProps[] = stats
    ? [
        {
          icon: <Users size={22} />,
          label: 'Total Users',
          value: stats.totalUsers,
          sub: 'Registered platform users',
          bgGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600',
          iconBg: 'bg-blue-50',
          iconColor: 'text-blue-700',
          borderColor: 'border-slate-200 hover:border-blue-300',
          to: '/admin/users',
        },
        {
          icon: <BookOpen size={22} />,
          label: 'Published Courses',
          value: stats.publishedCourses,
          sub: `${stats.totalCourses} total curriculum courses`,
          badgeText: `${stats.totalCourses} Total`,
          badgeColor: 'bg-emerald-50 text-emerald-700',
          bgGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-700',
          borderColor: 'border-slate-200 hover:border-emerald-300',
          to: '/admin/courses',
        },
        {
          icon: <Clock size={22} />,
          label: 'Pending Registrations',
          value: stats.pendingRegistrations,
          sub: 'Student batch enrollments awaiting review',
          badgeText: stats.pendingRegistrations > 0 ? 'Requires Action' : 'All Clear',
          badgeColor: stats.pendingRegistrations > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600',
          bgGradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
          iconBg: 'bg-amber-50',
          iconColor: 'text-amber-700',
          borderColor: 'border-slate-200 hover:border-amber-300',
          to: '/admin/courses',
        },
        {
          icon: <Briefcase size={22} />,
          label: 'Active Careers / Jobs',
          value: stats.activeJobs,
          sub: `${stats.totalJobs} total career positions`,
          badgeText: `${stats.activeJobs} Open`,
          badgeColor: 'bg-purple-50 text-purple-700',
          bgGradient: 'bg-gradient-to-r from-purple-500 to-violet-600',
          iconBg: 'bg-purple-50',
          iconColor: 'text-purple-700',
          borderColor: 'border-slate-200 hover:border-purple-300',
          to: '/admin/jobs',
        },
        {
          icon: <FileText size={22} />,
          label: 'Job Applications',
          value: stats.totalApplications,
          sub: 'Candidate submissions received',
          bgGradient: 'bg-gradient-to-r from-cyan-500 to-sky-600',
          iconBg: 'bg-cyan-50',
          iconColor: 'text-cyan-700',
          borderColor: 'border-slate-200 hover:border-cyan-300',
          to: '/admin/jobs',
        },
        {
          icon: <MessageSquare size={22} />,
          label: 'New Inquiries',
          value: stats.unreadMessages,
          sub: `${stats.totalMessages} total contact messages`,
          badgeText: stats.unreadMessages > 0 ? `${stats.unreadMessages} New` : 'Caught Up',
          badgeColor: stats.unreadMessages > 0 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600',
          bgGradient: 'bg-gradient-to-r from-rose-500 to-red-600',
          iconBg: 'bg-rose-50',
          iconColor: 'text-rose-700',
          borderColor: 'border-slate-200 hover:border-rose-300',
          to: '/admin/messages',
        },
        {
          icon: <FolderOpen size={22} />,
          label: 'E-Resources',
          value: stats.totalResources ?? '—',
          sub: 'Digital documents & publications',
          bgGradient: 'bg-gradient-to-r from-indigo-500 to-blue-600',
          iconBg: 'bg-indigo-50',
          iconColor: 'text-indigo-700',
          borderColor: 'border-slate-200 hover:border-indigo-300',
          to: '/admin/resources',
        },
        {
          icon: <UserCheck size={22} />,
          label: 'Team Members',
          value: stats.totalTeamMembers ?? '—',
          sub: 'Active faculty, trainers & staff',
          bgGradient: 'bg-gradient-to-r from-teal-500 to-emerald-600',
          iconBg: 'bg-teal-50',
          iconColor: 'text-teal-700',
          borderColor: 'border-slate-200 hover:border-teal-300',
          to: '/admin/team',
        },
      ]
    : [];

  return (
    <>
      <Helmet><title>Admin Overview | TRISTARC</title></Helmet>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl font-bold text-tristarc-text-primary flex items-center gap-2.5">
              <Shield size={24} className="text-primary" /> Admin Overview
            </h1>
            <p className="text-sm text-tristarc-text-muted mt-0.5">
              Real-time platform metrics, recent user inquiries, and management shortcuts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live System Status
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm shadow-xs">
            <AlertTriangle size={16} className="shrink-0" /> {error}
          </div>
        )}

        {/* 8-Card Uniform KPI Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-tristarc-text-muted flex items-center gap-1.5">
              <Activity size={14} className="text-primary" /> Key Performance Indicators
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 bg-white rounded-2xl border border-tristarc-border animate-pulse p-5 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center">
                    <div className="w-11 h-11 bg-slate-100 rounded-xl" />
                    <div className="w-12 h-4 bg-slate-100 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-20 h-3 bg-slate-100 rounded" />
                    <div className="w-14 h-7 bg-slate-100 rounded" />
                  </div>
                  <div className="w-28 h-2 bg-slate-100 rounded mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {kpiItems.map((k, i) => (
                <KpiCard key={k.label} {...k} delay={i * 0.03} />
              ))}
            </div>
          )}
        </div>

        {/* Tables Section: Messages & Job Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Messages */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden h-full flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-tristarc-border bg-slate-50/50">
                <h2 className="font-bold text-sm text-tristarc-text-primary flex items-center gap-2">
                  <MessageSquare size={16} className="text-primary" /> Recent Inquiries
                </h2>
                <Link
                  to="/admin/messages"
                  className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                >
                  View All <ArrowRight size={13} />
                </Link>
              </div>

              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-sm text-tristarc-text-muted flex-1 flex flex-col items-center justify-center">
                  <MessageSquare size={28} className="text-slate-300 mb-2" />
                  <p>No contact messages yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-tristarc-border flex-1">
                  {messages.map((m) => (
                    <div key={m.id} className="px-5 py-3.5 flex items-center gap-3.5 hover:bg-slate-50/70 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {m.fullName?.[0]?.toUpperCase() || 'M'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-tristarc-text-primary truncate">{m.fullName}</p>
                        <p className="text-xs text-tristarc-text-muted truncate">{m.subject || m.message}</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {statusBadge(m.status)}
                        <span className="text-[11px] text-tristarc-text-muted">{fmt(m.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Applications */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden h-full flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-tristarc-border bg-slate-50/50">
                <h2 className="font-bold text-sm text-tristarc-text-primary flex items-center gap-2">
                  <Briefcase size={16} className="text-primary" /> Recent Applications
                </h2>
                <Link
                  to="/admin/jobs"
                  className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                >
                  View All <ArrowRight size={13} />
                </Link>
              </div>

              {loading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="p-8 text-center text-sm text-tristarc-text-muted flex-1 flex flex-col items-center justify-center">
                  <Briefcase size={28} className="text-slate-300 mb-2" />
                  <p>No job applications received yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-tristarc-border flex-1">
                  {applications.map((a) => (
                    <div key={a.id} className="px-5 py-3.5 flex items-center gap-3.5 hover:bg-slate-50/70 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-cyan-50 text-cyan-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {a.fullName?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-tristarc-text-primary truncate">{a.fullName}</p>
                        <p className="text-xs text-tristarc-text-muted truncate">{a.job?.title || 'General Application'}</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {statusBadge(a.status)}
                        <span className="text-[11px] text-tristarc-text-muted">{fmt(a.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Management Shortcuts */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="bg-white rounded-2xl border border-tristarc-border shadow-card p-6">
            <h2 className="font-bold text-sm text-tristarc-text-primary mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" /> Management Shortcuts
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {[
                { label: 'Users', to: '/admin/users', icon: <Users size={18} />, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                { label: 'Courses', to: '/admin/courses', icon: <BookOpen size={18} />, color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
                { label: 'Careers', to: '/admin/jobs', icon: <Briefcase size={18} />, color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                { label: 'Messages', to: '/admin/messages', icon: <MessageSquare size={18} />, color: 'bg-rose-50 text-rose-700 hover:bg-rose-100' },
                { label: 'Resources', to: '/admin/resources', icon: <FolderOpen size={18} />, color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
                { label: 'Team', to: '/admin/team', icon: <UserCheck size={18} />, color: 'bg-teal-50 text-teal-700 hover:bg-teal-100' },
              ].map(({ label, to, icon, color }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border border-slate-200 hover:border-transparent hover:shadow-md transition-all duration-200 group text-center"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} transition-transform duration-200 group-hover:scale-110`}>
                    {icon}
                  </div>
                  <span className="text-xs font-bold text-tristarc-text-secondary group-hover:text-primary transition-colors">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default AdminDashboardPage;
