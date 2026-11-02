import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Users,
  Bed,
  Bath,
  Wind,
  Phone,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Utensils,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { getResortSettings, buildTelLink, buildWhatsAppLink } from '@/lib/settings';
import { DEFAULT_ROOMS, RoomData } from '@/lib/rooms';
import RoomPhotoGallery from '@/components/RoomPhotoGallery';

export const revalidate = 30;

export async function generateStaticParams() {
  return DEFAULT_ROOMS.map((r) => ({ slug: r.slug }));
}

interface RoomDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: RoomDetailPageProps) {
  try {
    const room =
      (await prisma.room.findUnique({
        where: { slug: params.slug },
      })) || DEFAULT_ROOMS.find((r) => r.slug === params.slug);
    if (!room) return { title: 'Room Not Found | Hill Queen Eco Resort' };

    return {
      title: `${room.name} | Hill Queen Eco Resort, Murguma, Purulia`,
      description: `${room.name} at Hill Queen Eco Resort in Mamudi, Murguma, Purulia. ${room.description.slice(0, 150)}...`,
    };
  } catch (e) {
    const fallback = DEFAULT_ROOMS.find((r) => r.slug === params.slug);
    if (fallback) {
      return {
        title: `${fallback.name} | Hill Queen Eco Resort, Murguma, Purulia`,
        description: `${fallback.name} at Hill Queen Eco Resort in Mamudi, Murguma, Purulia. ${fallback.description.slice(0, 150)}...`,
      };
    }
    return { title: 'Cottages | Hill Queen Eco Resort' };
  }
}

