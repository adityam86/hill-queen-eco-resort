import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import RoomForm from '@/components/RoomForm';

interface EditRoomPageProps {
  params: {
    id: string;
  };
}

export default async function EditRoomPage({ params }: EditRoomPageProps) {
  const room = await prisma.room.findUnique({
    where: { id: params.id },
    include: {
      images: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  if (!room) {
    notFound();
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold block mb-1">
          Catalog Modification
        </span>
        <h1 className="font-serif text-3xl font-bold text-forest">
          Edit {room.name}
        </h1>
        <p className="text-xs sm:text-sm text-forest/70 mt-1">
          Update prices, occupancy, amenities, or photographs. Changes take effect on the public website immediately.
        </p>
      </div>

      <RoomForm initialData={room} isEditing={true} />
    </div>
  );
}
