'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Info,
  CheckCircle2,
  Camera,
  Sparkles,
} from 'lucide-react';

export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  caption: string | null;
  category: string;
  displayOrder: number;
  isPlaceholder?: boolean;
}

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  categories: string[];
}

export default function GalleryLightbox({
  photos,
  categories,
}: GalleryLightboxProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  const isPlaceholderPhoto = (photo: GalleryPhoto) => {
    if (photo.isPlaceholder !== undefined) return photo.isPlaceholder;
    return (
      photo.caption?.includes('[Preview Placeholder]') ||
      photo.caption?.includes('[Sample Placeholder]') ||
      photo.caption?.includes('[Attraction Guide]') ||
      photo.imageUrl.includes('unsplash.com')
    );
  };

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setActivePhotoIndex(null);
  }, []);

  const nextPhoto = useCallback(() => {
    if (activePhotoIndex !== null && filteredPhotos.length > 0) {
      setActivePhotoIndex((prev) => ((prev ?? 0) + 1) % filteredPhotos.length);
    }
  }, [activePhotoIndex, filteredPhotos.length]);

  const prevPhoto = useCallback(() => {
    if (activePhotoIndex !== null && filteredPhotos.length > 0) {
      setActivePhotoIndex((prev) =>
        ((prev ?? 0) - 1 + filteredPhotos.length) % filteredPhotos.length
      );
    }
  }, [activePhotoIndex, filteredPhotos.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextPhoto();
      else prevPhoto();
    }
    setTouchStartX(null);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, closeLightbox, nextPhoto, prevPhoto]);

  const currentPhoto =
    activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  return (
    <div>
      {/* Category Filter Pills (8 Sections) */}
      <div className="flex items-center sm:justify-center gap-2 sm:gap-2.5 mb-8 sm:mb-10 max-w-5xl mx-auto overflow-x-auto pb-2 px-2 sm:flex-wrap">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
            selectedCategory === 'All'
              ? 'btn-gold shadow-md'
              : 'bg-white text-forest border border-ivory-dark hover:border-gold hover:text-gold'
          }`}
        >
          All ({photos.length})
        </button>
        {categories.map((cat) => {
          const count = photos.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'btn-gold shadow-md'
                  : 'bg-white text-forest border border-ivory-dark hover:border-gold hover:text-gold'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Transparency & Owner Photo Disclosure Banner */}
      <div className="max-w-3xl mx-auto mb-10 p-4 rounded-2xl bg-white border border-gold/30 text-xs text-forest/80 shadow-sm flex items-start gap-3">
        <div className="p-2 rounded-xl bg-ivory text-gold shrink-0 mt-0.5">
          <Info className="w-4 h-4 text-gold-dark" />
        </div>
        <div>
          <p className="font-semibold text-forest mb-0.5">
            Photography Transparency & Authentic Sourcing:
          </p>
          <p className="leading-relaxed text-forest/75">
            Hill Queen Eco Resort presents authentic property visuals. Preview placeholder images are transparently marked with a label until replaced with original high-resolution photos provided by the resort owner. The resort owner can upload, replace, or manage photos anytime via the Admin Portal.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-ivory-dark max-w-lg mx-auto shadow-sm p-8">
          <Camera className="w-12 h-12 text-gold mx-auto mb-3" />
          <p className="font-serif text-xl font-bold text-forest mb-2">
            No photographs in this category yet
          </p>
          <p className="text-xs text-forest/70">
            Original resort photographs can be uploaded directly in the Management Dashboard.
          </p>
        </div>
      ) : (
        /* Image Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredPhotos.map((photo, index) => {
            const isPlaceholder = isPlaceholderPhoto(photo);
            return (
              <div
                key={photo.id || index}
                onClick={() => openLightbox(index)}
                className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer bg-forest-dark border border-ivory-dark shadow-luxury luxury-card flex flex-col justify-between"
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption || `${photo.category} at Hill Queen Eco Resort`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gold bg-forest-dark/90 px-2.5 py-1 rounded-full border border-gold/30 backdrop-blur-md">
                    {photo.category}
                  </span>

                  <span
                    className={`text-[9px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md border ${
                      isPlaceholder
                        ? 'bg-black/60 text-ivory/80 border-white/20'
                        : 'bg-gold/90 text-forest border-gold font-bold flex items-center gap-1'
                    }`}
                  >
                    {!isPlaceholder && <CheckCircle2 className="w-2.5 h-2.5" />}
                    {isPlaceholder ? 'Preview Placeholder' : 'Authentic'}
                  </span>
                </div>

                {/* Hover zoom pill */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                  <span className="px-3 py-1.5 rounded-full bg-forest/85 text-gold border border-gold/40 text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>View Fullscreen</span>
                  </span>
                </div>

                {/* Bottom Caption Overlay */}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  {photo.caption && (
                    <p className="text-xs text-ivory font-medium line-clamp-2 leading-snug drop-shadow-sm">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Fullscreen Modal */}
      {currentPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-forest-dark/90 text-ivory hover:text-gold border border-gold/40 z-30 transition-colors shadow-lg"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          {filteredPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-forest-dark/90 text-ivory hover:text-gold border border-gold/40 z-30 transition-all shadow-lg hover:scale-105"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-forest-dark/90 text-ivory hover:text-gold border border-gold/40 z-30 transition-all shadow-lg hover:scale-105"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Image Container */}
          <div
            className="relative max-w-5xl max-h-[88vh] w-full h-[72vh] flex flex-col items-center justify-center touch-pan-y"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={currentPhoto.imageUrl}
                alt={currentPhoto.caption || currentPhoto.category}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Caption & Metadata Bar */}
            <div className="w-full bg-forest-dark/95 border border-gold/30 p-4 text-center mt-3 rounded-2xl max-w-2xl shadow-xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">
                  {currentPhoto.category}
                </span>

                <span className="text-[11px] text-ivory/60">
                  Photo {activePhotoIndex! + 1} of {filteredPhotos.length}
                </span>
              </div>

              {currentPhoto.caption && (
                <p className="text-xs sm:text-sm text-ivory/90 leading-relaxed font-normal">
                  {currentPhoto.caption}
                </p>
              )}

              <div className="mt-2 pt-2 border-t border-gold/15 flex items-center justify-center gap-2 text-[10px]">
                {isPlaceholderPhoto(currentPhoto) ? (
                  <span className="text-ivory/60 italic">
                    [Preview Placeholder] Authentic photo can be replaced by the resort owner in Admin
                  </span>
                ) : (
                  <span className="text-gold font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-gold" />
                    Verified Authentic Resort Photograph • Hill Queen Eco Resort
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
