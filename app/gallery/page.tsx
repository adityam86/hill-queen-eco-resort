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

  // Curated, tasteful placeholder photographs for each of the 8 categories
  // Explicitly labeled so visitors are never misled before the resort owner uploads authentic on-property photos
  const defaultPhotos: GalleryPhoto[] = [
    // 1. Resort exterior and entrance
    {
      id: 'ext-1',
      imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Eco-cottage exterior with veranda and natural stone pathway',
      category: 'Resort exterior and entrance',
      displayOrder: 1,
      isPlaceholder: true,
    },
    {
      id: 'ext-2',
      imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Rustic cottage entrance surrounded by quiet forested hillocks',
      category: 'Resort exterior and entrance',
      displayOrder: 2,
      isPlaceholder: true,
    },

    // 2. Rooms and cottages
    {
      id: 'room-1',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Independent hillside family cottages nestled among sal groves',
      category: 'Rooms and cottages',
      displayOrder: 3,
      isPlaceholder: true,
    },
    {
      id: 'room-2',
      imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Private cottage porch overlooking serene rural landscapes',
      category: 'Rooms and cottages',
      displayOrder: 4,
      isPlaceholder: true,
    },

    // 3. Room interiors
    {
      id: 'int-1',
      imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Cozy bedroom with comfortable wooden double bed and reading lamp',
      category: 'Room interiors',
      displayOrder: 5,
      isPlaceholder: true,
    },
    {
      id: 'int-2',
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Clean interior layout with window views of surrounding hills',
      category: 'Room interiors',
      displayOrder: 6,
      isPlaceholder: true,
    },

    // 4. Restaurant and dining
    {
      id: 'dine-1',
      imageUrl: 'https://images.unsplash.com/photo-1613769049987-b31b641f25b1?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Fresh regional Bengali thali meals and traditional home-style cooking',
      category: 'Restaurant and dining',
      displayOrder: 7,
      isPlaceholder: true,
    },
    {
      id: 'dine-2',
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Morning tea and wholesome breakfast freshly prepared on order',
      category: 'Restaurant and dining',
      displayOrder: 8,
      isPlaceholder: true,
    },

    // 5. Mountain and lake views
    {
      id: 'view-1',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Sunset panorama across Murguma Lake and the Ajodhya ridges',
      category: 'Mountain and lake views',
      displayOrder: 9,
      isPlaceholder: true,
    },
    {
      id: 'view-2',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Peaceful early morning water reflections near Mamudi valley',
      category: 'Mountain and lake views',
      displayOrder: 10,
      isPlaceholder: true,
    },

    // 6. Gardens and outdoor areas
    {
      id: 'gard-1',
      imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Open grassy courtyard for peaceful afternoon relaxation and nature walks',
      category: 'Gardens and outdoor areas',
      displayOrder: 11,
      isPlaceholder: true,
    },
    {
      id: 'gard-2',
      imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Rustic open-air garden spaces flanked by native green flora',
      category: 'Gardens and outdoor areas',
      displayOrder: 12,
      isPlaceholder: true,
    },

    // 7. Activities and experiences
    {
      id: 'act-1',
      imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Evening outdoor campfire gathering under the clear, star-lit Purulia sky',
      category: 'Activities and experiences',
      displayOrder: 13,
      isPlaceholder: true,
    },
    {
      id: 'act-2',
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
      caption: '[Preview Placeholder] Morning nature trails through peaceful forested village pathways',
      category: 'Activities and experiences',
      displayOrder: 14,
      isPlaceholder: true,
    },

    // 8. Nearby tourist attractions
    {
      id: 'att-1',
      imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop',
      caption: '[Attraction Guide] Cascading mountain streams at Bamni and Turga Waterfalls (approx. 24 km)',
      category: 'Nearby tourist attractions',
      displayOrder: 15,
      isPlaceholder: true,
    },
    {
      id: 'att-2',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
      caption: '[Attraction Guide] Ajodhya Hills viewpoint overlooking the vast forested plateau (approx. 18 km)',
      category: 'Nearby tourist attractions',
      displayOrder: 16,
      isPlaceholder: true,
    },
  ];

  const displayPhotos = photos.length > 0 ? photos : defaultPhotos;

  return (
    <div className="bg-[#FAF7EF] min-h-screen text-forest pb-24">
      {/* 1. Header Banner */}
      <section className="relative py-20 sm:py-24 bg-forest-dark text-ivory overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop"
            alt="Murguma landscape"
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
