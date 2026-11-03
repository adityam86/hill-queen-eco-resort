import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { DEFAULT_ATTRACTIONS, AttractionData } from '@/lib/attractions';
import AdminAttractionsManager from '@/components/AdminAttractionsManager';

export const dynamic = 'force-dynamic';

export default async function AdminAttractionsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  let attractions: AttractionData[] = [];
  try {
    const dbAttractions = await prisma.attraction.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    if (dbAttractions && dbAttractions.length > 0) {
      attractions = dbAttractions as unknown as AttractionData[];
    } else {
      attractions = DEFAULT_ATTRACTIONS;
    }
  } catch (error) {
    console.warn('Could not query attractions for admin, using defaults:', error);
    attractions = DEFAULT_ATTRACTIONS;
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold block mb-1">
          Local Sightseeing & Purulia Guide
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest">
          Nearby Attractions Management
        </h1>
        <p className="text-xs sm:text-sm text-forest/70 mt-1">
          Manage local tourist destinations, driving distances from Hill Queen Eco Resort (Mamudi, Murguma, PIN 723152), visitor advice, and genuine destination photography.
        </p>
      </div>

      <AdminAttractionsManager initialAttractions={attractions} />
    </div>
  );
}
