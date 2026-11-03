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

  // Bespoke property placeholders and authentic photographs for the 6 official categories
  const defaultPhotos: GalleryPhoto[] = [
    // 1. Resort & Exterior
    {
      id: 'ext-1',
      imageUrl: '/images/placeholders/gallery-resort-exterior.svg',
      caption: 'Hill Queen Eco Resort property view nestled amidst greenery and Purulia hills',
      category: 'Resort & Exterior',
      displayOrder: 1,
      isPlaceholder: true,
    },
    {
      id: 'ext-2',
      imageUrl: '/images/placeholders/hero-resort.svg',
      caption: 'Hilltop aerial perspective of the resort in the tranquil valley of Mamudi',
      category: 'Resort & Exterior',
      displayOrder: 2,
      isPlaceholder: true,
    },
    {
      id: 'ext-3',
      imageUrl: '/images/placeholders/about-resort.svg',
      caption: 'Eco cottages surrounded by sal trees and fresh mountain breezes',
      category: 'Resort & Exterior',
      displayOrder: 3,
      isPlaceholder: true,
    },

    // 2. Rooms
    {
      id: 'room-1',
      imageUrl: '/images/placeholders/double-bedded-room.svg',
      caption: 'Double Bedded Room with air conditioning and serene hillside outlook',
      category: 'Rooms',
      displayOrder: 4,
      isPlaceholder: true,
    },
    {
      id: 'room-2',
      imageUrl: '/images/placeholders/triple-bedded-room.svg',
      caption: 'Triple Bedded Room equipped with double bed and single bed for small families',
      category: 'Rooms',
      displayOrder: 5,
      isPlaceholder: true,
    },
    {
      id: 'room-3',
      imageUrl: '/images/placeholders/four-bedded-room.svg',
      caption: 'Four Bedded Room dual bed arrangement suited for family holidays',
      category: 'Rooms',
      displayOrder: 6,
      isPlaceholder: true,
    },
    {
      id: 'room-4',
      imageUrl: '/images/placeholders/five-bedded-room.svg',
      caption: 'Five Bedded Room spacious living quarters with room heating',
      category: 'Rooms',
      displayOrder: 7,
      isPlaceholder: true,
    },

    // 3. Tent Stay
    {
      id: 'tent-1',
      imageUrl: '/images/placeholders/tent-accommodation.svg',
      caption: 'Weatherproof canvas tent pitched on green grounds for nature camping',
      category: 'Tent Stay',
      displayOrder: 8,
      isPlaceholder: true,
    },
    {
      id: 'tent-2',
      imageUrl: '/images/placeholders/gallery-tent-stay.svg',
      caption: 'Tent camping experience with campfire grounds and starry skies',
      category: 'Tent Stay',
      displayOrder: 9,
      isPlaceholder: true,
    },

    // 4. Dining
    {
      id: 'dine-1',
      imageUrl: '/images/placeholders/facility-dining.svg',
      caption: 'Resort kitchen & dining area serving fresh Bengali cuisine and local thalis',
      category: 'Dining',
      displayOrder: 10,
      isPlaceholder: true,
    },
    {
      id: 'dine-2',
      imageUrl: '/images/placeholders/gallery-dining.svg',
      caption: 'Wholesome home-cooked preparations and hot morning tea on the veranda',
      category: 'Dining',
      displayOrder: 11,
      isPlaceholder: true,
    },

    // 5. Facilities
    {
      id: 'fac-1',
      imageUrl: '/images/placeholders/facility-bathroom.svg',
      caption: 'Modern attached western bathrooms with 24/7 running water and geyser',
      category: 'Facilities',
      displayOrder: 12,
      isPlaceholder: true,
    },
    {
      id: 'fac-2',
      imageUrl: '/images/placeholders/facility-gardens.svg',
      caption: 'Spacious green lawns and open courtyards for peaceful walks',
      category: 'Facilities',
      displayOrder: 13,
      isPlaceholder: true,
    },
    {
      id: 'fac-3',
      imageUrl: '/images/placeholders/facility-kidsplay.svg',
      caption: "Safe children's play area and open grounds for family recreation",
      category: 'Facilities',
      displayOrder: 14,
      isPlaceholder: true,
    },
    {
      id: 'fac-4',
      imageUrl: '/images/placeholders/facility-bonfire.svg',
      caption: 'Evening bonfire & campfire area for acoustic gatherings under the stars',
      category: 'Facilities',
      displayOrder: 15,
      isPlaceholder: true,
    },
    {
      id: 'fac-5',
      imageUrl: '/images/placeholders/facility-parking.svg',
      caption: 'Secure on-site parking for guest cars and two-wheelers',
      category: 'Facilities',
      displayOrder: 16,
      isPlaceholder: true,
    },

    // 6. Nature & Surroundings
    {
      id: 'nat-1',
      imageUrl: '/images/placeholders/gallery-nature.svg',
      caption: 'Murguma Dam and surrounding Ajodhya hill peaks near Mamudi village',
      category: 'Nature & Surroundings',
      displayOrder: 17,
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
            src="/images/placeholders/hero-resort.svg"
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
            Explore genuine views of our cottages, room categories, tent stay, dining spaces, resort facilities, and the natural beauty of Murguma, Purulia.
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
                Authentic Resort Imagery
              </h2>
              <p className="text-xs sm:text-sm text-forest/75 mt-0.5">
                We believe in genuine representations. Photos are verified and managed directly by resort staff through the owner portal. Placeholders are clearly identified to prevent misleading travelers.
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
