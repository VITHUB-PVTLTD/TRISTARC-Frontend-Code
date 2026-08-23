import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, FileText, Bell, User, Mail, Phone, Calendar,
  ExternalLink, CheckCircle2, Clock, XCircle, AlertCircle,
  Briefcase, Edit3, X, Save, Sparkles, Check
} from 'lucide-react';
import { useAuth, getFullName } from '@/context/AuthContext';
import { userDashboardService } from '@/services/userDashboardService';
import type { Course, Resource, Notification } from '@/types';
import { Link } from 'react-router-dom';

// -- Status Badges ---------------------------------------------
const applicationStatusBadge = (status: string) => {
  const map: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
    PENDING: { cls: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock size={12} />, label: 'Pending Review' },
    REVIEWING: { cls: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Clock size={12} />, label: 'Under Review' },
    SHORTLISTED: { cls: 'bg-purple-100 text-purple-800 border-purple-200', icon: <Sparkles size={12} />, label: 'Shortlisted' },
    SELECTED: { cls: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle2 size={12} />, label: 'Selected' },
    HIRED: { cls: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle2 size={12} />, label: 'Hired' },
    REJECTED: { cls: 'bg-rose-100 text-rose-800 border-rose-200', icon: <XCircle size={12} />, label: 'Not Selected' },
  };
  const s = map[status] ?? { cls: 'bg-slate-100 text-slate-700 border-slate-200', icon: null, label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
};

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// -- Stat Card -------------------------------------------------
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgTint: string;
  delay?: number;
}> = ({ icon, label, value, color, bgTint, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay }}>
    <div className="bg-white rounded-2xl border border-tristarc-border shadow-card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgTint} shrink-0`} style={{ color }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-tristarc-text-muted">{label}</p>
        <p className="text-2xl font-extrabold text-tristarc-text-primary mt-0.5">{value}</p>
      </div>
    </div>
  </motion.div>
);

