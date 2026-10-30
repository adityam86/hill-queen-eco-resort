'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-950/40 text-red-300 hover:text-red-200 transition-colors text-left text-xs font-medium"
    >
      <LogOut className="w-4 h-4 text-red-400" />
      <span>Sign Out</span>
    </button>
  );
}
