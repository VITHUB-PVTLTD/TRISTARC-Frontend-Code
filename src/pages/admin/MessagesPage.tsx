import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MessageSquare, RefreshCw, ChevronLeft, ChevronRight, Trash2, CheckCheck, Eye, AlertTriangle } from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { ContactMessage, PaginatedResponse } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  READ: 'bg-gray-100 text-gray-600',
  RESPONDED: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-gray-100 text-gray-500',
};

const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const MessagesPage: React.FC = () => {
  const [data, setData] = useState<PaginatedResponse<ContactMessage> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async (p = page) => {
    setLoading(true); setError('');
    try { setData(await adminService.getMessages(p, 15)); }
    catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to load messages'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [page]);

  const updateStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try { await adminService.updateMessageStatus(id, status); await load(page); if (selected?.id === id) setSelected(null); }
    catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to update status'); }
    finally { setActionLoading(null); }
  };

  const deleteMsg = async (id: string) => {
    if (!confirm('Delete this message permanently?')) return;
    setActionLoading(id);
    try { await adminService.deleteMessage(id); await load(page); if (selected?.id === id) setSelected(null); }
    catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to delete message'); }
    finally { setActionLoading(null); }
  };

  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <>
      <Helmet><title>Messages | Admin | TRISTARC</title></Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-tristarc-text-primary flex items-center gap-2">
              <MessageSquare size={22} className="text-primary" /> Contact Messages
            </h1>
            <p className="text-sm text-tristarc-text-muted mt-0.5">{data?.pagination?.total ?? 0} total messages</p>
          </div>
          <button onClick={() => load(page)} className="btn-secondary btn-sm flex items-center gap-2">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* List */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden">
            <div className="divide-y divide-tristarc-border">
              {loading ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4"><div className="h-14 bg-tristarc-bg rounded-xl animate-pulse" /></div>
              )) : (data?.data ?? []).length === 0 ? (
                <p className="text-center text-sm text-tristarc-text-muted py-12">No messages</p>
              ) : (data?.data ?? []).map(msg => (
                <button key={msg.id} onClick={() => setSelected(msg)}
                  className={`w-full text-left px-4 py-3 hover:bg-tristarc-bg transition-colors ${selected?.id === msg.id ? 'bg-primary-light border-l-4 border-primary' : 'border-l-4 border-transparent'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-tristarc-text-primary truncate">{msg.fullName}</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[msg.status]}`}>{msg.status}</span>
                  </div>
                  <p className="text-xs text-tristarc-text-muted truncate">{msg.subject ?? msg.message}</p>
                  <p className="text-xs text-tristarc-text-muted mt-0.5">{fmt(msg.createdAt)}</p>
                </button>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-tristarc-border">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary btn-sm disabled:opacity-40"><ChevronLeft size={14} /></button>
                <span className="text-xs text-tristarc-text-muted">{page}/{totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn-secondary btn-sm disabled:opacity-40"><ChevronRight size={14} /></button>
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {!selected ? (
              <div className="bg-white rounded-2xl border border-tristarc-border shadow-card p-10 text-center">
                <MessageSquare size={36} className="mx-auto text-tristarc-text-muted mb-3" />
                <p className="text-tristarc-text-muted text-sm">Select a message to view details</p>
              </div>
            ) : (
              <motion.div key={selected.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                <div className="bg-white rounded-2xl border border-tristarc-border shadow-card p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h2 className="text-lg font-bold text-tristarc-text-primary">{selected.fullName}</h2>
                      <a href={`mailto:${selected.email}`} className="text-sm text-primary hover:underline">{selected.email}</a>
                      {selected.phone && <p className="text-sm text-tristarc-text-muted">{selected.phone}</p>}
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                  </div>
                  {selected.subject && <p className="font-semibold text-tristarc-text-primary mb-2">{selected.subject}</p>}
                  <div className="bg-tristarc-bg rounded-xl p-4 text-sm text-tristarc-text-secondary leading-relaxed mb-5 whitespace-pre-wrap">
                    {selected.message}
                  </div>
                  <p className="text-xs text-tristarc-text-muted mb-5">{fmt(selected.createdAt)}</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.status === 'NEW' && (
                      <button onClick={() => updateStatus(selected.id, 'READ')} disabled={actionLoading === selected.id}
                        className="btn-secondary btn-sm flex items-center gap-1.5"><Eye size={13} /> Mark as Read</button>
                    )}
                    {selected.status !== 'RESPONDED' && (
                      <button onClick={() => updateStatus(selected.id, 'RESPONDED')} disabled={actionLoading === selected.id}
                        className="btn-primary btn-sm flex items-center gap-1.5"><CheckCheck size={13} /> Mark Responded</button>
                    )}
                    {selected.status !== 'ARCHIVED' && (
                      <button onClick={() => updateStatus(selected.id, 'ARCHIVED')} disabled={actionLoading === selected.id}
                        className="btn-ghost btn-sm text-gray-500 flex items-center gap-1.5">Archive</button>
                    )}
                    <button onClick={() => deleteMsg(selected.id)} disabled={actionLoading === selected.id}
                      className="btn-sm flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MessagesPage;
