import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BedDouble,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  IndianRupee,
  Users,
  ExternalLink,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import RoomStatusToggle from '@/components/RoomStatusToggle';
import RoomDeleteButton from '@/components/RoomDeleteButton';

export const dynamic = 'force-dynamic';

export default async function AdminRoomsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const rooms = await prisma.room.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      images: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-dark">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold block mb-1">
            Accommodation Tariffs & Catalog
          </span>
          <h1 className="font-serif text-3xl font-bold text-forest">
            Room Management
          </h1>
          <p className="text-xs sm:text-sm text-forest/70 mt-1">
            Add new room categories, update nightly rates, adjust occupancies, and manage image listings.
          </p>
        </div>

        {session.role === 'OWNER_ADMIN' && (
          <Link
            href="/admin/rooms/new"
            className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm self-start"
          >
            <PlusCircle className="w-4 h-4 fill-forest text-forest" />
            <span>Add New Room Category</span>
          </Link>
        )}
      </div>

      {/* Rooms Table / Cards */}
      {rooms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-ivory-dark p-8 max-w-md mx-auto">
          <BedDouble className="w-12 h-12 text-gold mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-forest mb-2">
            No Room Categories Found
          </h3>
          <p className="text-xs text-forest/70 mb-6">
            Get started by adding your first cottage or room category.
          </p>
          <Link
            href="/admin/rooms/new"
            className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 fill-forest text-forest" />
            <span>Create First Room</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile Card View (Visible on phones below md) */}
          <div className="block md:hidden space-y-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white p-4 rounded-2xl border border-ivory-dark shadow-sm space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-forest-dark shrink-0 border border-ivory-dark">
                    <Image
                      src={room.mainImage || '/images/room-placeholder.svg'}
                      alt={room.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <strong className="block font-serif text-base font-bold text-forest truncate">
                      <Link href={`/admin/rooms/${room.id}/edit`}>{room.name}</Link>
                    </strong>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-ivory text-forest border border-ivory-dark">
                        {room.roomType || 'Cottage'}
                      </span>
                      <span className="text-xs font-semibold text-gold-dark">
                        ₹{room.price.toLocaleString('en-IN')}<span className="text-[10px] text-forest/60 font-normal">/night</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-ivory-dark/60">
                  <div className="text-[11px] text-forest/70 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gold-dark" />
                    <span>Up to {room.maximumOccupancy} Guests</span>
                  </div>
                  <RoomStatusToggle roomId={room.id} initialStatus={room.isActive} />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-ivory-dark/40">
                  <Link
                    href={`/rooms/${room.slug}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg text-forest/70 hover:text-gold hover:bg-ivory border border-ivory-dark text-xs font-medium flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </Link>
                  <Link
                    href={`/admin/rooms/${room.id}/edit`}
                    className="px-3 py-1.5 rounded-lg bg-forest text-gold hover:bg-forest/90 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>
                  {session.role === 'OWNER_ADMIN' && (
                    <RoomDeleteButton roomId={room.id} roomName={room.name} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (Visible on md and above) */}
          <div className="hidden md:block bg-white rounded-3xl border border-ivory-dark shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FAF7EF] text-forest/70 uppercase text-[11px] font-semibold border-b border-ivory-dark">
                  <tr>
                    <th className="py-4 px-6">Room / Cottage</th>
                    <th className="py-4 px-6">Tariff / Night</th>
                    <th className="py-4 px-6">Type & Occupancy</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Order</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-dark text-forest">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-ivory/20 transition-colors">
                      {/* Room Info & Thumbnail */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-forest-dark shrink-0 border border-ivory-dark">
                            <Image
                              src={room.mainImage || '/images/room-placeholder.svg'}
                              alt={room.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <strong className="block font-serif text-sm font-bold text-forest hover:text-gold-dark">
                              <Link href={`/admin/rooms/${room.id}/edit`}>{room.name}</Link>
                            </strong>
                            <span className="text-[11px] text-forest/60">
                              /{room.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Price in INR */}
                      <td className="py-4 px-6">
                        <div className="flex items-baseline gap-1">
                          <span className="font-serif text-base font-bold text-forest">
                            ₹{room.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-forest/60">/ night</span>
                        </div>
                      </td>

                      {/* Type & Occupancy */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-ivory text-forest border border-ivory-dark inline-block">
                            {room.roomType || 'Cottage'}
                          </span>
                          <div className="text-[11px] text-forest/70 flex items-center gap-1">
                            <Users className="w-3 h-3 text-gold-dark" />
                            <span>Max {room.maximumOccupancy} Guests</span>
                          </div>
                        </div>
                      </td>

                      {/* Active Toggle */}
                      <td className="py-4 px-6">
                        <RoomStatusToggle roomId={room.id} initialStatus={room.isActive} />
                      </td>

                      {/* Display Order */}
                      <td className="py-4 px-6">
                        <span className="text-xs font-semibold text-forest/80">
                          #{room.displayOrder}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Live preview link */}
                          <Link
                            href={`/rooms/${room.slug}`}
                            target="_blank"
                            title="View on Public Website"
                            className="p-2 rounded-lg text-forest/70 hover:text-gold hover:bg-ivory border border-transparent hover:border-ivory-dark transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Edit Room */}
                          <Link
                            href={`/admin/rooms/${room.id}/edit`}
                            title="Edit Details & Tariffs"
                            className="p-2 rounded-lg text-forest hover:text-gold-dark hover:bg-ivory border border-transparent hover:border-ivory-dark transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Delete Room (OWNER_ADMIN only) */}
                          {session.role === 'OWNER_ADMIN' && (
                            <RoomDeleteButton roomId={room.id} roomName={room.name} />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
