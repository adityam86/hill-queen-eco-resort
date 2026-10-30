import React from 'react';
import { redirect } from 'next/navigation';
import { getResortSettings } from '@/lib/settings';
import AdminSettingsForm from '@/components/AdminSettingsForm';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const settings = await getResortSettings();

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold block mb-1">
          Website Configuration
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest">
          Resort & Website Settings
        </h1>
        <p className="text-xs sm:text-sm text-forest/70 mt-1">
          Manage verified phone numbers, WhatsApp enquiry target, resort address, and SEO metadata.
        </p>
      </div>

      <AdminSettingsForm initialSettings={settings} />
    </div>
  );
}
