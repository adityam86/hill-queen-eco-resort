'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Bed, Bath, Wind, MessageSquare, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { buildTelLink, buildWhatsAppLink } from '@/lib/settings';

export interface RoomData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  maximumOccupancy: number;
  bedConfiguration: string;
  roomType: string;
  isAc: boolean;
  hasAttachedBath: boolean;
  extraBedAvailable: boolean;
  foodInclusion: string;
  amenities: string;
  mainImage: string;
  isActive: boolean;
  displayOrder: number;
}

interface RoomCardProps {
  room: RoomData;
  whatsappNumber?: string;
  phone?: string;
}

export default function RoomCard({
  room,
  whatsappNumber = '9735888106',
  phone = '9735888106',
}: RoomCardProps) {
  // Parse amenities string
  const amenitiesList = room.amenities
    ? room.amenities.split(',').map((a) => a.trim()).filter(Boolean)
    : [];

  const formattedPrice = `₹${room.price.toLocaleString('en-IN')}`;

  // Check if photo is authentic or a temporary placeholder
  const isAuthentic = Boolean(
    room.mainImage &&
    !room.mainImage.includes('unsplash.com') &&
    !room.mainImage.includes('room-placeholder')
  );

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-ivory-dark shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Image Container with Badges */}
        <div className="relative h-36 sm:h-64 md:h-72 w-full overflow-hidden bg-forest-dark">
          <Image
            src={room.mainImage || '/images/room-placeholder.svg'}
            alt={room.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-transparent to-black/25" />

          {/* Room Category Badge */}
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10">
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold tracking-wider uppercase bg-forest/90 text-gold border border-gold/40 backdrop-blur-md">
              {room.roomType || 'Cottage'}
            </span>
          </div>

          {/* Image Status Notice */}
          <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10">
            <span
              className={`px-1.5 sm:px-2.5 py-0.5 rounded text-[8px] sm:text-[10px] font-medium tracking-wide backdrop-blur-sm border ${
                isAuthentic
                  ? 'bg-gold/90 text-forest font-semibold border-gold flex items-center gap-1'
                  : 'bg-black/65 text-ivory/80 border-white/20'
              }`}
            >
              {isAuthentic ? (
                <>
                  <CheckCircle2 className="w-2.5 h-2.5" /> <span className="hidden sm:inline">Authentic Photo</span>
                </>
              ) : (
                'Photo Soon'
              )}
            </span>
          </div>

          {/* Price Tag Overlay */}
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-10 flex items-end justify-between">
            <div>
              <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-ivory/80 block">
                Tariff / Night
              </span>
              <div className="flex items-baseline flex-wrap gap-1 sm:gap-1.5">
                <span className="font-serif text-sm sm:text-2xl md:text-3xl font-bold text-ivory">
                  {formattedPrice}
                </span>
                <span className="text-[10px] sm:text-xs text-gold font-semibold">
                  + tax
                </span>
                <span className="text-[10px] sm:text-xs text-ivory/70 font-normal hidden sm:inline">
                  / night
                </span>
              </div>
            </div>
            <span className="text-[9px] sm:text-xs text-gold bg-forest-dark/80 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-gold/30 hidden sm:inline-block">
              Approved
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-3 sm:p-5 md:p-6">
          <h3 className="font-serif text-xs sm:text-lg md:text-xl font-bold text-forest group-hover:text-gold-dark transition-colors mb-1 sm:mb-2 truncate" title={room.name}>
            <Link href={`/rooms/${room.slug}`}>{room.name}</Link>
          </h3>

          <p className="text-xs text-forest/75 line-clamp-2 leading-relaxed mb-2 sm:mb-4 hidden sm:block">
            {room.description}
          </p>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 py-2 sm:py-3 border-y border-ivory-dark mb-2.5 sm:mb-4 text-[10px] sm:text-xs text-forest/80">
            <div className="flex items-center gap-1 sm:gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gold shrink-0" />
              <span className="truncate">{room.maximumOccupancy} Guests</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Bed className="w-3 h-3 sm:w-4 sm:h-4 text-gold shrink-0" />
              <span className="truncate">{room.bedConfiguration}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Bath className="w-3 h-3 sm:w-4 sm:h-4 text-gold shrink-0" />
              <span className="truncate">{room.hasAttachedBath ? 'Attached Bath' : 'Shared'}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Wind className="w-3 h-3 sm:w-4 sm:h-4 text-gold shrink-0" />
              <span className="truncate">{room.isAc ? 'AC' : 'Non-AC'}</span>
            </div>
          </div>

          {/* Amenities Chips (Top 3) - Visible on tablet/desktop */}
          {amenitiesList.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1.5 mb-4">
              {amenitiesList.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] bg-ivory text-forest-dark px-2.5 py-0.5 rounded-full border border-ivory-dark font-medium"
                >
                  <CheckCircle2 className="w-3 h-3 text-gold" />
                  {amenity}
                </span>
              ))}
              {amenitiesList.length > 3 && (
                <span className="text-[11px] text-sage font-medium self-center pl-1">
                  +{amenitiesList.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-2.5 sm:p-5 pt-0 border-t border-ivory-dark/60 space-y-1.5 sm:space-y-2 mt-auto">
        {/* Primary WhatsApp Enquiry Button */}
        <a
          href={buildWhatsAppLink(whatsappNumber, room.name, room.price)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full btn-gold py-1.5 sm:py-2.5 px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 tracking-wide uppercase shadow-sm"
        >
          <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-forest text-forest" />
          <span className="truncate">Enquire WhatsApp</span>
        </a>

        {/* View Details Link */}
        <Link
          href={`/rooms/${room.slug}`}
          className="w-full py-1.5 sm:py-2 px-2 rounded-lg sm:rounded-xl border border-forest/20 text-forest hover:bg-forest hover:text-ivory text-[10px] sm:text-xs font-semibold transition-all flex items-center justify-center gap-1"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
