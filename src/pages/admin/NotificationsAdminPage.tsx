import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Trash2, RefreshCw, Edit2, Save, X, AlertTriangle, CheckCircle, Calendar, ArrowUpDown } from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { Notification, PaginatedResponse } from '@/types';

const fmtDate = (d?: string | null) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

const emptyForm = (): Partial<Notification> => ({
  title: '',
  message: '',
  link: '',
  type: 'info',
  isActive: true,
  startDate: '',
  endDate: '',
  sortOrder: 0,
});

export const NotificationsAdminPage: React.FC = () => {
  const [data, setData] = useState<PaginatedResponse<Notification> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Notification | null>(null);
  const [form, setForm] = useState<Partial<Notification>>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setData(await adminService.getNotifications(1, 50)); }
    catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to load notifications'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditTarget(null); setForm(emptyForm()); setShowForm(true); };
  const openEdit = (n: Notification) => {
    setEditTarget(n);
    setForm({
      title: n.title ?? '',
      message: n.message,
      link: n.link ?? '',
      type: n.type ?? 'info',
      isActive: n.isActive ?? true,
      startDate: n.startDate ? new Date(n.startDate).toISOString().slice(0, 16) : '',
      endDate: n.endDate ? new Date(n.endDate).toISOString().slice(0, 16) : (n.expiresAt ? new Date(n.expiresAt).toISOString().slice(0, 16) : ''),
      sortOrder: n.sortOrder ?? 0,
    });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setForm(emptyForm()); };

  const handleSave = async () => {
    if (!form.message?.trim()) { setError('Message content is required'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        title: form.title?.trim() || form.message.trim().slice(0, 60),
        message: form.message.trim(),
        link: form.link?.trim() || null,
        type: form.type || 'info',
        isActive: form.isActive,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
        sortOrder: Number(form.sortOrder ?? 0),
      };
      if (editTarget) {
        await adminService.updateNotification(editTarget.id, payload as any);
        setSuccess('Notification updated successfully');
      } else {
        await adminService.createNotification(payload as any);
        setSuccess('Notification created successfully');
      }
      closeForm(); await load();
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to save notification'); }
    finally { setSaving(false); setTimeout(() => setSuccess(''), 3000); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notification?')) return;
    setDeletingId(id);
    try { await adminService.deleteNotification(id); await load(); }
    catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to delete notification'); }
    finally { setDeletingId(null); }
  };

  const items = data?.data ?? [];

  return (
    <>
      <Helmet><title>Notifications Admin | TRISTARC</title></Helmet>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-tristarc-text-primary flex items-center gap-2">
              <Bell className="text-primary" size={24} /> Broadcast Notifications
            </h1>
            <p className="text-sm text-tristarc-text-muted mt-1">
              Manage ticker announcements, titles, links, active schedules, and display sorting
            </p>
          </div>
          <button onClick={openCreate} className="btn-primary btn-md flex items-center gap-2 self-start sm:self-auto">
            <Plus size={16} /> New Notification
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
            <CheckCircle size={16} className="shrink-0" /> {success}
          </div>
        )}

        {/* Modal Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="bg-white p-6 rounded-2xl border border-tristarc-border shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-tristarc-border">
                <h2 className="font-bold text-tristarc-text-primary">{editTarget ? 'Edit Notification' : 'Create Notification'}</h2>
                <button onClick={closeForm} className="text-tristarc-text-muted hover:text-tristarc-text-primary"><X size={18} /></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="form-label">Notification Title / Headline</label>
                  <input type="text" className="form-input" placeholder="Short headline (e.g. Admissions Open for Research Methodology Batch)"
                    value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>

                {/* Message Content */}
                <div className="sm:col-span-2">
                  <label className="form-label">Message Content *</label>
                  <textarea rows={3} className="form-input resize-y" placeholder="Detailed notification announcement message..."
                    value={form.message ?? ''} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                </div>

                {/* Link URL */}
                <div className="sm:col-span-2 sm:col-span-1">
                  <label className="form-label">Target Link URL (optional)</label>
                  <input type="url" className="form-input" placeholder="https://... or /courses/academic-skills"
                    value={form.link ?? ''} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
                </div>

                {/* Type / Badge Selection — Visual Cards */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="form-label">Category &amp; Display Style</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'info',
                        title: 'General Announcement',
                        desc: 'Standard informative updates & site news',
                        icon: <Bell size={16} className="text-blue-600" />,
                        badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
                        activeBorder: 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20',
                      },
                      {
                        id: 'alert',
                        title: 'Urgent / Alert',
                        desc: 'High-priority notices, warnings & deadlines',
                        icon: <AlertTriangle size={16} className="text-red-600" />,
                        badgeClass: 'bg-red-100 text-red-700 border-red-200',
                        activeBorder: 'border-red-500 bg-red-50/40 ring-2 ring-red-500/20',
                      },
                      {
                        id: 'success',
                        title: 'New Launch / Highlight',
                        desc: 'Course launches, achievements & special news',
                        icon: <CheckCircle size={16} className="text-emerald-600" />,
                        badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                        activeBorder: 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20',
                      },
                    ].map((item) => {
                      const isSelected = (form.type ?? 'info') === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, type: item.id }))}
                          className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? item.activeBorder
                              : 'border-tristarc-border bg-white hover:border-gray-300 hover:bg-gray-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-100">
                                {item.icon}
                              </div>
                              <span className="font-bold text-xs text-tristarc-text-primary">
                                {item.title}
                              </span>
                            </div>
                            {isSelected && (
                              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                            )}
                          </div>
                          <p className="text-[11px] text-tristarc-text-muted leading-tight mb-3">
                            {item.desc}
                          </p>
                          <div className="mt-auto">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${item.badgeClass}`}
                            >
                              Preview Badge
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label className="form-label">Start Date &amp; Time (optional)</label>
                  <input type="datetime-local" className="form-input"
                    value={form.startDate ?? ''} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                  <p className="text-[10px] text-tristarc-text-muted mt-1">Leave blank to make active immediately</p>
                </div>

                {/* End Date */}
                <div>
                  <label className="form-label">End / Expiry Date &amp; Time (optional)</label>
                  <input type="datetime-local" className="form-input"
                    value={form.endDate ?? ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                  <p className="text-[10px] text-tristarc-text-muted mt-1">Leave blank for no automatic expiration</p>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="form-label">Sort Order Priority</label>
                  <input type="number" className="form-input" placeholder="0" min={0}
                    value={form.sortOrder ?? 0} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} />
                  <p className="text-[10px] text-tristarc-text-muted mt-1">Lower numbers appear first in the ticker</p>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-2 self-center pt-3 sm:pt-6">
                  <input type="checkbox" id="isActive" checked={!!form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 text-primary rounded" />
                  <label htmlFor="isActive" className="text-sm font-semibold text-tristarc-text-primary">Active (Visible on public website)</label>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-tristarc-border">
                <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm flex items-center gap-2">
                  {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} {editTarget ? 'Update Notification' : 'Create & Publish Notification'}
                </button>
                <button onClick={closeForm} className="btn-ghost btn-sm">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications Table */}
        <div className="bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-tristarc-bg border-b border-tristarc-border text-xs font-bold text-tristarc-text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 text-left">Sort</th>
                  <th className="px-4 py-3.5 text-left">Title &amp; Message</th>
                  <th className="px-4 py-3.5 text-left">Link</th>
                  <th className="px-4 py-3.5 text-left">Type</th>
                  <th className="px-4 py-3.5 text-left">Active Schedule</th>
                  <th className="px-4 py-3.5 text-left">Status</th>
                  <th className="px-4 py-3.5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tristarc-border">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-8 bg-tristarc-bg rounded animate-pulse" /></td></tr>
                  ))
                ) : items.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-tristarc-text-muted">No notifications created yet. Click "New Notification" above to add one.</td></tr>
                ) : (
                  items.map(n => (
                    <tr key={n.id} className="hover:bg-tristarc-bg/50 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs font-bold text-tristarc-text-muted">
                        <span className="inline-flex items-center gap-1"><ArrowUpDown size={10} /> #{n.sortOrder ?? 0}</span>
                      </td>
                      <td className="px-4 py-3.5 max-w-sm">
                        {n.title && <p className="font-bold text-tristarc-text-primary text-xs truncate mb-0.5">{n.title}</p>}
                        <p className="text-xs text-tristarc-text-secondary line-clamp-2 leading-relaxed">{n.message}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-tristarc-text-muted max-w-xs truncate">{n.link || '-'}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${n.type === 'alert' ? 'bg-red-100 text-red-700 border border-red-200' : n.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                          {n.type || 'info'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[11px] text-tristarc-text-secondary font-mono">
                        <div className="flex items-center gap-1"><Calendar size={11} className="text-tristarc-text-muted" /> Start: {fmtDate(n.startDate)}</div>
                        <div className="flex items-center gap-1 text-tristarc-text-muted"><Calendar size={11} className="text-tristarc-text-muted" /> End: {fmtDate(n.endDate || n.expiresAt)}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${n.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {n.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(n)} className="p-1.5 rounded-lg text-tristarc-text-muted hover:text-primary hover:bg-primary-light transition-all" title="Edit Notification"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete(n.id)} disabled={deletingId === n.id} className="p-1.5 rounded-lg text-tristarc-text-muted hover:text-red-600 hover:bg-red-50 transition-all" title="Delete Notification">
                            {deletingId === n.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsAdminPage;
