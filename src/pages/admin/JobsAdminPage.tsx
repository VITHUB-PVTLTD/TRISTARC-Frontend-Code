import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Plus, Trash2, RefreshCw, Edit2, Save, X, AlertTriangle,
  CheckCircle, ChevronLeft, ChevronRight, Users, Eye, FileText, Download,
  ExternalLink, Phone, Mail, Calendar
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { Job, JobApplication, PaginatedResponse } from '@/types';

const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

const APP_STATUS = ['PENDING', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED'];
const APP_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  REVIEWING: 'bg-blue-100 text-blue-800 border-blue-200',
  SHORTLISTED: 'bg-purple-100 text-purple-800 border-purple-200',
  REJECTED: 'bg-red-100 text-red-800 border-red-200',
  HIRED: 'bg-green-100 text-green-800 border-green-200',
};

const emptyForm = (): Partial<Job> => ({
  title: '',
  department: '',
  location: '',
  employmentType: 'FULL_TIME' as any,
  experience: '',
  description: '',
  requirements: '',
  responsibilities: '',
  deadline: '',
  isActive: true,
});

export const JobsAdminPage: React.FC = () => {
  const [tab, setTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<PaginatedResponse<Job> | null>(null);
  const [apps, setApps] = useState<PaginatedResponse<JobApplication> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Job | null>(null);
  const [form, setForm] = useState<Partial<Job>>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Application details modal state
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  const loadJobs = useCallback(async (p = page) => {
    setLoading(true);
    setError('');
    try {
      setJobs(await adminService.getJobs(p, 10));
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [page]);

  const loadApps = useCallback(async (p = page) => {
    setLoading(true);
    setError('');
    try {
      setApps(await adminService.getApplications(p, 15));
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    tab === 'jobs' ? loadJobs(page) : loadApps(page);
  }, [tab, page, loadJobs, loadApps]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (j: Job) => {
    setEditTarget(j);
    setForm({
      title: j.title,
      department: j.department ?? '',
      location: j.location ?? '',
      employmentType: (j.employmentType ?? 'FULL_TIME') as any,
      experience: j.experience ?? '',
      description: j.description ?? '',
      requirements:
        typeof j.requirements === 'string'
          ? j.requirements
          : Array.isArray(j.requirements)
          ? (j.requirements as string[]).join('\n')
          : '',
      responsibilities:
        typeof j.responsibilities === 'string'
          ? j.responsibilities
          : Array.isArray(j.responsibilities)
          ? (j.responsibilities as string[]).join('\n')
          : '',
      deadline: j.deadline ? j.deadline.substring(0, 10) : '',
      isActive: j.isActive ?? true,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
  };

  const handleSave = async () => {
    if (!form.title?.trim()) {
      setError('Job title is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editTarget) {
        await adminService.updateJob(editTarget.id, form);
        setSuccess('Job updated successfully');
      } else {
        await adminService.createJob(form);
        setSuccess('Job created successfully');
      }
      closeForm();
      await loadJobs(page);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to save job');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job listing?')) return;
    setDeletingId(id);
    try {
      await adminService.deleteJob(id);
      await loadJobs(page);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAppStatus = async (id: string, status: string) => {
    try {
      await adminService.updateApplicationStatus(id, status);
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status: status as any });
      }
      await loadApps(page);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to update application status');
    }
  };

  const openOrDownloadResume = (resumeUrl: string, applicantName: string) => {
    if (resumeUrl.startsWith('data:')) {
      try {
        const parts = resumeUrl.split(',');
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
        const blob = new Blob([byteArray], { type: mime });
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      } catch {
        window.open(resumeUrl, '_blank');
      }
    } else {
      window.open(resumeUrl, '_blank');
    }
  };

  const totalPages =
    tab === 'jobs'
      ? jobs?.pagination?.totalPages ?? 1
      : apps?.pagination?.totalPages ?? 1;

  return (
    <>
      <Helmet><title>Jobs &amp; Careers | Admin | TRISTARC</title></Helmet>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-tristarc-text-primary flex items-center gap-2">
              <Briefcase size={22} className="text-primary" /> Careers &amp; Applications
            </h1>
            <p className="text-sm text-tristarc-text-muted mt-0.5">
              {jobs?.pagination?.total ?? 0} job listings &middot; {apps?.pagination?.total ?? 0} candidate applications
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => (tab === 'jobs' ? loadJobs(page) : loadApps(page))}
              className="btn-secondary btn-sm"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            {tab === 'jobs' && (
              <button onClick={openCreate} className="btn-primary btn-sm flex items-center gap-2">
                <Plus size={14} /> New Job
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            <AlertTriangle size={14} className="shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm">
            <CheckCircle size={14} className="shrink-0" /> {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-tristarc-bg rounded-xl p-1 w-fit mb-5">
          {(['jobs', 'applications'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                tab === t
                  ? 'bg-white shadow-sm text-primary'
                  : 'text-tristarc-text-muted hover:text-tristarc-text-primary'
              }`}
            >
              {t === 'jobs' ? (
                <span className="flex items-center gap-1.5">
                  <Briefcase size={14} /> Job Listings
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Users size={14} /> Candidate Applications ({apps?.pagination?.total ?? 0})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Create/Edit Job Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="bg-white rounded-2xl border border-primary/30 shadow-card p-6 mb-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-tristarc-text-primary">
                  {editTarget ? 'Edit Job Opening' : 'Create Job Opening'}
                </h2>
                <button onClick={closeForm}>
                  <X size={18} className="text-tristarc-text-muted hover:text-tristarc-text-primary" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Senior Research Analyst"
                    value={form.title ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Social Research &amp; Evaluation"
                    value={form.department ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Tirupati / Remote / Hybrid"
                    value={form.location ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Employment Type</label>
                  <select
                    className="form-input"
                    value={form.employmentType ?? 'FULL_TIME'}
                    onChange={(e) => setForm((f) => ({ ...f, employmentType: e.target.value as any }))}
                  >
                    {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'].map((t) => (
                      <option key={t} value={t}>
                        {t.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Experience Required</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2-4 years"
                    value={form.experience ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Application Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.deadline ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-2 self-end pb-2">
                  <input
                    type="checkbox"
                    id="act"
                    checked={!!form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <label htmlFor="act" className="text-sm font-medium text-tristarc-text-primary">
                    Active (Accepting applications on public site)
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Job Description</label>
                  <textarea
                    rows={3}
                    className="form-input resize-y"
                    placeholder="Overview of the position..."
                    value={form.description ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Responsibilities</label>
                  <textarea
                    rows={3}
                    className="form-input resize-y"
                    placeholder="Key responsibilities and duties..."
                    value={form.responsibilities ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, responsibilities: e.target.value }))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Requirements &amp; Qualifications</label>
                  <textarea
                    rows={3}
                    className="form-input resize-y"
                    placeholder="Required skills, degree, background..."
                    value={form.requirements ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary btn-sm flex items-center gap-2"
                >
                  {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  {editTarget ? 'Update Job' : 'Create Job'}
                </button>
                <button onClick={closeForm} className="btn-ghost btn-sm">
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jobs table */}
        {tab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-tristarc-bg border-b border-tristarc-border">
                  <tr>
                    {['Title', 'Department', 'Location', 'Type', 'Deadline', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-tristarc-text-muted uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-tristarc-border">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={7} className="px-4 py-3">
                          <div className="h-8 bg-tristarc-bg rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : (jobs?.data ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-tristarc-text-muted">
                        No job listings found.{' '}
                        <button onClick={openCreate} className="text-primary font-semibold hover:underline">
                          Create one
                        </button>
                      </td>
                    </tr>
                  ) : (
                    (jobs?.data ?? []).map((j) => (
                      <tr key={j.id} className="hover:bg-tristarc-bg/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-tristarc-text-primary">{j.title}</td>
                        <td className="px-4 py-3 text-tristarc-text-secondary">{j.department ?? '—'}</td>
                        <td className="px-4 py-3 text-tristarc-text-secondary">{j.location ?? '—'}</td>
                        <td className="px-4 py-3 text-tristarc-text-secondary">{(j.employmentType ?? '').replace('_', ' ')}</td>
                        <td className="px-4 py-3 text-tristarc-text-secondary">{fmt(j.deadline)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              j.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {j.isActive ? 'Active' : 'Closed'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEdit(j)}
                              className="p-1.5 rounded-lg hover:bg-primary-light text-tristarc-text-muted hover:text-primary transition-all"
                              title="Edit Job"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(j.id)}
                              disabled={deletingId === j.id}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-tristarc-text-muted hover:text-red-600 transition-all"
                              title="Delete Job"
                            >
                              {deletingId === j.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-tristarc-border">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary btn-sm disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-sm text-tristarc-text-muted">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="btn-secondary btn-sm disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Applications table */}
        {tab === 'applications' && (
          <div className="bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-tristarc-bg border-b border-tristarc-border">
                  <tr>
                    {['Applicant', 'Job Title', 'Contact Info', 'Resume (PDF)', 'Applied Date', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-tristarc-text-muted uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-tristarc-border">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={7} className="px-4 py-3">
                          <div className="h-8 bg-tristarc-bg rounded animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : (apps?.data ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-tristarc-text-muted">
                        No candidate applications received yet.
                      </td>
                    </tr>
                  ) : (
                    (apps?.data ?? []).map((a) => (
                      <tr key={a.id} className="hover:bg-tristarc-bg/50 transition-colors">
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <p className="font-bold text-tristarc-text-primary">{a.fullName}</p>
                        </td>
                        <td className="px-4 py-3.5 text-tristarc-text-secondary">
                          <p className="font-semibold text-xs">{a.job?.title ?? 'General Position'}</p>
                          {a.job?.department && <p className="text-[11px] text-slate-400">{a.job.department}</p>}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-tristarc-text-secondary">
                          <p className="font-medium">{a.email}</p>
                          {a.phone && <p className="text-slate-400">{a.phone}</p>}
                        </td>
                        <td className="px-4 py-3.5">
                          {a.resumeUrl ? (
                            <button
                              onClick={() => openOrDownloadResume(a.resumeUrl!, a.fullName)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                            >
                              <FileText size={13} /> View Resume
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">No file</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-tristarc-text-muted whitespace-nowrap">
                          {fmt(a.createdAt)}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <select
                            value={a.status}
                            onChange={(e) => handleAppStatus(a.id, e.target.value)}
                            className={`text-xs font-bold border rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary ${
                              APP_COLORS[a.status] || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {APP_STATUS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedApp(a)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-slate-100"
                            title="View Full Application"
                          >
                            <Eye size={15} /> Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-tristarc-border">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary btn-sm disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-sm text-tristarc-text-muted">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="btn-secondary btn-sm disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Application Details Modal */}
        <AnimatePresence>
          {selectedApp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                onClick={() => setSelectedApp(null)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                  <div>
                    <h3 className="font-bold text-base text-tristarc-text-primary">
                      Application Details
                    </h3>
                    <p className="text-xs text-primary font-semibold">
                      {selectedApp.job?.title || 'Job Application'}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Applicant Name</p>
                      <p className="font-bold text-slate-800 text-base">{selectedApp.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Application Date</p>
                      <p className="font-medium text-slate-700">{fmt(selectedApp.createdAt)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail size={15} className="text-primary shrink-0" />
                      <span className="truncate">{selectedApp.email}</span>
                    </div>
                    {selectedApp.phone && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone size={15} className="text-accent-orange shrink-0" />
                        <span>{selectedApp.phone}</span>
                      </div>
                    )}
                  </div>

                  {selectedApp.coverMessage && (
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Cover Message</p>
                      <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed italic whitespace-pre-wrap border border-slate-100">
                        "{selectedApp.coverMessage}"
                      </div>
                    </div>
                  )}

                  {/* Resume Section */}
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Uploaded Resume (PDF)</p>
                    {selectedApp.resumeUrl ? (
                      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                            PDF
                          </div>
                          <div>
                            <p className="font-bold text-xs text-slate-800">
                              {selectedApp.fullName.replace(/\s+/g, '_')}_Resume.pdf
                            </p>
                            <p className="text-[11px] text-slate-400">Stored in Base64 Database Format</p>
                          </div>
                        </div>
                        <button
                          onClick={() => openOrDownloadResume(selectedApp.resumeUrl!, selectedApp.fullName)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-xs"
                        >
                          <Download size={14} /> Open / Download PDF
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No resume was attached with this application.</p>
                    )}
                  </div>

                  {/* Status update */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-600 uppercase">Update Application Status</p>
                    <select
                      value={selectedApp.status}
                      onChange={(e) => handleAppStatus(selectedApp.id, e.target.value)}
                      className={`text-xs font-bold border rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        APP_COLORS[selectedApp.status] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {APP_STATUS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default JobsAdminPage;