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
  description: 'View authentic resort photographs and category galleries of Hill Queen Eco Resort in Mamudi, Murguma, Purulia. Cottages, room interiors, tent camping, dining, facilities, and Purulia nature.',
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

  // Authentic property photographs for the 6 official categories
  const defaultPhotos: GalleryPhoto[] = [
    // 1. Resort & Exterior
    {
      id: 'ext-1',
      imageUrl: '/images/resort/resort-front.jpg',
      caption: 'Resort front view surrounded by lush greenery and natural landscape',
      category: 'Resort & Exterior',
      displayOrder: 1,
      isPlaceholder: false,
    },
    {
      id: 'ext-2',
      imageUrl: '/images/resort/hero-aerial.jpg',
      caption: 'Aerial view of Hill Queen Eco Resort situated on top of a hill in Mamudi',
      category: 'Resort & Exterior',
      displayOrder: 2,
      isPlaceholder: false,
    },
    {
      id: 'ext-3',
      imageUrl: '/images/resort/cottages-nature.jpg',
      caption: 'Peaceful eco resort cottages nestled amidst nature and sal trees',
      category: 'Resort & Exterior',
      displayOrder: 3,
      isPlaceholder: false,
    },
    {
      id: 'ext-4',
      imageUrl: '/images/facilities/grounds-layout.jpg',
      caption: 'Resort cottages and camping lawn layout',
      category: 'Resort & Exterior',
      displayOrder: 4,
      isPlaceholder: false,
    },

    // 2. Rooms
    {
      id: 'room-1',
      imageUrl: '/images/rooms/double-bedded-room.jpg',
      caption: 'Double Bedded Room interior with comfortable bedding and peaceful hill outlook',
      category: 'Rooms',
      displayOrder: 5,
      isPlaceholder: false,
    },
    {
      id: 'room-2',
      imageUrl: '/images/rooms/double-bedding.jpg',
      caption: 'Double Bedding arrangement for couples and solo travelers',
      category: 'Rooms',
      displayOrder: 6,
      isPlaceholder: false,
    },
    {
      id: 'room-3',
      imageUrl: '/images/rooms/triple-bedded-room.png',
      caption: 'Triple Bedded Room setup with double and single bed',
      category: 'Rooms',
      displayOrder: 7,
      isPlaceholder: false,
    },
    {
      id: 'room-4',
      imageUrl: '/images/rooms/triple-bedding.jpg',
      caption: 'Triple Bedding configuration for small families',
      category: 'Rooms',
      displayOrder: 8,
      isPlaceholder: false,
    },
    {
      id: 'room-5',
      imageUrl: '/images/rooms/four-bedded-room.jpg',
      caption: 'Four Bedded Room dual bedding configuration for family comfort',
      category: 'Rooms',
      displayOrder: 9,
      isPlaceholder: false,
    },
    {
      id: 'room-6',
      imageUrl: '/images/rooms/four-bedding.jpg',
      caption: 'Four Bedded Room dual double beds layout',
      category: 'Rooms',
      displayOrder: 10,
      isPlaceholder: false,
    },
    {
      id: 'room-7',
      imageUrl: '/images/rooms/four-perspective.jpg',
      caption: 'Four Bedded Room spacious interior perspective',
      category: 'Rooms',
      displayOrder: 11,
      isPlaceholder: false,
    },
    {
      id: 'room-8',
      imageUrl: '/images/rooms/five-bedded-room.png',
      caption: 'Five Bedded Room spacious quarters with room heater and lawn access',
      category: 'Rooms',
      displayOrder: 12,
      isPlaceholder: false,
    },

    // 3. Tent Stay
    {
      id: 'tent-1',
      imageUrl: '/images/rooms/tent-accommodation.jpg',
      caption: 'Weatherproof tent accommodation pitched alongside resort grounds',
      category: 'Tent Stay',
      displayOrder: 13,
      isPlaceholder: false,
    },
    {
      id: 'tent-2',
      imageUrl: '/images/rooms/lawn-tent.png',
      caption: 'Lawn tent accommodation under clear skies and mountain air',
      category: 'Tent Stay',
      displayOrder: 14,
      isPlaceholder: false,
    },
    {
      id: 'tent-3',
      imageUrl: '/images/rooms/tents-cottages.jpg',
      caption: 'Tents alongside resort cottages amidst lush greenery',
      category: 'Tent Stay',
      displayOrder: 15,
      isPlaceholder: false,
    },
    {
      id: 'tent-4',
      imageUrl: '/images/rooms/tent-interior.jpg',
      caption: 'Comfortable four sharing camping tent interior',
      category: 'Tent Stay',
      displayOrder: 16,
      isPlaceholder: false,
    },

    // 4. Dining
    {
      id: 'dine-1',
      imageUrl: '/images/facilities/dining.jpg',
      caption: 'Resort dining area serving fresh Bengali thalis and home-cooked cuisine',
      category: 'Dining',
      displayOrder: 17,
      isPlaceholder: false,
    },

    // 5. Facilities
    {
      id: 'fac-1',
      imageUrl: '/images/facilities/bathroom.jpg',
      caption: 'Attached clean western bathroom with 24/7 running water and geyser',
      category: 'Facilities',
      displayOrder: 18,
      isPlaceholder: false,
    },
    {
      id: 'fac-2',
      imageUrl: '/images/facilities/lawns.jpg',
      caption: 'Resort lawn and open recreational spaces for peaceful evening walks',
      category: 'Facilities',
      displayOrder: 19,
      isPlaceholder: false,
    },
    {
      id: 'fac-3',
      imageUrl: '/images/facilities/kids-play.jpg',
      caption: 'Kids play area and garden swings on property',
      category: 'Facilities',
      displayOrder: 20,
      isPlaceholder: false,
    },
    {
      id: 'fac-4',
      imageUrl: '/images/facilities/bonfire.png',
      caption: 'Lawn campfire & barbecue area under clear starry Purulia skies',
      category: 'Facilities',
      displayOrder: 21,
      isPlaceholder: false,
    },

    // 6. Nature & Surroundings
    {
      id: 'nat-1',
      imageUrl: '/images/resort/valley-panorama.jpg',
      caption: 'Panoramic aerial view of Hill Queen Eco Resort and surrounding valley',
      category: 'Nature & Surroundings',
      displayOrder: 22,
      isPlaceholder: false,
    },
    {
      id: 'nat-2',
      imageUrl: '/images/resort/hill-view.jpg',
      caption: 'View of the resort property overlooking the Purulia hills',
      category: 'Nature & Surroundings',
      displayOrder: 23,
      isPlaceholder: false,
    },
    {
      id: 'nat-3',
      imageUrl: '/images/resort/murguma-landscape.jpg',
      caption: 'Scenic landscape near Murguma Dam and Ajodhya Hill ranges',
      category: 'Nature & Surroundings',
      displayOrder: 24,
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
            src="/images/resort/hero-aerial.jpg"
            alt="Hill Queen Eco Resort Aerial & Property View"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/80 to-forest-dark/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest/80 border border-gold/40 text-gold text-xs font-semibold mb-4 tracking-wider uppercase">
            <Camera className="w-3.5 h-3.5" />
            <span>Resort Visual Showcase</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ivory mb-4">
            Resort Photographic Gallery
          </h1>
          <p className="text-sm sm:text-base text-ivory/80 leading-relaxed max-w-2xl mx-auto font-light">
            Explore genuine photographs of our cottages, room categories, tent stay, dining spaces, resort facilities, and the natural beauty of Murguma, Purulia.
          </p>
        </div>
      </section>

      {/* 2. Photo Integrity & Verification Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-ivory-dark shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-forest/5 text-forest shrink-0">
              <ShieldCheck className="w-6 h-6 text-gold-dark" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-forest">
                Authentic Property Photographs
              </h2>
              <p className="text-xs sm:text-sm text-forest/75 mt-0.5">
                Every photograph shown here is captured directly at Hill Queen Eco Resort in Mamudi, Murguma, Purulia. All photos and tariffs are maintained directly by resort management.
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
              <span>WhatsApp Questions</span>
            </a>
            <a
              href={buildTelLink(settings.phonePrimary)}
              className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-gold/50 text-forest hover:bg-forest hover:text-ivory text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-gold-dark" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. Interactive Gallery Grid with Category Filters & Modal Lightbox */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <GalleryLightbox photos={displayPhotos} categories={categories} />
      </section>
    </div>
  );
}
