import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Mountain,
  Compass,
  Utensils,
  Flame,
  Bath,
  ShieldCheck,
  Phone,
  MessageSquare,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import prisma from '@/lib/prisma';
import {
  getResortSettings,
  buildTelLink,
  buildWhatsAppLink,
  buildMapEmbedUrl,
  buildGoogleMapsOpenUrl,
  buildGoogleMapsDirectionsUrl,
} from '@/lib/settings';
import RoomCard, { RoomData } from '@/components/RoomCard';
import { DEFAULT_ROOMS } from '@/lib/rooms';
import NearbyAttractions from '@/components/NearbyAttractions';
import { getAttractions } from '@/lib/attractions';

export const revalidate = 60; // Revalidate every minute or on-demand

export default async function HomePage() {
  const settings = await getResortSettings();

  // Fetch active rooms dynamically from database
  let rooms: RoomData[] = [];
  try {
    rooms = (await prisma.room.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    })) as RoomData[];
  } catch (error) {
    console.warn('Could not query rooms for homepage, using fallback rooms:', error);
  }

  if (rooms.length === 0) {
    rooms = DEFAULT_ROOMS;
  }

  // Fetch facilities
  let facilities = [];
  try {
    facilities = await prisma.facility.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      take: 6,
    });
  } catch (error) {
    facilities = [];
  }

  // Fallback verified facilities matching property amenities
  const defaultFacilities = [
    {
      title: 'Restaurant & Dining Area',
      description: 'Hygienic and flavorful local Bengali thalis, fresh morning tea, and home-cooked meals prepared on order.',
      image: '/images/facilities/dining.jpg',
      tag: 'Homely Cuisine',
      icon: Utensils,
    },
    {
      title: 'Modern Attached Bathrooms',
      description: 'Clean western sanitation with continuous 24/7 running water and hot water geysers in all rooms.',
      image: '/images/facilities/bathroom.jpg',
      tag: '24/7 Running Water',
      icon: Bath,
    },
    {
      title: 'Garden & Open Lawns',
      description: 'Lush green open spaces and natural courtyards for peaceful morning strolls, tea, and outdoor relaxation.',
      image: '/images/facilities/lawns.jpg',
      tag: 'Nature Spaces',
      icon: Mountain,
    },
    {
      title: "Children's Play Area",
      description: 'Safe outdoor garden pathways and play zones for families traveling with children in a quiet country setting.',
      image: '/images/facilities/kids-play.jpg',
      tag: 'Family Friendly',
      icon: Sparkles,
    },
    {
      title: 'Bonfire & Outdoor Campfire',
      description: 'Spacious open grounds ideal for evening campfire sessions, acoustic moments, and clear night stargazing.',
      image: '/images/facilities/bonfire.png',
      tag: 'Stargazing Nights',
      icon: Flame,
    },
    {
      title: 'Secure On-Site Parking',
      description: 'Safe on-premises private parking space for cars and motorcycles with staff assistance upon arrival.',
      image: '/images/facilities/grounds-layout.jpg',
      tag: 'Safe & Gated',
      icon: ShieldCheck,
    },
  ];

  // Fetch verified Purulia attractions
  const attractions = await getAttractions();

  return (
    <div className="flex flex-col">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-forest-dark text-ivory">
        {/* Background Image with Dark/Warm Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/resort/hero-aerial.jpg"
            alt="Hill Queen Eco Resort hill aerial landscape"
            fill
            priority
            className="object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/70 to-forest-dark/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-forest-dark/30 to-forest-dark" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
          {/* Nature Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest/80 border border-gold/40 text-gold text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>MAMUDI • MURGUMA • PURULIA • WEST BENGAL 723152</span>
          </div>

          {/* Main Brand Title & Tagline */}
          <h2 className="text-xs sm:text-sm uppercase tracking-[0.35em] text-gold font-semibold mb-3">
            {settings.resortName}
          </h2>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-ivory leading-[1.15] mb-6">
            {settings.heroHeading}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-ivory/85 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            {settings.heroSubheading}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/rooms"
              className="w-full sm:w-auto btn-gold px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-luxury"
            >
              <span>Explore Rooms & Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={buildWhatsAppLink(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-forest/90 hover:bg-forest text-ivory border border-gold/40 hover:border-gold text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all backdrop-blur-md"
            >
              <MessageSquare className="w-4 h-4 text-gold" />
              <span>WhatsApp Direct Enquiry</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="mt-14 pt-8 border-t border-gold/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
              <span className="text-xs text-ivory/80">Direct Owner Tariffs</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
              <span className="text-xs text-ivory/80">No Third-Party Commissions</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
              <span className="text-xs text-ivory/80">Cottages & Scenic Surrounds</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
              <span className="text-xs text-ivory/80">Homely Regional Cuisine</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE RESORT INTRODUCTION */}
      <section className="py-20 sm:py-28 bg-[#FAF7EF] text-forest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-dark font-semibold">
                <Mountain className="w-4 h-4" />
                <span>Our Nature Philosophy</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-forest leading-tight">
                Escape Into Nature. Stay Close to Serenity.
              </h2>

              <p className="text-base sm:text-lg text-forest/80 leading-relaxed">
                {settings.aboutText ||
                  'Nestled in the tranquil valley of Mamudi near the scenic Murguma Dam in Purulia, West Bengal, Hill Queen Eco Resort is a peaceful nature retreat designed for travellers seeking rest, clean mountain air, and authentic hospitality.'}
              </p>

              <p className="text-sm sm:text-base text-forest/75 leading-relaxed">
                Unlike crowded commercial hotel hubs, Hill Queen Eco Resort offers a refreshing countryside escape where the days start with golden sunlight over the hills, bird songs from sal groves, and freshly brewed morning tea on your private cottage veranda.
              </p>

              {/* Verified Contact Details Grid */}
              <div className="p-5 rounded-2xl bg-white border border-ivory-dark shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-forest/60 block font-medium mb-1">Resort Location:</span>
                  <p className="font-semibold text-forest">
                    {settings.address}
                  </p>
                </div>
                <div>
                  <span className="text-forest/60 block font-medium mb-1">Direct Call Lines:</span>
                  <p className="font-semibold text-forest">
                    +91 {settings.phonePrimary} / {settings.phoneSecondary}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gold-dark hover:text-forest transition-colors underline underline-offset-4"
                >
                  <span>Learn more about our resort & surroundings</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Imagery Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[420px] sm:h-[480px] rounded-3xl overflow-hidden shadow-luxury border-4 border-white">
                <Image
                  src="/images/resort/resort-front.jpg"
                  alt="Hill Queen Eco Resort cottage preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-forest-dark/85 backdrop-blur-md p-4 rounded-2xl border border-gold/30 text-ivory">
                  <span className="text-[10px] uppercase tracking-widest text-gold block font-semibold mb-0.5">
                    Authentic Serenity
                  </span>
                  <p className="text-xs text-ivory/90 leading-tight">
                    Cottages nestled directly in nature with attached modern amenities.
                  </p>
                </div>
              </div>

              {/* Floating Decorative Badge */}
              <div className="absolute -top-6 -left-6 bg-gold text-forest p-4 rounded-2xl shadow-luxury-lg hidden sm:block border-2 border-white">
                <p className="font-serif text-2xl font-bold">100%</p>
                <p className="text-[10px] uppercase tracking-wider font-semibold">Peaceful Nature</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACCOMMODATION & DYNAMIC ROOM CARDS */}
      <section className="py-20 sm:py-28 bg-white border-y border-ivory-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-dark font-semibold mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Accommodation & Transparent Tariffs</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-forest">
                Cottages & Rooms
              </h2>
              <p className="text-sm sm:text-base text-forest/70 mt-2 max-w-xl">
                All prices are set and updated directly by the resort owner. No hidden platform charges or instant card deductions.
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <Link
                href="/rooms"
                className="btn-forest px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
              >
                <span>View All Accommodations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Rooms Grid */}
          {rooms.length === 0 ? (
            <div className="text-center py-16 px-4 bg-ivory/50 rounded-3xl border border-ivory-dark max-w-2xl mx-auto">
              <Mountain className="w-12 h-12 text-gold mx-auto mb-3" />
              <h3 className="font-serif text-xl font-bold text-forest mb-2">
                Accommodation Tariffs Being Updated
              </h3>
              <p className="text-xs sm:text-sm text-forest/70 max-w-md mx-auto mb-6">
                Room categories and verified prices will appear here once configured by the resort management. In the meantime, please connect directly with us for current tariffs.
              </p>
              <a
                href={buildWhatsAppLink(settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-6 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-forest text-forest" />
                <span>Enquire Current Room Rates</span>
              </a>
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* 4. VERIFIED RESORT FACILITIES */}
      <section className="py-20 sm:py-28 bg-[#FAF7EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
              Authentic Hospitality
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-forest mt-2 mb-4">
              Resort Amenities & Comforts
            </h2>
            <p className="text-sm sm:text-base text-forest/75 leading-relaxed">
              We focus on genuine comfort, cleanliness, and peace. All facilities are real and maintained with dedication.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {defaultFacilities.map((facility, idx) => {
              const IconComponent = facility.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-ivory-dark shadow-sm hover:shadow-luxury transition-all duration-300 group overflow-hidden flex flex-col"
                >
                  <div className="relative h-48 w-full bg-forest-dark overflow-hidden">
                    <Image
                      src={facility.image}
                      alt={facility.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-black/20" />
                    <span className="absolute top-3 right-3 text-[10px] bg-forest-dark/80 backdrop-blur-sm text-gold px-2.5 py-0.5 rounded-full border border-gold/30 font-semibold tracking-wider uppercase">
                      {facility.tag}
                    </span>
                    <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl bg-forest/90 text-gold flex items-center justify-center border border-gold/30">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-forest mb-2">
                        {facility.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                        {facility.description}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-ivory-dark flex items-center justify-between text-[11px] text-forest/60">
                      <span>Hill Queen Eco Resort</span>
                      <span className="text-gold font-medium">Verified Facility</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. NEARBY ATTRACTIONS (COMPACT SHOWCASE) */}
      <section className="py-12 sm:py-16 bg-forest-dark text-ivory" id="attractions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">
                Explore Purulia
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ivory mt-1">
                Nearby Attractions
              </h2>
              <p className="text-xs sm:text-sm text-ivory/70 mt-1 max-w-xl">
                Accurate driving distances measured directly from Hill Queen Eco Resort (Mamudi, Murguma, PIN 723152).
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/attractions"
                className="px-4 py-2 rounded-full bg-gold text-forest text-xs font-semibold hover:bg-gold-light transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>Full Guide (13 Places)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Compact Space-Efficient Attractions Grid */}
          <NearbyAttractions
            attractions={attractions}
            whatsappNumber={settings.whatsappNumber}
            limit={4}
            compact={true}
          />

          <div className="mt-8 text-center">
            <Link
              href="/attractions"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gold/40 text-gold hover:bg-gold hover:text-forest transition-all text-xs font-semibold tracking-wider uppercase"
            >
              <span>Explore All 13 Purulia Destinations & Day Tour Circuits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PHOTO GALLERY PREVIEW */}
      <section className="py-20 sm:py-28 bg-[#FAF7EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
                Visual Experience
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-forest mt-2">
                Moments at Hill Queen
              </h2>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/gallery"
                className="btn-forest px-6 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2"
              >
                <span>View Full Photographic Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden shadow-sm group">
              <Image
                src="/images/resort/cottages-nature.jpg"
                alt="Hill Queen Eco Resort cottages nestled amidst nature"
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 text-[10px] bg-forest-dark/85 text-ivory px-2.5 py-1 rounded-md font-medium border border-gold/30">
                Eco Cottages & Nature
              </span>
              <span className="absolute top-2 right-2 text-[9px] bg-forest-dark/80 text-gold px-2 py-0.5 rounded backdrop-blur-sm border border-gold/30">
                Authentic
              </span>
            </div>
            <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden shadow-sm group">
              <Image
                src="/images/rooms/double-bedded-room.jpg"
                alt="Hill Queen Eco Resort Double Bedded Room"
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 text-[10px] bg-forest-dark/85 text-ivory px-2.5 py-1 rounded-md font-medium border border-gold/30">
                Double Bedded Room
              </span>
              <span className="absolute top-2 right-2 text-[9px] bg-forest-dark/80 text-gold px-2 py-0.5 rounded backdrop-blur-sm border border-gold/30">
                Authentic
              </span>
            </div>
            <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden shadow-sm group">
              <Image
                src="/images/rooms/tent-accommodation.jpg"
                alt="Tent camping experience at Hill Queen Eco Resort"
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 text-[10px] bg-forest-dark/85 text-ivory px-2.5 py-1 rounded-md font-medium border border-gold/30">
                Tent Camping Stay
              </span>
              <span className="absolute top-2 right-2 text-[9px] bg-forest-dark/80 text-gold px-2 py-0.5 rounded backdrop-blur-sm border border-gold/30">
                Authentic
              </span>
            </div>
            <div className="relative h-60 sm:h-72 rounded-2xl overflow-hidden shadow-sm group">
              <Image
                src="/images/facilities/dining.jpg"
                alt="Fresh home-cooked Bengali dining"
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 text-[10px] bg-forest-dark/85 text-ivory px-2.5 py-1 rounded-md font-medium border border-gold/30">
                Dining & Kitchen
              </span>
              <span className="absolute top-2 right-2 text-[9px] bg-forest-dark/80 text-gold px-2 py-0.5 rounded backdrop-blur-sm border border-gold/30">
                Authentic
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LOCATION & DIRECTIONS */}
      <section className="py-20 sm:py-28 bg-white border-t border-ivory-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-dark font-semibold">
                <MapPin className="w-4 h-4" />
                <span>How To Reach Us</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
                Location & Accessibility
              </h2>
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed">
                Hill Queen Eco Resort is conveniently reached by car, private cab, or train via nearby railway stations:
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-ivory border border-ivory-dark flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-forest">Resort Address:</strong>
                    <span className="text-forest/75">{settings.address}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-ivory border border-ivory-dark flex items-start gap-3">
                  <Compass className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-forest">Nearest Railway Stations:</strong>
                    <span className="text-forest/75">
                      Suisa (22 km) • Muri Junction (35 km) • Purulia Junction (45 km)
                    </span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-ivory border border-ivory-dark flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-forest">Need Route Assistance?</strong>
                    <span className="text-forest/75">
                      Call our staff directly at +91 {settings.phonePrimary} before arrival.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={buildGoogleMapsDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold px-6 py-3 rounded-full text-xs font-bold inline-flex items-center justify-center gap-2 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={buildGoogleMapsOpenUrl(settings.googleMapsUrl, settings.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full border border-forest/30 text-forest hover:bg-forest hover:text-ivory text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Google Maps Listing</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Map Frame */}
            <div className="lg:col-span-7">
              <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-ivory-dark shadow-luxury relative bg-forest-dark">
                <iframe
                  title="Hill Queen Eco Resort Mamudi Murguma Location Map"
                  src={buildMapEmbedUrl(settings.googleMapsUrl, settings.address)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DIRECT ENQUIRY BANNER (WHATSAPP & TELEPHONE) */}
      <section className="py-16 sm:py-20 bg-forest text-ivory border-t border-gold/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-forest-dark border border-gold/40 text-gold text-xs font-medium mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Reservations & Inquiries</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ivory mb-4">
            Plan Your Peaceful Stay in Murguma
          </h2>

          <p className="text-sm sm:text-base text-ivory/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Have questions about room availability, weekend dates, food menus or nearby sightseeing? Speak directly with the resort management on WhatsApp or telephone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href={buildWhatsAppLink(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto btn-gold px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-luxury"
            >
              <MessageSquare className="w-4 h-4 fill-forest text-forest" />
              <span>Message on WhatsApp</span>
            </a>

            <a
              href={buildTelLink(settings.phonePrimary)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-forest-dark text-ivory border border-gold/40 hover:border-gold text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all"
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
