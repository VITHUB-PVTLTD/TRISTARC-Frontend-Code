import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, Search, RefreshCw, ChevronLeft, ChevronRight, Shield, UserX, UserCheck, AlertTriangle } from 'lucide-react';
import { adminService } from '@/services/adminService';
import type { User, PaginatedResponse } from '@/types';

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    INACTIVE: 'bg-gray-100 text-gray-500',
    SUSPENDED: 'bg-red-100 text-red-700',
  };
  return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

const roleBadge = (role: string) => {
  const map: Record<string, string> = {
    SUPER_ADMIN: 'bg-purple-100 text-purple-700',
    ADMIN: 'bg-blue-100 text-blue-700',
    EDITOR: 'bg-yellow-100 text-yellow-700',
    USER: 'bg-gray-100 text-gray-600',
  };
  return <span key={role} className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${map[role] ?? 'bg-gray-100 text-gray-600'}`}>{role}</span>;
};

const fmt = (d?: string | null) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ' ';

const UsersPage: React.FC = () => {
  const [data, setData] = useState<PaginatedResponse<User> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(async (p = page) => {
    setLoading(true); setError('');
    try {
      const res = await adminService.getUsers(p, 15);
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Failed to load users');
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [page]);

  const handleStatusToggle = async (user: User) => {
    const next = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setActionLoading(user.id);
    try {
      await adminService.updateUserStatus(user.id, next);
      await load(page);
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Failed to update status'); }
    finally { setActionLoading(null); }
  };

  const filtered = (data?.data ?? []).filter(u =>
    !search || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <>
      <Helmet><title>Users | Admin | TRISTARC</title></Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-tristarc-text-primary flex items-center gap-2">
              <Users size={22} className="text-primary" /> Manage Users
            </h1>
            <p className="text-sm text-tristarc-text-muted mt-0.5">
              {data?.pagination?.total ?? 0} registered users
            </p>
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

        {/* Search */}
        <div className="bg-white rounded-2xl border border-tristarc-border shadow-card overflow-hidden mb-5">
          <div className="p-4 border-b border-tristarc-border">
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tristarc-text-muted" />
              <input
                type="text" placeholder="Search name or email "
                value={search} onChange={e => setSearch(e.target.value)}
                className="form-input pl-9 py-2 text-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-tristarc-bg border-b border-tristarc-border">
                <tr>
                  {['Name', 'Email', 'Roles', 'Status', 'Joined', 'Last Login', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-tristarc-text-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-tristarc-border">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}><td colSpan={7} className="px-4 py-3">
                      <div className="h-8 bg-tristarc-bg rounded animate-pulse" />
                    </td></tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-tristarc-text-muted">No users found</td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id} className="hover:bg-tristarc-bg/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-tristarc-text-primary whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-primary text-xs font-bold">
                          {u.firstName[0]}{u.lastName[0] ?? ''}
                        </div>
                        {u.firstName} {u.lastName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-tristarc-text-secondary">{u.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(u.roles ?? []).map(r => roleBadge(r))}
                      </div>
                    </td>
                    <td className="px-4 py-3">{statusBadge(u.status ?? 'ACTIVE')}</td>
                    <td className="px-4 py-3 text-tristarc-text-muted whitespace-nowrap">{fmt(u.createdAt)}</td>
                    <td className="px-4 py-3 text-tristarc-text-muted whitespace-nowrap">{fmt(u.lastLoginAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleStatusToggle(u)}
                        disabled={actionLoading === u.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50
                          ${u.status === 'ACTIVE'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                        {actionLoading === u.id ? <RefreshCw size={12} className="animate-spin" /> : u.status === 'ACTIVE' ? <UserX size={12} /> : <UserCheck size={12} />}
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-tristarc-border">
              <p className="text-sm text-tristarc-text-muted">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="btn-secondary btn-sm disabled:opacity-40"><ChevronLeft size={14} /></button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                  className="btn-secondary btn-sm disabled:opacity-40"><ChevronRight size={14} /></button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default UsersPage;
