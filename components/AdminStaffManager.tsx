'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  KeyRound,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Lock,
} from 'lucide-react';

interface StaffAccount {
  id: string;
  username: string;
  email: string;
  name: string | null;
  role: 'OWNER_ADMIN' | 'STAFF';
  isActive: boolean;
  createdAt: string;
}

export default function AdminStaffManager() {
  const [accounts, setAccounts] = useState<StaffAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'STAFF' as 'OWNER_ADMIN' | 'STAFF',
  });

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/staff');
      const data = await res.json();
      if (res.ok) {
        setAccounts(data.accounts || []);
      } else {
        setError(data.error || 'Failed to load staff accounts');
      }
    } catch {
      setError('Network error while fetching accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account');
      } else {
        setSuccess(`Account for ${data.account.username} created successfully.`);
        setShowModal(false);
        setFormData({ name: '', username: '', email: '', password: '', role: 'STAFF' });
        fetchAccounts();
      }
    } catch {
      setError('An error occurred while saving the account.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (account: StaffAccount) => {
    setError(null);
    setSuccess(null);
    const newStatus = !account.isActive;

    try {
      const res = await fetch(`/api/admin/staff/${account.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update account status');
      } else {
        setSuccess(`Account ${account.username} ${newStatus ? 'activated' : 'deactivated'}.`);
        fetchAccounts();
      }
    } catch {
      setError('Network error while updating status');
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete account "${username}"?`)) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`/api/admin/staff/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to delete account');
      } else {
        setSuccess(`Account ${username} deleted.`);
        fetchAccounts();
      }
    } catch {
      setError('Network error while deleting account');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-ivory-dark shadow-sm">
        <div>
          <h2 className="font-serif text-xl font-bold text-forest">Authorized Accounts</h2>
          <p className="text-xs text-forest/70 mt-1">
            Manage individual login credentials and permissions for staff and management.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-wider"
        >
          <UserPlus className="w-4 h-4 text-forest" />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-ivory-dark overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-forest/60 text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-gold" />
            <span>Loading accounts...</span>
          </div>
        ) : accounts.length === 0 ? (
          <div className="p-12 text-center text-forest/60 text-xs">No accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-ivory-dark text-forest uppercase font-semibold text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">User Details</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Created Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-dark/60 text-forest/90">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-ivory/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-forest">{acc.name || acc.username}</div>
                      <div className="text-[11px] text-forest/60">@{acc.username} • {acc.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          acc.role === 'OWNER_ADMIN'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        <span>{acc.role === 'OWNER_ADMIN' ? 'Owner Admin' : 'Staff'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {acc.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 font-semibold text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Deactivated</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-forest/60 text-[11px]">
                      {new Date(acc.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(acc)}
                        className="px-2.5 py-1 rounded-lg border border-forest/20 text-forest hover:bg-forest hover:text-ivory text-[11px] font-medium transition-all"
                      >
                        {acc.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(acc.id, acc.username)}
                        className="px-2.5 py-1 rounded-lg border border-red-200 text-red-700 hover:bg-red-600 hover:text-white text-[11px] font-medium transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Account Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-gold/30 shadow-luxury space-y-5 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gold-dark font-bold">
                Access Provisioning
              </span>
              <h3 className="font-serif text-2xl font-bold text-forest">Create New Account</h3>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-forest uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Ghosh"
                  className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest uppercase mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. ramesh_desk"
                  className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. ramesh@hillqueenecoresorts.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest uppercase mb-1">
                  Initial Password (min 8 characters) *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest uppercase mb-1">
                  Permission Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as 'OWNER_ADMIN' | 'STAFF' })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold font-medium"
                >
                  <option value="STAFF">STAFF (Room prices & gallery updates only)</option>
                  <option value="OWNER_ADMIN">OWNER_ADMIN (Full control, accounts & settings)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-forest/20 text-forest text-xs font-semibold hover:bg-forest/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

