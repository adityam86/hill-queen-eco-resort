import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import AdminStaffManager from '@/components/AdminStaffManager';

export const dynamic = 'force-dynamic';

export default async function AdminStaffPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  // Only OWNER_ADMIN can manage accounts
  if (session.role !== 'OWNER_ADMIN') {
    redirect('/admin');
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold block mb-1">
          Access & Team Management
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest">
          Staff & Administrator Accounts
        </h1>
        <p className="text-xs sm:text-sm text-forest/70 mt-1">
          Create individual accounts for desk staff and maintain exclusive owner control.
        </p>
      </div>

      <AdminStaffManager />
    </div>
  );
}

