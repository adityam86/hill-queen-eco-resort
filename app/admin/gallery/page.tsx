import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import AdminGalleryManager from '@/components/AdminGalleryManager';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const photos = await prisma.galleryImage.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold block mb-1">
          Visual Media Management
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest">
          Resort Photo Gallery
        </h1>
        <p className="text-xs sm:text-sm text-forest/70 mt-1">
          Upload and organize resort exterior photos, room views, dining shots, and nearby tourist attractions.
        </p>
      </div>

      <AdminGalleryManager initialPhotos={photos} />
    </div>
  );
}
