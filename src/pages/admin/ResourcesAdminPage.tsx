import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderOpen, Plus, Trash2, RefreshCw, Edit2, Save, X,
  AlertTriangle, CheckCircle, ChevronLeft, ChevronRight,
  Upload, Image as ImageIcon, Link as LinkIcon, FileText
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { resourceCategories } from '@/data/resources';
import type { Resource, PaginatedResponse } from '@/types';

const emptyForm = (): Partial<Resource> => ({
  title: '',
  description: '',
  url: '',
  fileUrl: '',
  fileType: 'PDF' as any,
  category: 'Research Documents' as any,
  thumbnailUrl: '',
  isPublished: true,
  status: 'PUBLISHED' as any
});

const getCategoryString = (cat: any): string => {
  if (!cat) return 'Research Documents';
  if (typeof cat === 'string') return cat;
  return cat.name || cat.slug || 'Research Documents';
};

export const ResourcesAdminPage: React.FC = () => {
  const [resources, setResources] = useState<PaginatedResponse<Resource> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Resource | null>(null);
  const [form, setForm] = useState<Partial<Resource>>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [thumbMode, setThumbMode] = useState<'upload' | 'url'>('upload');
  const [thumbError, setThumbError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadResources = useCallback(async (p = page) => {
    setLoading(true); setError('');
    try { setResources(await adminService.getResources(p, 10)); }
    catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to load resources'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { loadResources(page); }, [page]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setThumbError('');
    setThumbMode('upload');
    setShowForm(true);
  };

  const openEdit = (r: Resource) => {
    setEditTarget(r);
    setForm({
      title: r.title,
      description: r.description ?? '',
      category: getCategoryString(r.category) as any,
      url: r.fileUrl || r.url || '',
      fileUrl: r.fileUrl || r.url || '',
      fileType: r.fileType ?? 'PDF' as any,
      thumbnailUrl: r.thumbnailUrl ?? '',
      isPublished: r.isPublished ?? true,
      status: r.status ?? 'PUBLISHED' as any,
    });
    setThumbError('');
    setThumbMode('upload');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setThumbError('');
  };

  // Convert uploaded thumbnail file to compressed Base64
  const handleThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setThumbError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setThumbError('');
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
          setForm((f) => ({ ...f, thumbnailUrl: compressedBase64 }));
        }
      };
      img.onerror = () => setThumbError('Failed to process image file.');
      img.src = event.target?.result as string;
    };
    reader.onerror = () => setThumbError('Failed to read image file.');
    reader.readAsDataURL(file);
  };

  const handleRemoveThumb = () => {
    setForm((f) => ({ ...f, thumbnailUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!form.title?.trim()) { setError('Title is required'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        category: form.category,
        fileUrl: form.url || form.fileUrl,
      };
      if (editTarget) {
        await adminService.updateResource(editTarget.id, payload);
        setSuccess('Resource updated successfully');
      } else {
        await adminService.createResource(payload);
        setSuccess('Resource created successfully');
      }
      closeForm();
      await loadResources(page);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to save resource');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resource?')) return;
    setDeletingId(id);
    try {
      await adminService.deleteResource(id);
      await loadResources(page);
      setSuccess('Resource deleted');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to delete');
    } finally {
      setDeletingId(null);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const totalPages = resources?.pagination?.totalPages ?? 1;

  return (
    <>
      <Helmet><title>E-Resources Management | Admin | TRISTARC</title></Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-tristarc-text-primary flex items-center gap-2">
              <FolderOpen size={22} className="text-primary" /> E-Resources Management
            </h1>
            <p className="text-sm text-tristarc-text-muted mt-0.5">{resources?.pagination?.total ?? 0} resources total</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => loadResources(page)} className="btn-secondary btn-sm" title="Refresh">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={openCreate} className="btn-primary btn-sm flex items-center gap-2">
              <Plus size={14} /> New Resource
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
                    {editTarget ? 'Edit Resource' : 'Add New E-Resource'}
                  </h2>
                  <p className="text-xs text-tristarc-text-muted mt-0.5">
                    Configure resource category, thumbnail image, and download links.
                  </p>
                </div>
                <button onClick={closeForm} className="p-1 rounded-lg hover:bg-slate-100 text-tristarc-text-muted hover:text-tristarc-text-primary transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Thumbnail Image Uploader Section */}
              <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Thumbnail Preview Box */}
                  <div className="relative group shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-2 border-slate-200 shadow-sm overflow-hidden flex items-center justify-center">
                      {form.thumbnailUrl ? (
                        <img
                          src={form.thumbnailUrl}
                          alt="Thumbnail Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-300">
                          <FileText size={36} />
                          <span className="text-[10px] text-slate-400 font-medium mt-1">No Thumbnail</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Controls */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-sm font-bold text-tristarc-text-primary flex items-center gap-2">
                        <ImageIcon size={16} className="text-primary" /> Thumbnail Image
                      </label>
                      <div className="flex rounded-lg bg-slate-200 p-0.5 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setThumbMode('upload')}
                          className={`px-3 py-1 rounded-md transition-all ${thumbMode === 'upload' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          <Upload size={12} className="inline mr-1" /> Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setThumbMode('url')}
                          className={`px-3 py-1 rounded-md transition-all ${thumbMode === 'url' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                          <LinkIcon size={12} className="inline mr-1" /> Enter URL
                        </button>
                      </div>
                    </div>

                    {thumbMode === 'upload' ? (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          onChange={handleThumbUpload}
                        />
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="btn-secondary btn-sm flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/5"
                          >
                            <Upload size={14} /> Choose Image File...
                          </button>
                          {form.thumbnailUrl && (
                            <button
                              type="button"
                              onClick={handleRemoveThumb}
                              className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded"
                            >
                              Remove Thumbnail
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
                          placeholder="https://example.com/thumbnail.jpg"
                          value={form.thumbnailUrl ?? ''}
                          onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
                        />
                      </div>
                    )}

                    {thumbError && <p className="text-xs text-red-600 font-medium">{thumbError}</p>}
                  </div>
                </div>
              </div>

              {/* Resource Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="form-label">Resource Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Statistical Analysis with R — Beginner Guide"
                    value={form.title ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="form-label">Resource Category *</label>
                  <select
                    className="form-input"
                    value={getCategoryString(form.category)}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as any }))}
                  >
                    {resourceCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">File Type</label>
                  <select
                    className="form-input"
                    value={form.fileType ?? 'PDF'}
                    onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value as any }))}
                  >
                    {['PDF', 'XLSX', 'DOCX', 'PPTX', 'ZIP', 'CSV', 'IMAGE', 'OTHER'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="form-label">URL / Download Link / File Link *</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://example.com/files/resource.pdf"
                    value={form.url ?? form.fileUrl ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value, fileUrl: e.target.value }))}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="form-input resize-y"
                    placeholder="Brief description of the document or resource..."
                    value={form.description ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="form-label">Content Status</label>
                  <select
                    className="form-input"
                    value={form.status ?? 'PUBLISHED'}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as any }))}
                  >
                    {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 self-end pb-2">
                  <input
                    type="checkbox"
                    id="pub"
                    checked={!!form.isPublished}
                    onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <label htmlFor="pub" className="text-sm font-medium text-tristarc-text-primary cursor-pointer">
                    Published (publicly visible on E-Resources page)
                  </label>
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
                  {editTarget ? 'Save Changes' : 'Create Resource'}
                </button>
                <button onClick={closeForm} className="btn-ghost btn-sm">Cancel</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resources Table */}
        <div className="bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-tristarc-bg border-b border-tristarc-border">
                <tr>
                  {['Thumbnail', 'Title & Type', 'Category', 'Status', 'Actions'].map((h) => (
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
                      <td colSpan={5} className="px-4 py-3">
                        <div className="h-10 bg-tristarc-bg rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : (resources?.data ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-tristarc-text-muted">
                      No resources added yet.{' '}
                      <button onClick={openCreate} className="text-primary font-semibold hover:underline">
                        Add the first resource
                      </button>
                    </td>
                  </tr>
                ) : (
                  (resources?.data ?? []).map((r) => {
                    const categoryLabel = getCategoryString(r.category);
                    return (
                      <tr key={r.id} className="hover:bg-tristarc-bg/50 transition-colors">
                        {/* Thumbnail */}
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                            {r.thumbnailUrl ? (
                              <img src={r.thumbnailUrl} alt={r.title} className="w-full h-full object-cover" />
                            ) : (
                              <FileText size={18} className="text-slate-400" />
                            )}
                          </div>
                        </td>

                        {/* Title & File Type */}
                        <td className="px-4 py-3">
                          <div className="font-bold text-tristarc-text-primary">{r.title}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {r.fileType && (
                              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-600">
                                {r.fileType}
                              </span>
                            )}
                            {(r.fileUrl || r.url) && (
                              <a
                                href={r.fileUrl || r.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-primary hover:underline truncate max-w-xs"
                              >
                                View File
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 text-tristarc-text-secondary">
                          <span className="badge-blue text-[11px] font-semibold px-2 py-0.5 rounded-full">
                            {categoryLabel}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${r.isPublished !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}
                          >
                            {r.isPublished !== false ? 'Published' : 'Draft'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => openEdit(r)}
                              className="p-1.5 rounded-lg hover:bg-primary-light text-tristarc-text-muted hover:text-primary transition-all"
                              title="Edit Resource"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              disabled={deletingId === r.id}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-tristarc-text-muted hover:text-red-600 transition-all"
                              title="Delete Resource"
                            >
                              {deletingId === r.id ? (
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

export default ResourcesAdminPage;