import React from 'react';
import { redirect } from 'next/navigation';
import RoomForm from '@/components/RoomForm';
import { getAdminSession } from '@/lib/auth';

export default async function NewRoomPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }
  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold block mb-1">
          Catalog Creation
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest">
          Add New Room Category
        </h1>
        <p className="text-xs sm:text-sm text-forest/70 mt-1">
          Specify room name, nightly pricing in INR, description, and photographs.
        </p>
      </div>

      <RoomForm isEditing={false} />
    </div>
  );
}
