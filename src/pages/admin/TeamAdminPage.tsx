import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Plus, Trash2, RefreshCw, Edit2, Save, X,
  AlertTriangle, CheckCircle, ChevronLeft, ChevronRight,
  Upload, Image as ImageIcon, Link as LinkIcon, User
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { TeamMember, PaginatedResponse } from '@/types';

const emptyForm = (): Partial<TeamMember> => ({
  name: '', designation: '', category: 'Faculty' as any, email: '',
  qualification: '', specialization: '', bio: '', photoUrl: '',
  linkedinUrl: '', isActive: true, sortOrder: 0
});

export const TeamAdminPage: React.FC = () => {
  const [members, setMembers] = useState<PaginatedResponse<TeamMember> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<Partial<TeamMember>>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('upload');
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMembers = useCallback(async (p = page) => {
    setLoading(true); setError('');
    try { setMembers(await adminService.getTeam(p, 10)); }
    catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to load team members'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { loadMembers(page); }, [page]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setPhotoError('');
    setPhotoMode('upload');
    setShowForm(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditTarget(m);
    setForm({
      name: m.name,
      designation: m.designation ?? '',
      category: (typeof m.category === 'string' ? m.category : (m.category as any)?.name ?? (m.category as any)?.slug ?? 'Faculty') as any,
      email: m.email ?? '',
      qualification: m.qualification ?? '',
      specialization: m.specialization ?? '',
      bio: m.bio ?? '',
      photoUrl: m.photoUrl || m.image || '',
      linkedinUrl: m.linkedinUrl ?? '',
      isActive: m.isActive ?? true,
      sortOrder: m.sortOrder ?? 0,
    });
    setPhotoError('');
    setPhotoMode('upload');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setPhotoError('');
  };

  // Convert uploaded image file to compressed Base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setPhotoError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIMENSION = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          setForm((f) => ({ ...f, photoUrl: compressedBase64 }));
        }
      };
      img.onerror = () => setPhotoError('Failed to process image.');
      img.src = event.target?.result as string;
    };
    reader.onerror = () => setPhotoError('Failed to read file.');
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setForm((f) => ({ ...f, photoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!form.name?.trim()) { setError('Name is required'); return; }
    if (!form.designation?.trim()) { setError('Designation is required'); return; }
    setSaving(true); setError('');
    try {
      if (editTarget) {
        await adminService.updateTeamMember(editTarget.id, form);
        setSuccess('Team member updated successfully');
      } else {
        await adminService.createTeamMember(form);
        setSuccess('Team member created successfully');
      }
      closeForm();
      await loadMembers(page);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to save team member');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    setDeletingId(id);
    try {
      await adminService.deleteTeamMember(id);
      await loadMembers(page);
      setSuccess('Team member deleted');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to delete');
    } finally {
      setDeletingId(null);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const totalPages = members?.pagination?.totalPages ?? 1;

  return (
    <>
      <Helmet><title>Team Management | Admin | TRISTARC</title></Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-tristarc-text-primary flex items-center gap-2">
              <Users size={22} className="text-primary" /> Team Members Management
            </h1>
            <p className="text-sm text-tristarc-text-muted mt-0.5">{members?.pagination?.total ?? 0} team members total</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => loadMembers(page)} className="btn-secondary btn-sm" title="Refresh">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={openCreate} className="btn-primary btn-sm flex items-center gap-2">
              <Plus size={14} /> New Member
            </button>
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

        {/* Create/Edit Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="bg-white rounded-2xl border border-primary/30 shadow-xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-tristarc-border">
                <div>
                  <h2 className="font-bold text-lg text-tristarc-text-primary">
                    {editTarget ? 'Edit Team Member Profile' : 'Add New Team Member'}
                  </h2>
                  <p className="text-xs text-tristarc-text-muted mt-0.5">
                    Upload profile photo and fill in member details.
                  </p>
                </div>
                <button onClick={closeForm} className="p-1 rounded-lg hover:bg-slate-100 text-tristarc-text-muted hover:text-tristarc-text-primary transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Profile Photo Uploader Section */}
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Photo Preview Avatar */}
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-2 border-slate-200 shadow-sm overflow-hidden flex items-center justify-center">
                      {form.photoUrl ? (
                        <img
                          src={form.photoUrl}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-300">
                          <User size={36} />
                          <span className="text-[10px] text-slate-400 font-medium mt-1">No Photo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photo Controls */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-sm font-bold text-tristarc-text-primary flex items-center gap-2">
                        <ImageIcon size={16} className="text-primary" /> Profile Photo
                      </label>
                      <div className="flex rounded-lg bg-slate-200 p-0.5 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setPhotoMode('upload')}
                          className={`px-3 py-1 rounded-md transition-all ${photoMode === 'upload' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          <Upload size={12} className="inline mr-1" /> Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhotoMode('url')}
                          className={`px-3 py-1 rounded-md transition-all ${photoMode === 'url' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          <LinkIcon size={12} className="inline mr-1" /> Enter URL
                        </button>
                      </div>
                    </div>

                    {photoMode === 'upload' ? (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-secondary btn-sm flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/5"
                          >
                            <Upload size={14} /> Choose Image File...
                          </button>
                          {form.photoUrl && (
                            <button
                              type="button"
                              onClick={handleRemovePhoto}
                              className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded"
                            >
                              Remove Photo
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">
                          Uploads PNG, JPG, or WebP.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          className="form-input text-xs"
                          placeholder="https://example.com/photo.jpg"
                          value={form.photoUrl ?? ''}
                          onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))}
                        />
                      </div>
                    )}

                    {photoError && <p className="text-xs text-red-600 font-medium">{photoError}</p>}
                  </div>
                </div>
              </div>

              {/* Text Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Prof. Dr. K. Tirupathi Rao"
                    value={form.name ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Designation *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Founder & Chief Consultant"
                    value={form.designation ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={form.category ?? 'Faculty'}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as any }))}
                  >
                    {['Leadership', 'Faculty', 'Researchers', 'Consultants', 'Trainers'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. contact@tristarc.com"
                    value={form.email ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Qualification</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ph.D. in Statistics, M.Sc."
                    value={form.qualification ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Specialization / Expertise</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Econometrics, Biostatistics, R & Python"
                    value={form.specialization ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://linkedin.com/in/username"
                    value={form.linkedinUrl ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Sort Order (Lower numbers appear first)</label>
                  <input
                    type="number"
                    className="form-input"
                    min={0}
                    value={form.sortOrder ?? 0}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
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
                  <label htmlFor="act" className="text-sm font-medium text-tristarc-text-primary cursor-pointer">
                    Active (displayed publicly on team page)
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Bio / Profile Description</label>
                  <textarea
                    rows={3}
                    className="form-input resize-y"
                    placeholder="Brief biography and background experience..."
                    value={form.bio ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-tristarc-border">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary btn-sm flex items-center gap-2 px-5"
                >
                  {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  {editTarget ? 'Save Changes' : 'Create Team Member'}
                </button>
                <button onClick={closeForm} className="btn-ghost btn-sm">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Members List Table */}
        <div className="bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-tristarc-bg border-b border-tristarc-border">
                <tr>
                  {['Photo', 'Name & Designation', 'Category', 'Qualification', 'Status', 'Actions'].map((h) => (
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
                      <td colSpan={6} className="px-4 py-3">
                        <div className="h-10 bg-tristarc-bg rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : (members?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-tristarc-text-muted">
                      No team members added yet.{' '}
                      <button onClick={openCreate} className="text-primary font-semibold hover:underline">
                        Add the first member
                      </button>
                    </td>
                  </tr>
                ) : (
                  (members?.data ?? []).map((m) => {
                    const photo = m.photoUrl || m.image;
                    return (
                      <tr key={m.id} className="hover:bg-tristarc-bg/50 transition-colors">
                        {/* Avatar Thumbnail */}
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            {photo ? (
                              <img src={photo} alt={m.name} className="w-full h-full object-cover" />
                            ) : (
                              <User size={18} className="text-slate-400" />
                            )}
                          </div>
                        </td>

                        {/* Name & Designation */}
                        <td className="px-4 py-3">
                          <div className="font-bold text-tristarc-text-primary">{m.name}</div>
                          <div className="text-xs text-tristarc-text-secondary">{m.designation ?? '-'}</div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 text-tristarc-text-secondary">
                          <span className="badge-blue text-[11px] font-semibold px-2 py-0.5 rounded-full">
                            {typeof m.category === 'string' ? m.category : (m.category as any)?.name ?? 'Faculty'}
                          </span>
                        </td>

                        {/* Qualification */}
                        <td className="px-4 py-3 text-tristarc-text-secondary text-xs">
                          {m.qualification ?? '-'}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${m.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}
                          >
                            {m.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEdit(m)}
                              className="p-1.5 rounded-lg hover:bg-primary-light text-tristarc-text-muted hover:text-primary transition-all"
                              title="Edit Member"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(m.id)}
                              disabled={deletingId === m.id}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-tristarc-text-muted hover:text-red-600 transition-all"
                              title="Delete Member"
                            >
                              {deletingId === m.id ? (
                                <RefreshCw size={15} className="animate-spin" />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
      </motion.div>
    </>
  );
};

export default TeamAdminPage;