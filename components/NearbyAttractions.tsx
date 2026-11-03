'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Navigation,
  Clock,
  Compass,
  ExternalLink,
  Eye,
  X,
  Sparkles,
  Info,
  CheckCircle2,
  Car,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { AttractionData, AttractionCategory, ATTRACTION_CATEGORIES } from '@/lib/attractions';
import { buildWhatsAppLink } from '@/lib/settings';

interface NearbyAttractionsProps {
  attractions: AttractionData[];
  whatsappNumber?: string;
  showAllInitially?: boolean;
  limit?: number;
  compact?: boolean;
}

export default function NearbyAttractions({
  attractions,
  whatsappNumber = '9735888106',
  showAllInitially = true,
  limit,
  compact = false,
}: NearbyAttractionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<AttractionCategory>('All');
  const [activeLightbox, setActiveLightbox] = useState<AttractionData | null>(null);

  // Filter attractions based on category
  const filteredAttractions = useMemo(() => {
    let list = attractions;
    if (selectedCategory !== 'All') {
      list = list.filter((item) => item.category === selectedCategory);
    }
    if (limit && limit > 0) {
      list = list.slice(0, limit);
    }
    return list;
  }, [attractions, selectedCategory, limit]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: attractions.length };
    attractions.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [attractions]);

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2.5 mb-5 sm:mb-6 scrollbar-thin scrollbar-thumb-gold/30 scrollbar-track-transparent">
        {ATTRACTION_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1 sm:gap-1.5 ${
                isSelected
                  ? 'bg-gold text-forest shadow-md border border-gold scale-105'
                  : 'bg-forest/60 text-ivory/80 hover:bg-forest hover:text-ivory border border-gold/20'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-forest text-gold' : 'bg-black/30 text-gold/80'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Attractions Grid: 2 columns on Phone (< sm), 2 on Tablet (sm), 3 on Medium (md), 4 on Desktop (lg) */}
      <div
        className={
          compact
            ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4'
            : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6'
        }
      >
        {filteredAttractions.map((attraction) => {
          let highlightsList: string[] = [];
          if (attraction.highlights) {
            try {
              highlightsList = JSON.parse(attraction.highlights);
            } catch {
              highlightsList = attraction.highlights.split(',').map((s) => s.trim());
            }
          }

          if (compact) {
            // Sleek & Space-Efficient Card for Homepage (2 boxes on phone)
            return (
              <article
                key={attraction.id}
                className="group bg-forest rounded-xl overflow-hidden border border-gold/20 hover:border-gold/50 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Compact Photo */}
                  <div className="relative h-28 sm:h-36 md:h-40 w-full overflow-hidden bg-forest-dark">
                    <Image
                      src={attraction.imageUrl}
                      alt={attraction.imageAlt || attraction.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-black/30" />

                    <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 text-[8px] sm:text-[10px] bg-forest-dark/90 backdrop-blur-sm text-gold px-1.5 sm:px-2.5 py-0.5 rounded-full border border-gold/30 font-medium">
                      {attraction.category}
                    </span>

                    <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 text-[8px] sm:text-[10px] bg-black/80 backdrop-blur-sm text-ivory px-1.5 sm:px-2 py-0.5 rounded-full border border-gold/30 font-medium flex items-center gap-1 shadow-sm">
                      <Car className="w-2.5 h-2.5 text-gold" />
                      <span>~{attraction.distanceKm} km</span>
                    </div>

                    <button
                      onClick={() => setActiveLightbox(attraction)}
                      aria-label={`View photo of ${attraction.name}`}
                      className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-forest-dark/85 backdrop-blur-sm text-gold hover:bg-gold hover:text-forest transition-colors flex items-center justify-center border border-gold/30"
                    >
                      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>

                  {/* Compact Body */}
                  <div className="p-2.5 sm:p-4">
                    <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gold font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">
                      <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                      <span>~{attraction.drivingTimeMin}m from resort</span>
                    </div>

                    <h3 className="font-serif text-xs sm:text-base font-bold text-ivory mb-1 truncate group-hover:text-gold transition-colors" title={attraction.name}>
                      {attraction.name}
                    </h3>

                    <p className="text-[11px] sm:text-xs text-ivory/70 line-clamp-2 leading-snug sm:leading-relaxed mb-2 sm:mb-3">
                      {attraction.description}
                    </p>
                  </div>
                </div>

                {/* Compact Actions */}
                <div className="px-2.5 pb-2.5 sm:px-4 sm:pb-4 pt-0 border-t border-gold/15 flex items-center gap-1 sm:gap-2 pt-2 sm:pt-3">
                  <a
                    href={attraction.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1 sm:py-1.5 px-1.5 sm:px-2.5 rounded-md sm:rounded-lg bg-gold text-forest font-semibold text-[10px] sm:text-[11px] text-center hover:bg-gold-light transition-colors flex items-center justify-center gap-1 truncate"
                  >
                    <Navigation className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                    <span>Map</span>
                  </a>

                  <button
                    onClick={() => setActiveLightbox(attraction)}
                    className="py-1 sm:py-1.5 px-1.5 sm:px-2.5 rounded-md sm:rounded-lg border border-gold/30 text-gold hover:bg-gold/15 text-[10px] sm:text-[11px] font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Details</span>
                  </button>
                </div>
              </article>
            );
          }

          // Full Detailed Card (2 boxes on Phone in /attractions page)
          return (
            <article
              key={attraction.id}
              className="group bg-forest rounded-xl sm:rounded-2xl overflow-hidden border border-gold/20 hover:border-gold/50 shadow-luxury hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-32 sm:h-52 md:h-56 w-full overflow-hidden bg-forest-dark">
                  <Image
                    src={attraction.imageUrl}
                    alt={attraction.imageAlt || attraction.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-black/30" />

                  <span className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[11px] bg-forest-dark/85 backdrop-blur-md text-gold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gold/30 font-medium">
                    {attraction.category}
                  </span>

                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[9px] sm:text-[11px] bg-black/75 backdrop-blur-md text-ivory px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-gold/30 font-medium flex items-center gap-1 shadow-sm">
                    <Car className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold" />
                    <span>~{attraction.distanceKm} km</span>
                  </div>

                  <button
                    onClick={() => setActiveLightbox(attraction)}
                    aria-label={`View photo of ${attraction.name}`}
                    className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-forest-dark/80 backdrop-blur-md text-gold hover:bg-gold hover:text-forest transition-colors flex items-center justify-center border border-gold/30"
                  >
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>

                <div className="p-3 sm:p-5 md:p-6">
                  <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-gold font-semibold uppercase tracking-wider mb-1">
                    <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    <span>~{attraction.drivingTimeMin}m from resort</span>
                  </div>

                  <h3 className="font-serif text-xs sm:text-lg md:text-xl font-bold text-ivory mb-1.5 truncate group-hover:text-gold transition-colors" title={attraction.name}>
                    {attraction.name}
                  </h3>

                  <p className="text-[11px] sm:text-sm text-ivory/75 line-clamp-2 leading-snug sm:leading-relaxed mb-2 sm:mb-4">
                    {attraction.description}
                  </p>

                  {/* Key Highlights (visible on tablet/desktop) */}
                  {highlightsList.length > 0 && (
                    <div className="hidden sm:block mb-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gold/80 block mb-2">
                        Key Experiences
                      </span>
                      <ul className="grid grid-cols-1 gap-1.5">
                        {highlightsList.slice(0, 3).map((item, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-ivory/80 flex items-start gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Travel Tip (visible on tablet/desktop) */}
                  {attraction.travelTip && (
                    <div className="hidden sm:flex p-2.5 rounded-xl bg-gold/10 border border-gold/20 items-start gap-2 text-[11px] text-ivory/80">
                      <Info className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gold font-semibold">Travel Tip: </strong>
                        <span>{attraction.travelTip}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-2.5 sm:p-5 md:p-6 pt-0 border-t border-gold/15 mt-2 sm:mt-4 flex flex-col sm:flex-row gap-1.5 sm:gap-2.5">
                <a
                  href={attraction.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 sm:py-2.5 px-2 rounded-lg sm:rounded-xl bg-gold text-forest font-semibold text-[10px] sm:text-xs text-center hover:bg-gold-light transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  <Navigation className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  <span>Get Directions</span>
                </a>

                <button
                  onClick={() => setActiveLightbox(attraction)}
                  className="py-1.5 sm:py-2.5 px-2 rounded-lg sm:rounded-xl border border-gold/40 text-gold hover:bg-gold hover:text-forest transition-colors font-medium text-[10px] sm:text-xs flex items-center justify-center gap-1"
                >
                  <Eye className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  <span>Full Info</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox / Full Info Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className="relative bg-forest max-w-4xl w-full rounded-2xl overflow-hidden border border-gold/40 shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 text-ivory hover:text-gold hover:bg-black/90 transition-colors flex items-center justify-center border border-gold/30"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Photo in Lightbox */}
            <div className="relative h-48 sm:h-80 w-full bg-black shrink-0">
              <Image
                src={activeLightbox.imageUrl}
                alt={activeLightbox.imageAlt || activeLightbox.name}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-contain"
              />
            </div>

            {/* Lightbox Details Scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-gold font-bold uppercase tracking-wider">
                    {activeLightbox.category}
                  </span>
                  <h3 className="font-serif text-lg sm:text-2xl font-bold text-ivory">
                    {activeLightbox.name}
                  </h3>
                </div>
                <div className="text-[11px] sm:text-xs bg-forest-dark px-2.5 py-1 rounded-full border border-gold/30 text-gold font-medium">
                  ~{activeLightbox.distanceKm} km from Resort (~{activeLightbox.drivingTimeMin} mins drive)
                </div>
              </div>

              <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed">
                {activeLightbox.description}
              </p>

              {activeLightbox.travelTip && (
                <div className="p-2.5 sm:p-3 rounded-xl bg-gold/10 border border-gold/30 text-xs text-ivory/90 flex items-start gap-2">
                  <Info className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gold font-semibold">Local Advice: </strong>
                    <span>{activeLightbox.travelTip}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2.5 pt-2">
                <a
                  href={activeLightbox.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Start Navigation from Resort</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="px-4 py-2 rounded-full border border-gold/40 text-ivory text-xs font-semibold hover:bg-gold/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
