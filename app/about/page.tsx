import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Mountain,
  Heart,
  Trees,
  Compass,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { getResortSettings, buildTelLink, buildWhatsAppLink } from '@/lib/settings';

export const metadata = {
  title: 'About Hill Queen Eco Resort | Mamudi, Murguma, Purulia',
  description: 'Learn about Hill Queen Eco Resort located in Mamudi, Murguma, Purulia. Discover our nature-inspired hospitality philosophy, peaceful surroundings, and authentic retreats.',
};

export default async function AboutPage() {
  const settings = await getResortSettings();

  const values = [
    {
      icon: Trees,
      title: 'Deep Nature Harmony',
      description: 'Preserving the rural simplicity and quiet tranquility of Purulia’s countryside without invasive urban commercialization.',
    },
    {
      icon: Heart,
      title: 'Warm Authentic Hospitality',
      description: 'Caring, personalized service with fresh regional meals, attentive support, and direct accessibility to resort caretakers.',
    },
    {
      icon: ShieldCheck,
      title: 'Direct & Transparent Pricing',
      description: 'Tariffs set honestly by the owner with zero commission markups, no hidden resort fees, and simple telephone/WhatsApp reservations.',
    },
    {
      icon: Compass,
      title: 'Local Purulia Guidance',
      description: 'Insider tips for exploring Murguma Dam, Ajodhya Hills, Bamni Falls, and indigenous tribal culture safely and respectfully.',
    },
  ];

  return (
    <div className="bg-[#FAF7EF] text-forest">
      {/* 1. Page Header */}
      <section className="relative py-20 sm:py-28 bg-forest-dark text-ivory overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop"
            alt="Murguma hills surroundings"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/80 to-forest-dark/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest/80 border border-gold/40 text-gold text-xs font-semibold mb-4 tracking-wider uppercase">
            <Mountain className="w-3.5 h-3.5" />
            <span>Hospitality Philosophy & Environment</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ivory mb-6">
            About Hill Queen Eco Resort
          </h1>
          <p className="text-base sm:text-lg text-ivory/80 leading-relaxed max-w-2xl mx-auto font-light">
            A sanctuary of peace nestled in the tranquil foothills of Murguma, Purulia, where nature sets the pace.
          </p>
        </div>
      </section>

      {/* 2. Story & Property Introduction */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
                Welcome to Our Retreat
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest leading-tight">
                Escape The Noise. Breathe The Clean Air of Murguma.
              </h2>
              <div className="space-y-4 text-forest/80 text-sm sm:text-base leading-relaxed">
                <p>
                  {settings.aboutText ||
                    'Nestled in the tranquil valley of Mamudi near the scenic Murguma Dam in Purulia, West Bengal, Hill Queen Eco Resort is a peaceful nature retreat designed for travellers seeking rest, clean mountain air, and authentic hospitality.'}
                </p>
                <p>
                  Purulia is renowned for its undulating topography, ancient granite hill formations, lush Sal and Palas forests, and serene water reservoirs. In the heart of this landscape lies Murguma Dam, celebrated by discerning nature lovers for its calm waters and dramatic sunsets.
                </p>
                <p>
                  Hill Queen Eco Resort was established with one central philosophy: to offer weary city dwellers and nature lovers a comfortable, secure, and genuine haven where one can wake up to uninterrupted birdsong, enjoy wholesome home-cooked meals, and gaze upon clear constellations under unpolluted night skies.
                </p>
              </div>

              {/* Verified Details Card */}
              <div className="p-6 rounded-2xl bg-white border border-ivory-dark shadow-sm space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-forest block">Property Location:</strong>
                    <span className="text-forest/75">{settings.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gold shrink-0" />
                  <div>
                    <strong className="text-forest">Timings:</strong>{' '}
                    <span className="text-forest/75">
                      Check-in: {settings.checkInTime} • Check-out: {settings.checkOutTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-luxury border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200&auto=format&fit=crop"
                  alt="Hill Queen Cottage"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="relative h-56 rounded-2xl overflow-hidden shadow-sm border-2 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop"
                  alt="Murguma Dam and Purulia Lake"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <span className="absolute bottom-3 left-3 text-[11px] bg-forest-dark/85 text-ivory px-2.5 py-1 rounded">
                  Nearby Murguma Dam Lake
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values */}
      <section className="py-20 sm:py-24 bg-white border-y border-ivory-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
              The Hill Queen Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest mt-2 mb-4">
              What Defines Our Hospitality
            </h2>
            <p className="text-sm sm:text-base text-forest/75">
              Honest service and peaceful stays without artificial luxury gimmicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-2xl bg-[#FAF7EF] border border-ivory-dark flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-forest text-gold flex items-center justify-center mb-6">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-forest mb-3">
                      {val.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-forest/75 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Dining & Homely Cuisine */}
      <section className="py-20 sm:py-24 bg-[#FAF7EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative h-[360px] sm:h-[420px] rounded-3xl overflow-hidden shadow-luxury border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1613769049987-b31b641f25b1?q=80&w=1200&auto=format&fit=crop"
                alt="Fresh authentic Bengali food"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent flex items-end p-6">
                <span className="text-xs text-ivory/90">
                  Freshly cooked local Bengali thalis and home-style breakfasts.
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
                Nourishing Flavours
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
                Fresh, Wholesome Regional Dining
              </h2>
              <p className="text-sm sm:text-base text-forest/80 leading-relaxed">
                Food at Hill Queen Eco Resort is prepared with the warmth and care of a family kitchen. We prioritize fresh, locally sourced ingredients and prepare dishes on-demand to guarantee freshness and hygiene.
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-forest/80">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Complimentary morning tea for our residing guests.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Traditional Bengali thali lunches: steaming rice, dal, fresh vegetables, fish or chicken.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Warm evening snacks: pakoras, hot tea, and campfire barbecues upon advance request.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span>Custom food options for children and elderly family members.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Direct Connect CTA */}
      <section className="py-16 sm:py-20 bg-forest text-ivory">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ivory mb-4">
            Connect With Us Directly
          </h2>
          <p className="text-sm sm:text-base text-ivory/80 max-w-xl mx-auto mb-8">
            Speak directly with our team to inquire about cottage availability, customized meal plans, or sightseeing recommendations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={buildWhatsAppLink(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto btn-gold px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-forest text-forest" />
              <span>WhatsApp: +91 {settings.whatsappNumber}</span>
            </a>
            <a
              href={buildTelLink(settings.phonePrimary)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-forest-dark border border-gold/40 hover:border-gold text-ivory text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
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
