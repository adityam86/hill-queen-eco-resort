import React from 'react';
import AdminPasswordForm from '@/components/AdminPasswordForm';

export default function AdminPasswordPage() {
  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold block mb-1">
          Security Settings
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest">
          Change Admin Password
        </h1>
        <p className="text-xs sm:text-sm text-forest/70 mt-1">
          Update the secure password for the Hill Queen Eco Resort management portal.
        </p>
      </div>

      <AdminPasswordForm />
    </div>
  );
}