export default async function RoomDetailPage({ params }: RoomDetailPageProps) {
  const settings = await getResortSettings();

  let room: (RoomData & { images?: Array<{ id?: string; imageUrl: string; caption?: string | null; displayOrder?: number }> }) | null = null;
  try {
    const dbRoom = await prisma.room.findUnique({
      where: { slug: params.slug },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
    if (dbRoom) {
      room = dbRoom as unknown as (RoomData & { images?: Array<{ id?: string; imageUrl: string; caption?: string | null; displayOrder?: number }> });
    }
  } catch (error) {
    console.error('Error fetching room by slug:', error);
  }

  if (!room) {
    const fallback = DEFAULT_ROOMS.find((r) => r.slug === params.slug);
    if (fallback) {
      room = fallback;
    } else {
      notFound();
      return null;
    }
  }

  const formattedPrice = `₹${room.price.toLocaleString('en-IN')}`;
  const amenitiesList: string[] = room.amenities
    ? (room.amenities as string).split(',').map((a: string) => a.trim()).filter(Boolean)
    : [];

  // Combine main image and additional images
  const allImages = [
    { id: 'main', imageUrl: room.mainImage, caption: 'Primary View' },
    ...(room.images || []),
  ];

  return (
    <div className="bg-[#FAF7EF] min-h-screen text-forest pb-24">
      {/* 1. Breadcrumb bar */}
      <div className="bg-forest-dark text-ivory py-4 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 text-xs text-gold hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Accommodations</span>
          </Link>
          <span className="text-xs text-ivory/60 hidden sm:inline">
            Mamudi, Murguma, Purulia
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Photos & Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-forest text-gold border border-gold/30">
                  {room.roomType || 'Cottage'}
                </span>
                <span className="text-xs text-forest/60">
                  Hill Queen Eco Resort
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-forest mb-3">
                {room.name}
              </h1>
              <p className="text-sm sm:text-base text-forest/75 leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Photo Showcase Gallery with Interactive Lightbox */}
            <RoomPhotoGallery roomName={room.name} images={allImages} />

            {/* Room Specifications Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-dark shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold text-forest border-b border-ivory-dark pb-4">
                Room Features & Facilities
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-ivory text-gold shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-forest/60 block">Occupancy</span>
                    <strong className="text-forest font-semibold">
                      Up to {room.maximumOccupancy} Guests
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-ivory text-gold shrink-0">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-forest/60 block">Bed Layout</span>
                    <strong className="text-forest font-semibold">
                      {room.bedConfiguration}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-ivory text-gold shrink-0">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-forest/60 block">Bathroom</span>
                    <strong className="text-forest font-semibold">
                      {room.hasAttachedBath ? 'Attached Western Bath' : 'Shared Facility'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-ivory text-gold shrink-0">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-forest/60 block">Ventilation</span>
                    <strong className="text-forest font-semibold">
                      {room.isAc ? 'Air Conditioned' : 'Natural Hill Breeze / Fan'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-ivory text-gold shrink-0">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-forest/60 block">Extra Bedding</span>
                    <strong className="text-forest font-semibold">
                      {room.extraBedAvailable ? 'Available on Request' : 'Not Available'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-ivory text-gold shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-forest/60 block">Dining</span>
                    <strong className="text-forest font-semibold">
                      On-site Kitchen
                    </strong>
                  </div>
                </div>
              </div>

              {/* Food Inclusions */}
              {room.foodInclusion && (
                <div className="p-4 rounded-2xl bg-ivory border border-ivory-dark flex items-start gap-3 text-xs sm:text-sm">
                  <Utensils className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-forest mb-0.5">Meal Information:</strong>
                    <span className="text-forest/80 leading-relaxed">{room.foodInclusion}</span>
                  </div>
                </div>
              )}

              {/* Amenities List */}
              {amenitiesList.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-dark mb-3">
                    All Included Amenities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm">
                    {amenitiesList.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-forest/85">
                        <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Pricing & Direct WhatsApp / Call Enquiry Box (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-luxury space-y-6">
              {/* Tariff Card */}
              <div className="border-b border-ivory-dark pb-5">
                <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold block mb-1">
                  Approved Nightly Tariff
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-forest">
                    {formattedPrice}
                  </span>
                  <span className="text-xs text-forest/70 font-medium">/ night</span>
                </div>
                <p className="text-[11px] text-forest/60 mt-1">
                  Taxes & dining as per chosen packages. Direct owner rate.
                </p>
              </div>

              {/* Direct Enquiry Actions */}
              <div className="space-y-3">
                <div className="text-xs text-forest/80 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>No Booking Engine / Direct Inquiry Only</span>
                </div>

                {/* Pre-filled WhatsApp button as strictly requested in prompt! */}
                <a
                  href={buildWhatsAppLink(settings.whatsappNumber, room.name, room.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-gold py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-luxury uppercase tracking-wider"
                >
                  <MessageSquare className="w-4 h-4 fill-forest text-forest" />
                  <span>Enquire on WhatsApp</span>
                </a>

                {/* Direct Call Button */}
                <a
                  href={buildTelLink(settings.phonePrimary)}
                  className="w-full py-3 px-4 rounded-2xl border-2 border-forest/20 text-forest hover:bg-forest hover:text-ivory text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-gold" />
                  <span>Call to Check Dates</span>
                </a>
              </div>

              {/* Pre-formatted message notice */}
              <div className="p-3.5 rounded-xl bg-ivory/60 border border-ivory-dark text-[11px] text-forest/70 leading-relaxed">
                <span className="font-semibold block text-forest mb-1">WhatsApp message template:</span>
                <p className="italic">
                  &ldquo;Hello Hill Queen Eco Resort, I would like to enquire about: Room: {room.name}, Price shown: {formattedPrice}. Please share the current availability and details. Thank you.&rdquo;
                </p>
              </div>

              {/* Verified contact numbers */}
              <div className="pt-4 border-t border-ivory-dark text-xs space-y-2">
                <span className="font-semibold block text-forest">Direct Contact Numbers:</span>
                <div className="space-y-1">
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                    <a href={buildTelLink(settings.phonePrimary)} className="hover:text-gold font-medium">
                      +91 {settings.phonePrimary} (Primary)
                    </a>
                  </p>
                  {settings.phoneSecondary && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                      <a href={buildTelLink(settings.phoneSecondary)} className="hover:text-gold">
                        +91 {settings.phoneSecondary}
                      </a>
                    </p>
                  )}
                  {settings.phoneTertiary && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                      <a href={buildTelLink(settings.phoneTertiary)} className="hover:text-gold">
                        +91 {settings.phoneTertiary}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
