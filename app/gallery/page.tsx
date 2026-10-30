import React from 'react';
import Image from 'next/image';
import { Camera, Sparkles, Phone, MessageSquare } from 'lucide-react';
import prisma from '@/lib/prisma';
import { getResortSettings, buildTelLink, buildWhatsAppLink } from '@/lib/settings';
import GalleryLightbox, { GalleryPhoto } from '@/components/GalleryLightbox';

export const revalidate = 60;

export const metadata = {
  title: 'Photo Gallery | Hill Queen Eco Resort, Murguma, Purulia',
  description: 'View photographs of Hill Queen Eco Resort in Mamudi, Murguma, Purulia. Explore our resort exteriors, cottages, property surroundings, food, and nearby attractions.',
};

export default async function GalleryPage() {
  const settings = await getResortSettings();

  const categories = [
    'Resort Exterior',
    'Rooms',
    'Property Surroundings',
    'Food',
    'Facilities',
    'Nearby Attractions',
  ];

  let photos: GalleryPhoto[] = [];
  try {
    photos = (await prisma.galleryImage.findMany({
      orderBy: { displayOrder: 'asc' },
    })) as GalleryPhoto[];
  } catch (error) {
    console.warn('Could not fetch gallery images from DB:', error);
  }

  // Fallback high-resolution categorized placeholder photos if database is empty
  const defaultPhotos: GalleryPhoto[] = [
    {
      id: 'p1',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
      caption: 'Sunset across Murguma Dam water body [Preview Placeholder]',
      category: 'Nearby Attractions',
      displayOrder: 1,
    },
    {
      id: 'p2',
      imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200&auto=format&fit=crop',
      caption: 'Eco Cottage front amidst quiet greenery [Preview Placeholder]',
      category: 'Resort Exterior',
      displayOrder: 2,
    },
    {
      id: 'p3',
      imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop',
      caption: 'Warm wooden interiors and clean double bedding [Preview Placeholder]',
      category: 'Rooms',
      displayOrder: 3,
    },
    {
      id: 'p4',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
      caption: 'Pristine village paths and tree cover in Mamudi [Preview Placeholder]',
      category: 'Property Surroundings',
      displayOrder: 4,
    },
    {
      id: 'p5',
      imageUrl: 'https://images.unsplash.com/photo-1613769049987-b31b641f25b1?q=80&w=1200&auto=format&fit=crop',
      caption: 'Fresh Bengali thali meals cooked on-demand [Preview Placeholder]',
      category: 'Food',
      displayOrder: 5,
    },
    {
      id: 'p6',
      imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop',
      caption: 'Evening open grounds and campfire area [Preview Placeholder]',
      category: 'Facilities',
      displayOrder: 6,
    },
    {
      id: 'p7',
      imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop',
      caption: 'Cottage veranda overlooking lush foliage [Preview Placeholder]',
      category: 'Resort Exterior',
      displayOrder: 7,
    },
    {
      id: 'p8',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      caption: 'Serene lakeside reflection near Murguma [Preview Placeholder]',
      category: 'Nearby Attractions',
      displayOrder: 8,
    },
    {
      id: 'p9',
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop',
      caption: 'Spacious cottage interior layout [Preview Placeholder]',
      category: 'Rooms',
      displayOrder: 9,
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

      {/* 2. Interactive Gallery Component with Lightbox & Category Filters */}
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
