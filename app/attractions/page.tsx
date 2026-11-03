import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Mountain,
  Compass,
  MapPin,
  Car,
  Clock,
  Sparkles,
  Phone,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { getAttractions } from '@/lib/attractions';
import { getResortSettings, buildWhatsAppLink, buildTelLink } from '@/lib/settings';
import NearbyAttractions from '@/components/NearbyAttractions';

export const metadata: Metadata = {
  title: 'Nearby Attractions in Purulia | Sightseeing Guide | Hill Queen Eco Resort',
  description:
    'Comprehensive local sightseeing guide from Hill Queen Eco Resort, Mamudi, Murguma (PIN 723152). Explore Murguma Dam, Ajodhya Hills, Bamni Falls, Marble Lake, Charida Mask Village, and PPSP Dams with verified road distances and Google Maps directions.',
  openGraph: {
    title: 'Purulia Sightseeing Guide | Hill Queen Eco Resort Murguma',
    description:
      'Verified local attractions, accurate driving distances, and directions measured directly from Hill Queen Eco Resort, Mamudi, Murguma.',
    images: ['/images/attractions/murguma-dam.jpg'],
  },
};

export const revalidate = 60;

export default async function AttractionsPage() {
  const settings = await getResortSettings();
  const attractions = await getAttractions();

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-forest-dark text-ivory overflow-hidden">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/80 via-forest-dark to-forest-dark" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold tracking-widest uppercase mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>Official Purulia Sightseeing Guide</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-ivory tracking-tight max-w-4xl mx-auto leading-tight">
            Nearby Attractions <br className="hidden sm:inline" />
            <span className="text-gold italic font-normal">in Purulia & Ajodhya Hills</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-ivory/75 max-w-2xl mx-auto leading-relaxed">
            Welcome to the land of rugged red soil, sacred hill peaks, cascading falls, and mirror-like dams.
            All driving distances and times below are measured strictly from the gates of{' '}
            <strong className="text-gold font-semibold">
              Hill Queen Eco Resort, Mamudi, Murguma (PIN 723152)
            </strong>.
          </p>

          {/* Reference Banner */}
          <div className="mt-8 max-w-3xl mx-auto p-4 rounded-2xl bg-forest/80 border border-gold/25 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-ivory/85 text-left">
              <MapPin className="w-4 h-4 text-gold shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-gold tracking-wider block">
                  Reference Departure Point
                </span>
                <span className="font-medium">
                  Hill Queen Eco Resort • Mamudi, Murguma, Purulia 723152
                </span>
              </div>
            </div>
            <a
              href={buildWhatsAppLink(
                settings.whatsappNumber,
                'Hello Hill Queen Eco Resort, I am planning a sightseeing trip around Purulia and need help arranging a car or tour itinerary.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gold text-forest font-semibold hover:bg-gold-light transition-colors whitespace-nowrap inline-flex items-center gap-1.5 shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Arrange Sightseeing Cab</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. STATS & ATTRACTIONS DIRECTORY */}
      <section className="py-16 sm:py-24 bg-forest-dark text-ivory border-t border-gold/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold font-semibold">
                Explore The Destinations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-ivory mt-1">
                Verified Local Attractions
              </h2>
              <p className="text-xs sm:text-sm text-ivory/70 mt-1 max-w-xl">
                Browse destinations by category. Click any photo to enlarge, read travel tips, or start direct GPS navigation on Google Maps.
              </p>
            </div>
          </div>

          {/* Full Interactive Attractions Component */}
          <NearbyAttractions
            attractions={attractions}
            whatsappNumber={settings.whatsappNumber}
            showAllInitially={true}
          />
        </div>
      </section>

      {/* 3. SUGGESTED DAY TOUR CIRCUITS */}
      <section className="py-20 sm:py-28 bg-[#FAF7EF] text-forest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
              Curated Day Tours
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-forest mt-2">
              Recommended Sightseeing Circuits
            </h2>
            <p className="text-sm text-forest/75 mt-3 leading-relaxed">
              To make the most of your stay, our resort team recommends these seamless day-trip routes starting and ending right at Hill Queen Eco Resort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Circuit 1 */}
            <div className="bg-white rounded-2xl p-7 border border-gold/20 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-gold uppercase tracking-wider bg-forest/5 px-3 py-1 rounded-full border border-gold/25 inline-block mb-4">
                  Half-Day / Easy Route
                </span>
                <h3 className="font-serif text-xl font-bold text-forest mb-2">
                  Lakeside & Hilltop Panoramas
                </h3>
                <p className="text-xs text-forest/70 leading-relaxed mb-5">
                  A relaxing circuit ideal for families and travelers looking for gentle scenery, lakeside calm, and highland views without strenuous climbing.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2.5 text-xs text-forest/85">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <div>
                      <strong>Murguma Dam & Lake</strong>
                      <span className="block text-forest/60 text-[11px]">~1.5 km • 5 mins (walking/drive)</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-forest/85">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <div>
                      <strong>Ajodhya Hills Plateau Drive</strong>
                      <span className="block text-forest/60 text-[11px]">~22 km • 45 mins</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-forest/85">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <div>
                      <strong>Mayur Pahar 360° Overlook</strong>
                      <span className="block text-forest/60 text-[11px]">~23 km • 45 mins</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-forest/85">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center shrink-0 text-[11px]">
                      4
                    </span>
                    <div>
                      <strong>Sita Kund Natural Spring</strong>
                      <span className="block text-forest/60 text-[11px]">~21 km • 42 mins</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-ivory-dark text-[11px] text-forest/70 flex items-center justify-between">
                <span>Total driving: ~45 km round-trip</span>
                <span className="text-gold font-medium">Approx. 4-5 hours</span>
              </div>
            </div>

            {/* Circuit 2 */}
            <div className="bg-white rounded-2xl p-7 border-2 border-gold/40 shadow-luxury flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 bg-gold text-forest text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Most Popular
              </span>

              <div>
                <span className="text-[11px] font-bold text-gold uppercase tracking-wider bg-forest/5 px-3 py-1 rounded-full border border-gold/25 inline-block mb-4">
                  Full Day Adventure
                </span>
                <h3 className="font-serif text-xl font-bold text-forest mb-2">
                  Canyons, Waterfalls & Dams
                </h3>
                <p className="text-xs text-forest/70 leading-relaxed mb-5">
                  The signature Purulia circuit. Marvel at the turquoise canyon of Marble Lake, descent to Bamni Falls, and visit the colossal PPSP dams.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2.5 text-xs text-forest/85">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <div>
                      <strong>Marble Lake (Blue Water)</strong>
                      <span className="block text-forest/60 text-[11px]">~20 km • 40 mins</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-forest/85">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <div>
                      <strong>Bamni Falls Cascade</strong>
                      <span className="block text-forest/60 text-[11px]">~28 km • 55 mins</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-forest/85">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <div>
                      <strong>Turga Falls & Turga Dam</strong>
                      <span className="block text-forest/60 text-[11px]">~26 km • 50 mins</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-forest/85">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center shrink-0 text-[11px]">
                      4
                    </span>
                    <div>
                      <strong>PPSP Upper & Lower Dam</strong>
                      <span className="block text-forest/60 text-[11px]">~22-26 km • 45-50 mins</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-ivory-dark text-[11px] text-forest/70 flex items-center justify-between">
                <span>Total driving: ~65 km round-trip</span>
                <span className="text-gold font-medium">Approx. 7-8 hours</span>
              </div>
            </div>

            {/* Circuit 3 */}
            <div className="bg-white rounded-2xl p-7 border border-gold/20 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-gold uppercase tracking-wider bg-forest/5 px-3 py-1 rounded-full border border-gold/25 inline-block mb-4">
                  Full Day Heritage & Arts
                </span>
                <h3 className="font-serif text-xl font-bold text-forest mb-2">
                  Chhau Masks & Ancient Ruins
                </h3>
                <p className="text-xs text-forest/70 leading-relaxed mb-5">
                  A deeply enriching cultural exploration featuring UNESCO GI-tagged Chhau mask makers, massive cliff carvings, and 1,000-year-old terracotta temples.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2.5 text-xs text-forest/85">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center shrink-0 text-[11px]">
                      1
                    </span>
                    <div>
                      <strong>Charida Chhau Mask Village</strong>
                      <span className="block text-forest/60 text-[11px]">~32 km • 55 mins</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-forest/85">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center shrink-0 text-[11px]">
                      2
                    </span>
                    <div>
                      <strong>Pakhi Pahar Rock Carvings</strong>
                      <span className="block text-forest/60 text-[11px]">~24 km • 45 mins</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-forest/85">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center shrink-0 text-[11px]">
                      3
                    </span>
                    <div>
                      <strong>Khairabera Eco Lake</strong>
                      <span className="block text-forest/60 text-[11px]">~36 km • 60 mins</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-forest/85">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold-dark font-bold flex items-center justify-center shrink-0 text-[11px]">
                      4
                    </span>
                    <div>
                      <strong>Deulghata Terracotta Temples</strong>
                      <span className="block text-forest/60 text-[11px]">~38 km • 65 mins</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-ivory-dark text-[11px] text-forest/70 flex items-center justify-between">
                <span>Total driving: ~80 km round-trip</span>
                <span className="text-gold font-medium">Approx. 7-8 hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRACTICAL VISITOR TIPS & FAQ */}
      <section className="py-16 sm:py-24 bg-ivory text-forest border-t border-gold/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
              Guest Assistance
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-forest mt-1">
              Practical Sightseeing Tips
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gold/20 shadow-sm">
              <h3 className="font-serif text-base font-bold text-forest mb-2 flex items-center gap-2">
                <Car className="w-4 h-4 text-gold-dark" />
                <span>Vehicle & Cab Arrangements</span>
              </h3>
              <p className="text-xs text-forest/75 leading-relaxed">
                The roads across Purulia and the Ajodhya Ghats are paved and well-connected. If you arrive without a private vehicle, our front desk can arrange verified local taxis or cabs for customized half-day and full-day sightseeing packages.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold/20 shadow-sm">
              <h3 className="font-serif text-base font-bold text-forest mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-dark" />
                <span>Seasonal Travel Advice</span>
              </h3>
              <p className="text-xs text-forest/75 leading-relaxed">
                <strong>Winter (Oct–Feb):</strong> Pleasant sunny days (15°C–25°C), cool starry nights, migratory birds at Murguma.<br />
                <strong>Spring (Feb–Mar):</strong> Flaming red Palash blossoms across the hills.<br />
                <strong>Monsoon (Jul–Sep):</strong> Waterfalls like Bamni and Turga run at full capacity amidst lush green foliage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold/20 shadow-sm">
              <h3 className="font-serif text-base font-bold text-forest mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-dark" />
                <span>Safety & Footwear</span>
              </h3>
              <p className="text-xs text-forest/75 leading-relaxed">
                Wear sturdy walking shoes with good grip when visiting Bamni Falls (stone stairs can be slick) and Marble Lake (steep rocky canyon rims). Swimming is strictly forbidden in quarry and dam reservoirs due to deep undercurrents.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gold/20 shadow-sm">
              <h3 className="font-serif text-base font-bold text-forest mb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-gold-dark" />
                <span>Mobile Connectivity & Cash</span>
              </h3>
              <p className="text-xs text-forest/75 leading-relaxed">
                Jio and Airtel have good coverage across most locations, though remote forest valleys may have occasional dips. It is recommended to carry some cash for buying handmade Chhau masks in Charida and enjoying tea from local village stalls.
              </p>
            </div>
          </div>

          {/* Bottom CTA Box */}
          <div className="mt-12 p-8 rounded-3xl bg-forest text-ivory text-center border border-gold/30 shadow-luxury">
            <h3 className="font-serif text-2xl font-bold text-ivory mb-2">
              Ready to Explore Purulia with Hill Queen Eco Resort?
            </h3>
            <p className="text-xs sm:text-sm text-ivory/75 max-w-xl mx-auto mb-6">
              Our hospitality team is delighted to help you customize the best sightseeing plan based on your stay duration and preferences.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={buildWhatsAppLink(
                  settings.whatsappNumber,
                  'Hello Hill Queen Eco Resort, I would like to plan my Purulia sightseeing tour with you.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-6 py-3 rounded-full text-xs font-semibold inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Sightseeing Concierge</span>
              </a>
              <a
                href={buildTelLink(settings.phonePrimary)}
                className="px-6 py-3 rounded-full border border-gold/40 text-ivory text-xs font-semibold hover:bg-gold/20 transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-gold" />
                <span>Call Front Desk: +91 {settings.phonePrimary}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