// -- Main User Dashboard Page ----------------------------------
export const DashboardPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [c, r, n, apps] = await Promise.all([
          userDashboardService.getPublicCourses(1, 6),
          userDashboardService.getPublicResources(1, 5),
          userDashboardService.getNotifications(),
          userDashboardService.getMyApplications(),
        ]);
        if (!mounted) return;
        setCourses(c.data ?? []);
        setResources(r.data ?? []);
        setNotifications(n ?? []);
        setApplications(apps ?? []);
      } catch {
        // Handled silently
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const openEditModal = () => {
    setEditForm({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      phone: user?.phone ?? '',
    });
    setSaveError('');
    setSaveSuccess('');
    setEditModalOpen(true);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.firstName.trim()) {
      setSaveError('First name is required.');
      return;
    }
    setSaveLoading(true);
    setSaveError('');
    try {
      await userDashboardService.updateProfile(editForm);
      await refreshUser();
      setSaveSuccess('Profile updated successfully!');
      setTimeout(() => {
        setEditModalOpen(false);
        setSaveSuccess('');
      }, 1000);
    } catch (err: any) {
      setSaveError(err?.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const activeNotifs = notifications.filter((n) => n.isActive !== false);

  return (
    <>
      <Helmet><title>My Dashboard | TRISTARC</title></Helmet>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl font-bold text-tristarc-text-primary">My Dashboard</h1>
            <p className="text-sm text-tristarc-text-muted mt-0.5">
              Welcome back, <span className="font-semibold text-primary">{getFullName(user)}</span>
            </p>
          </div>
          <button
            onClick={openEditModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark shadow-xs transition-all active:scale-95 self-start sm:self-auto"
          >
            <Edit3 size={15} /> Edit Profile
          </button>
        </div>

        {/* Top Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Briefcase size={22} />}
            label="My Job Applications"
            value={loading ? '—' : applications.length}
            color="#0891B2"
            bgTint="bg-cyan-50"
            delay={0}
          />
          <StatCard
            icon={<BookOpen size={22} />}
            label="Available Courses"
            value={loading ? '—' : courses.length}
            color="#154A8F"
            bgTint="bg-blue-50"
            delay={0.05}
          />
          <StatCard
            icon={<FileText size={22} />}
            label="E-Resources"
            value={loading ? '—' : resources.length}
            color="#F28C28"
            bgTint="bg-amber-50"
            delay={0.1}
          />
          <StatCard
            icon={<Bell size={22} />}
            label="Announcements"
            value={loading ? '—' : activeNotifs.length}
            color="#1E8A3A"
            bgTint="bg-emerald-50"
            delay={0.15}
          />
        </div>

        {/* Profile Card & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <div className="bg-white rounded-2xl border border-tristarc-border shadow-card p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl font-bold shadow-md shadow-primary/20">
                      {user ? (((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')).toUpperCase() || 'U') : 'U'}
                    </div>
                    <div>
                      <h2 className="font-bold text-tristarc-text-primary text-base">{getFullName(user)}</h2>
                      <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-primary border border-blue-100">
                        {user?.roles?.[0] ?? 'Member'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={openEditModal}
                    title="Edit Profile"
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-colors"
                  >
                    <Edit3 size={15} />
                  </button>
                </div>

                <div className="space-y-3.5 text-sm pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-tristarc-text-secondary">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                      <Mail size={14} />
                    </div>
                    <span className="truncate">{user?.email}</span>
                  </div>

                  <div className="flex items-center gap-3 text-tristarc-text-secondary">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-accent-orange flex items-center justify-center shrink-0">
                      <Phone size={14} />
                    </div>
                    <span>{user?.phone || 'Not provided'}</span>
                  </div>

                  {user?.createdAt && (
                    <div className="flex items-center gap-3 text-tristarc-text-secondary">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Calendar size={14} />
                      </div>
                      <span>Joined {fmt(user.createdAt)}</span>
                    </div>
                  )}

                  {user?.status && (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <User size={14} />
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
                        Account {user.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={openEditModal}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 size={13} /> Update Profile Information
                </button>
              </div>
            </div>
          </motion.div>

          {/* Announcements */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-tristarc-border shadow-card p-6 h-full flex flex-col">
              <h2 className="font-bold text-tristarc-text-primary mb-4 flex items-center gap-2">
                <Bell size={18} className="text-primary" /> Latest Announcements
              </h2>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-tristarc-bg rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : activeNotifs.length === 0 ? (
                <div className="text-center py-10 text-tristarc-text-muted flex-1 flex flex-col items-center justify-center">
                  <Bell size={28} className="text-slate-300 mb-2" />
                  <p>No active announcements at the moment.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto flex-1 pr-1">
                  {activeNotifs.slice(0, 8).map((n) => (
                    <div key={n.id} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary-light transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-tristarc-text-secondary leading-snug">{n.message}</p>
                        {n.link && (
                          <a href={n.link} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 mt-1">
                            Learn more <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                      {n.createdAt && <p className="text-xs text-tristarc-text-muted shrink-0 font-medium">{fmt(n.createdAt)}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* My Applications Section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-8">
          <div className="bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-tristarc-border bg-slate-50/60">
              <div>
                <h2 className="font-bold text-base text-tristarc-text-primary flex items-center gap-2">
                  <Briefcase size={18} className="text-primary" /> My Job Applications
                </h2>
                <p className="text-xs text-tristarc-text-muted mt-0.5">
                  Track candidate status for positions you have applied for at TRISTARC.
                </p>
              </div>
              <Link
                to="/careers"
                className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20"
              >
                Browse Openings <ExternalLink size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-3">
                  <Briefcase size={26} />
                </div>
                <h3 className="text-sm font-bold text-tristarc-text-primary mb-1">No Applications Submitted</h3>
                <p className="text-xs text-tristarc-text-muted max-w-sm mb-4">
                  You have not applied for any career positions yet. Browse open positions to join our team.
                </p>
                <Link
                  to="/careers"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors shadow-xs"
                >
                  Explore Careers
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3.5">Position / Job Title</th>
                      <th className="px-6 py-3.5">Applied Date</th>
                      <th className="px-6 py-3.5">Resume</th>
                      <th className="px-6 py-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-tristarc-text-primary">
                            {app.job?.title || 'Career Application'}
                          </p>
                          {app.job?.department && (
                            <p className="text-xs text-slate-500">{app.job.department}</p>
                          )}
                          {app.coverMessage && (
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 italic">
                              "{app.coverMessage}"
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-600 whitespace-nowrap">
                          {fmt(app.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {app.resumeUrl ? (
                            <button
                              onClick={() => {
                                if (app.resumeUrl?.startsWith('data:')) {
                                  try {
                                    const parts = app.resumeUrl.split(',');
                                    const byteCharacters = atob(parts[1]);
                                    const byteNumbers = new Array(byteCharacters.length);
                                    for (let i = 0; i < byteCharacters.length; i++) {
                                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                                    }
                                    const byteArray = new Uint8Array(byteNumbers);
                                    const blob = new Blob([byteArray], { type: 'application/pdf' });
                                    const fileURL = URL.createObjectURL(blob);
                                    window.open(fileURL, '_blank');
                                  } catch {
                                    window.open(app.resumeUrl, '_blank');
                                  }
                                } else {
                                  window.open(app.resumeUrl, '_blank');
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-primary text-xs font-bold hover:bg-blue-100 transition-colors"
                            >
                              <FileText size={13} /> View PDF
                            </button>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {applicationStatusBadge(app.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        {/* Available Courses Section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
          <div className="bg-white rounded-2xl border border-tristarc-border shadow-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-tristarc-text-primary flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" /> Recommended Courses
                </h2>
                <p className="text-xs text-tristarc-text-muted mt-0.5">
                  Expand your skills with our training programs and certifications.
                </p>
              </div>
              <Link to="/courses" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                Browse All <ExternalLink size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="h-28 bg-slate-50 rounded-xl animate-pulse" />)}
              </div>
            ) : courses.length === 0 ? (
              <p className="text-sm text-tristarc-text-muted text-center py-8">No courses published yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.slice(0, 6).map((c) => (
                  <Link
                    key={c.id}
                    to={`/courses/${c.slug}`}
                    className="block p-4 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all group bg-slate-50/40 hover:bg-white"
                  >
                    <p className="text-sm font-bold text-tristarc-text-primary group-hover:text-primary transition-colors line-clamp-1 mb-1">
                      {c.title}
                    </p>
                    <p className="text-xs text-tristarc-text-muted line-clamp-2 leading-relaxed mb-3">
                      {c.shortDescription || c.description || ''}
                    </p>
                    <div className="flex items-center gap-2">
                      {c.mode && <span className="badge-blue text-[10px]">{c.mode}</span>}
                      {c.level && <span className="badge-orange text-[10px]">{c.level}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => !saveLoading && setEditModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-base text-tristarc-text-primary flex items-center gap-2">
                  <Edit3 size={18} className="text-primary" /> Edit Profile Details
                </h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  disabled={saveLoading}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleProfileSave} className="p-6 space-y-4">
                {saveError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    <AlertCircle size={14} className="shrink-0" /> {saveError}
                  </div>
                )}
                {saveSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs">
                    <Check size={14} className="shrink-0" /> {saveSuccess}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      placeholder="e.g. John"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      placeholder="e.g. Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Email address cannot be changed.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    disabled={saveLoading}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
                  >
                    {saveLoading ? <Clock size={14} className="animate-spin" /> : <Save size={14} />}
                    {saveLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardPage;
