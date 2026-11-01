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
    <div className="bg-white rounded-2xl overflow-hidden border border-ivory-dark shadow-luxury luxury-card flex flex-col group">
      {/* Image Container with Badges */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-forest-dark">
        <Image
          src={room.mainImage || '/images/room-placeholder.svg'}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-black/20" />

        {/* Room Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-forest/90 text-gold border border-gold/40 backdrop-blur-md">
            {room.roomType || 'Cottage'}
          </span>
        </div>

        {/* Image Status Notice */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className={`px-2.5 py-0.5 rounded text-[10px] font-medium tracking-wide backdrop-blur-sm border ${
              isAuthentic
                ? 'bg-gold/90 text-forest font-semibold border-gold flex items-center gap-1'
                : 'bg-black/65 text-ivory/80 border-white/20'
            }`}
          >
            {isAuthentic ? (
              <>
                <CheckCircle2 className="w-2.5 h-2.5" /> Authentic Photo
              </>
            ) : (
              'Photo Coming Soon'
            )}
          </span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-ivory/80 block">Tariff / Night</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-ivory">
                {formattedPrice}
              </span>
              <span className="text-xs text-ivory/80 font-normal">+ taxes / meals extra</span>
            </div>
          </div>
          <span className="text-xs text-gold bg-forest-dark/80 px-2.5 py-1 rounded-lg border border-gold/30">
            Approved Price
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest group-hover:text-gold-dark transition-colors mb-2">
            <Link href={`/rooms/${room.slug}`}>{room.name}</Link>
          </h3>

          <p className="text-sm text-forest/75 line-clamp-2 leading-relaxed mb-4">
            {room.description}
          </p>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-ivory-dark mb-4 text-xs text-forest/80">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gold shrink-0" />
              <span>Up to {room.maximumOccupancy} Guests</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-gold shrink-0" />
              <span className="truncate">{room.bedConfiguration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-4 h-4 text-gold shrink-0" />
              <span>{room.hasAttachedBath ? 'Attached Bathroom' : 'Shared Bath'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-gold shrink-0" />
              <span>{room.isAc ? 'Air Conditioned' : 'Natural Hill Breeze / Fan'}</span>
            </div>
          </div>

          {/* Amenities Chips (Top 3) */}
          {amenitiesList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
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

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2 border-t border-ivory-dark/60">
          <div className="grid grid-cols-2 gap-2">
            {/* View Details */}
            <Link
              href={`/rooms/${room.slug}`}
              className="w-full py-2.5 px-3 rounded-xl border border-forest/20 text-forest hover:bg-forest hover:text-ivory text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Direct Call Button */}
            <a
              href={buildTelLink(phone)}
              className="w-full py-2.5 px-3 rounded-xl border border-gold/60 text-forest-dark hover:border-gold hover:bg-ivory text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-gold-dark" />
              <span>Call to Inquire</span>
            </a>
          </div>

          {/* Primary WhatsApp Enquiry Button with pre-filled message */}
          <a
            href={buildWhatsAppLink(whatsappNumber, room.name, room.price)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full btn-gold py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 tracking-wide uppercase shadow-sm"
          >
            <MessageSquare className="w-4 h-4 fill-forest text-forest" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
