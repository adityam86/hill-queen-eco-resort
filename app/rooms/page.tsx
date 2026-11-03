import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BedDouble,
  ShieldCheck,
  Phone,
  MessageSquare,
  Sparkles,
  Info,
  SlidersHorizontal,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { getResortSettings, buildTelLink, buildWhatsAppLink } from '@/lib/settings';
import RoomCard, { RoomData } from '@/components/RoomCard';
import { DEFAULT_ROOMS } from '@/lib/rooms';

export const revalidate = 30; // Dynamic revalidation

export const metadata = {
  title: 'Cottages & Room Tariffs | Hill Queen Eco Resort, Murguma',
  description: 'Explore eco-friendly cottages and room tariffs at Hill Queen Eco Resort in Mamudi, Murguma, Purulia. Transparent owner prices with direct WhatsApp and telephone enquiries.',
};

export default async function RoomsPage() {
  const settings = await getResortSettings();

  let rooms: RoomData[] = [];
  try {
    rooms = (await prisma.room.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    })) as RoomData[];
  } catch (error) {
    console.warn('Could not query rooms, using fallback catalog:', error);
  }

  if (rooms.length === 0) {
    rooms = DEFAULT_ROOMS;
  }

  return (
    <div className="bg-[#FAF7EF] min-h-screen text-forest pb-20">
      {/* 1. Header Banner */}
      <section className="relative py-20 sm:py-24 bg-forest-dark text-ivory overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/resort/resort-front.jpg"
            alt="Hill Queen Eco Resort Cottages & Grounds"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/80 to-forest-dark/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest/80 border border-gold/40 text-gold text-xs font-semibold mb-4 tracking-wider uppercase">
            <BedDouble className="w-3.5 h-3.5" />
            <span>Comfortable Nature Lodging</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ivory mb-4">
            Cottages, Rooms & Approved Tariffs
          </h1>
          <p className="text-sm sm:text-base text-ivory/80 leading-relaxed max-w-2xl mx-auto font-light">
            Stay in tranquil cottages surrounded by Purulia’s green hills and fresh breezes. All prices shown below are approved directly by the resort owner.
          </p>
        </div>
      </section>

      {/* 2. Direct Booking Philosophy Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-ivory-dark shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-forest/5 text-forest shrink-0">
              <ShieldCheck className="w-6 h-6 text-gold-dark" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-forest">
                Direct Transparent Booking Policy
              </h2>
              <p className="text-xs sm:text-sm text-forest/75 mt-0.5">
                We believe in straightforward hospitality. No hidden portal fees or instant card debits. Confirm room availability directly with the resort owner via WhatsApp or phone.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
            <a
              href={buildWhatsAppLink(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-forest text-forest" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={buildTelLink(settings.phonePrimary)}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-gold/50 text-forest hover:bg-forest hover:text-ivory text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-gold-dark" />
              <span>Call: +91 {settings.phonePrimary}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. Room Cards Listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {rooms.length === 0 ? (
          /* Empty State as explicitly instructed by prompt: "If no room data exists, show a beautiful empty state instead of fabricated prices." */
          <div className="text-center py-20 px-6 bg-white rounded-3xl border border-ivory-dark shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-ivory text-gold flex items-center justify-center mx-auto mb-5 border border-gold/30">
              <BedDouble className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-forest mb-3">
              Room Categories & Tariffs Updating
            </h2>
            <p className="text-sm text-forest/75 max-w-md mx-auto mb-8 leading-relaxed">
              The resort owner is currently updating room availability and seasonal tariffs. We do not display unverified or fabricated prices.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={buildWhatsAppLink(settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-forest text-forest" />
                <span>Ask Availability on WhatsApp</span>
              </a>
              <a
                href={buildTelLink(settings.phonePrimary)}
                className="px-6 py-3 rounded-xl border border-forest/20 text-forest text-xs font-semibold flex items-center gap-2 hover:bg-forest hover:text-ivory transition-colors"
              >
                <Phone className="w-4 h-4 text-gold" />
                <span>Call Owner: +91 {settings.phonePrimary}</span>
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-ivory-dark">
              <div>
                <p className="text-xs uppercase tracking-wider text-gold-dark font-semibold">
                  Showing {rooms.length} Available Room {rooms.length === 1 ? 'Category' : 'Categories'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-forest/70">
                <Info className="w-3.5 h-3.5 text-gold-dark" />
                <span>Prices in Indian Rupees (INR) per night</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  whatsappNumber={settings.whatsappNumber}
                  phone={settings.phonePrimary}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4. Additional Guest Information Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-forest-dark text-ivory rounded-3xl p-8 sm:p-10 border border-gold/30">
          <div className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold block mb-2">
              Guest Stay Guidelines
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4">
              Planning Your Stay at Hill Queen Eco Resort
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-ivory/80 pt-2">
              <div className="space-y-2">
                <p>
                  <strong>Check-in & Check-out:</strong> Standard check-in is at {settings.checkInTime} and check-out is at {settings.checkOutTime}. Early check-in or late checkout is subject to cottage availability.
                </p>
                <p>
                  <strong>Meals & Fooding:</strong> Wholesome Bengali thalis and custom preparations can be ordered. Inform our staff in advance so fresh ingredients can be sourced.
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Extra Bedding:</strong> Extra mattress or cot is available on request in select cottages. Please mention total guest count when enquiring.
                </p>
                <p>
                  <strong>Campfire:</strong> Evening campfire sessions are organized upon request during pleasant winter and autumn months.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
