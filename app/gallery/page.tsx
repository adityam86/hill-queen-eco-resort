import React from 'react';
import Image from 'next/image';
import { Camera, Sparkles, Phone, MessageSquare, ShieldCheck } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getResortSettings, buildTelLink, buildWhatsAppLink } from '@/lib/settings';
import GalleryLightbox, { GalleryPhoto } from '@/components/GalleryLightbox';
import { RESORT_GALLERY_CATEGORIES } from '@/lib/gallery-categories';

export const revalidate = 60;

export const metadata = {
  title: 'Photo Gallery | Hill Queen Eco Resort, Murguma, Purulia',
  description: 'View authentic photographs and preview imagery of Hill Queen Eco Resort in Mamudi, Murguma, Purulia. Cottages, room interiors, dining, lake views, gardens, and nearby attractions.',
};

export default async function GalleryPage() {
  const settings = await getResortSettings();

  const categories = [...RESORT_GALLERY_CATEGORIES];

  let photos: GalleryPhoto[] = [];
  try {
    photos = (await prisma.galleryImage.findMany({
      orderBy: { displayOrder: 'asc' },
    })) as GalleryPhoto[];
  } catch (error) {
    console.warn('Could not fetch gallery images from DB:', error);
  }

  // Genuine property photographs sourced from Hill Queen Eco Resort property catalog
  const defaultPhotos: GalleryPhoto[] = [
    // 1. Resort exterior and entrance
    {
      id: 'ext-1',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757148135/property/1681/dpdh7fib0zdhqmqkf0bx.jpg',
      caption: 'Resort front view surrounded by lush greenery and natural landscape',
      category: 'Resort exterior and entrance',
      displayOrder: 1,
      isPlaceholder: false,
    },
    {
      id: 'ext-2',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1789021168/property/1681/amrfgp0bcx2safe9zrhe.jpg',
      caption: 'Aerial view of Hill Queen Eco Resort on top of a hill',
      category: 'Resort exterior and entrance',
      displayOrder: 2,
      isPlaceholder: false,
    },
    {
      id: 'ext-3',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1789021166/property/1681/koxysnfsdnlbivueazwi.jpg',
      caption: 'Peaceful eco resort cottages nestled amidst nature',
      category: 'Resort exterior and entrance',
      displayOrder: 3,
      isPlaceholder: false,
    },

    // 2. Rooms and cottages
    {
      id: 'room-1',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1766139915/room/1290/wz2jfnidnp9ajvozaoin.jpg',
      caption: 'Weatherproof tent accommodation pitched alongside resort grounds',
      category: 'Rooms and cottages',
      displayOrder: 4,
      isPlaceholder: false,
    },
    {
      id: 'room-2',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160554/property/1681/g5hqfygdt6mcvqcrq4ve.jpg',
      caption: 'Tents along with cottage rooms amidst lush greenery',
      category: 'Rooms and cottages',
      displayOrder: 5,
      isPlaceholder: false,
    },
    {
      id: 'room-3',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160411/property/1681/sdpnkcqg5tadhtsd4pni.jpg',
      caption: 'Resort cottages and camping lawn layout',
      category: 'Rooms and cottages',
      displayOrder: 6,
      isPlaceholder: false,
    },

    // 3. Room interiors
    {
      id: 'int-1',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1766140239/room/1291/kk12uawsodcjszmathmj.jpg',
      caption: 'Double Bedded Room interior with comfortable mattress and hill views',
      category: 'Room interiors',
      displayOrder: 7,
      isPlaceholder: false,
    },
    {
      id: 'int-2',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757149492/property/1681/nlhtuuj3bteh3hcql3er.jpg',
      caption: 'Four Bedded Room dual bedding configuration for family comfort',
      category: 'Room interiors',
      displayOrder: 8,
      isPlaceholder: false,
    },
    {
      id: 'int-3',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757159995/property/1681/oajowwhxeypksme0atus.jpg',
      caption: 'Attached clean western bathroom with 24/7 running water',
      category: 'Room interiors',
      displayOrder: 9,
      isPlaceholder: false,
    },

    // 4. Restaurant and dining
    {
      id: 'dine-1',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757151762/property/1681/wnvom3wvc0pgxgdoki1p.jpg',
      caption: 'Resort dining area serving fresh Bengali thalis and home-cooked cuisine',
      category: 'Restaurant and dining',
      displayOrder: 10,
      isPlaceholder: false,
    },

    // 5. Mountain and lake views
    {
      id: 'view-1',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757148303/property/1681/idav04rvlglak4qzbkbz.jpg',
      caption: 'Panoramic aerial view of Hill Queen Eco Resort and surrounding valley',
      category: 'Mountain and lake views',
      displayOrder: 11,
      isPlaceholder: false,
    },
    {
      id: 'view-2',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757148858/property/1681/ih5j3evg6b3apr3516yl.jpg',
      caption: 'View of the resort property overlooking the Purulia hills',
      category: 'Mountain and lake views',
      displayOrder: 12,
      isPlaceholder: false,
    },

    // 6. Gardens and outdoor areas
    {
      id: 'gard-1',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160248/property/1681/zqcxn3zpunipmz33tjc8.jpg',
      caption: 'Resort lawn and open recreational spaces for peaceful evening walks',
      category: 'Gardens and outdoor areas',
      displayOrder: 13,
      isPlaceholder: false,
    },
    {
      id: 'gard-2',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160188/property/1681/u6vhqsmxlfcfkjxber0h.jpg',
      caption: 'Kids play area and garden swings on property',
      category: 'Gardens and outdoor areas',
      displayOrder: 14,
      isPlaceholder: false,
    },

    // 7. Activities and experiences
    {
      id: 'act-1',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757160095/property/1681/ponaqgpem2bp44ppihaj.png',
      caption: 'Lawn campfire & barbecue area under clear starry Purulia skies',
      category: 'Activities and experiences',
      displayOrder: 15,
      isPlaceholder: false,
    },
    {
      id: 'act-2',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757159836/property/1681/oxyynrssknojbs0o55ln.jpg',
      caption: 'Comfortable four sharing camping tent interior',
      category: 'Activities and experiences',
      displayOrder: 16,
      isPlaceholder: false,
    },

    // 8. Nearby tourist attractions
    {
      id: 'att-1',
      imageUrl: 'https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1757149805/property/1681/acjuz3qey51j5lqhnlvm.jpg',
      caption: 'Scenic landscape near Murguma Dam and Ajodhya Hill ranges',
      category: 'Nearby tourist attractions',
      displayOrder: 17,
      isPlaceholder: false,
    },
  ];

  const displayPhotos = photos.length > 0 ? photos : defaultPhotos;

  return (
    <div className="bg-[#FAF7EF] min-h-screen text-forest pb-24">
      {/* 1. Header Banner */}
      <section className="relative py-20 sm:py-24 bg-forest-dark text-ivory overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/fusionstays/image/upload/c_fill,e_sharpen:100,q_auto,f_auto,fl_progressive/v1789021168/property/1681/amrfgp0bcx2safe9zrhe.jpg"
            alt="Aerial view of Hill Queen Eco Resort"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/80 to-forest-dark/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest/80 border border-gold/40 text-gold text-xs font-semibold mb-4 tracking-wider uppercase">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Glimpse of Serenity</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ivory mb-4">
            Resort & Surroundings Gallery
          </h1>
          <p className="text-sm sm:text-base text-ivory/80 leading-relaxed max-w-2xl mx-auto font-light">
            Take a visual tour through Hill Queen Eco Resort, our cottages, natural environments, wholesome food, and scenic highlights around Murguma Dam.
          </p>
        </div>
      </section>

      {/* 2. Interactive Gallery Component with Lightbox & 8 Category Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <GalleryLightbox photos={displayPhotos} categories={categories} />
      </section>

      {/* 3. Direct Contact CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-forest text-ivory border border-gold/30 shadow-luxury">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ivory mb-3">
            Want to Experience Murguma in Person?
          </h2>
          <p className="text-xs sm:text-sm text-ivory/80 max-w-md mx-auto mb-6">
            Chat directly with our team on WhatsApp or call our resort desk for cottage availability and directions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={buildWhatsAppLink(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-7 py-3 rounded-full text-xs font-bold flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-forest text-forest" />
              <span>WhatsApp Direct Enquiry</span>
            </a>
            <a
              href={buildTelLink(settings.phonePrimary)}
              className="px-7 py-3 rounded-full border border-gold/40 text-ivory hover:text-gold text-xs font-semibold flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-gold" />
              <span>Call: +91 {settings.phonePrimary}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
