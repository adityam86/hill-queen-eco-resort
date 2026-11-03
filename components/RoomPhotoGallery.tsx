'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { CheckCircle2, ZoomIn, X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

export interface RoomImageItem {
  id?: string;
  imageUrl: string;
  caption?: string | null;
  displayOrder?: number;
}

interface RoomPhotoGalleryProps {
  roomName: string;
  images: RoomImageItem[];
}

export default function RoomPhotoGallery({ roomName, images }: RoomPhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Normalize image list
  const validImages = images.filter((img) => Boolean(img?.imageUrl));
  const displayImages: RoomImageItem[] =
    validImages.length > 0
      ? validImages
      : [{ id: 'placeholder', imageUrl: '/images/room-placeholder.svg', caption: 'Photo Coming Soon' }];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const isAuthentic = Boolean(
    currentImage.imageUrl &&
      !currentImage.imageUrl.includes('unsplash.com') &&
      !currentImage.imageUrl.includes('room-placeholder')
  );

  const nextImage = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const prevImage = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextImage();
      else prevImage();
    }
    setTouchStartX(null);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  return (
    <div className="space-y-4">
      {/* 1. Hero Image Showcase */}
      <div
        onClick={() => setIsLightboxOpen(true)}
        className="group relative h-72 sm:h-96 md:h-[460px] w-full rounded-3xl overflow-hidden border-2 border-ivory-dark shadow-luxury bg-forest-dark cursor-pointer"
      >
        <Image
          src={currentImage.imageUrl}
          alt={currentImage.caption || `${roomName} photograph`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-black/20" />

        {/* Verification Status Badge */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
          <span
            className={`text-[10px] sm:text-xs px-3 py-1 rounded-full backdrop-blur-md border ${
              isAuthentic
                ? 'bg-gold/90 text-forest font-bold border-gold flex items-center gap-1.5'
                : 'bg-black/70 text-ivory/90 border-white/20'
            }`}
          >
            {isAuthentic ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                <span>Authentic Resort Photograph</span>
              </>
            ) : (
              'Photograph Coming Soon'
            )}
          </span>

          {/* Fullscreen indicator */}
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gold bg-forest-dark/85 px-3 py-1 rounded-full border border-gold/40 backdrop-blur-md group-hover:bg-gold group-hover:text-forest transition-colors">
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Fullscreen View</span>
          </span>
        </div>

        {/* Photo counter overlay */}
        {displayImages.length > 1 && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-forest-dark/85 text-gold border border-gold/40 backdrop-blur-md">
              {selectedIndex + 1} / {displayImages.length}
            </span>
          </div>
        )}
      </div>

      {/* 2. Responsive Thumbnail Strip (if multiple photos exist) */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {displayImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative h-20 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all bg-forest-dark focus:outline-none ${
                  isSelected
                    ? 'border-gold shadow-md scale-102 ring-2 ring-gold/40'
                    : 'border-ivory-dark opacity-75 hover:opacity-100 hover:border-gold/60'
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.caption || `${roomName} view ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 33vw, 20vw"
                  className="object-cover"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-gold/15 border-2 border-gold rounded-2xl pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-forest-dark/90 text-ivory hover:text-gold border border-gold/40 z-30 transition-colors shadow-lg"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous / Next buttons */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-forest-dark/90 text-ivory hover:text-gold border border-gold/40 z-30 transition-all shadow-lg hover:scale-105"
                aria-label="Previous Photograph"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-forest-dark/90 text-ivory hover:text-gold border border-gold/40 z-30 transition-all shadow-lg hover:scale-105"
                aria-label="Next Photograph"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Lightbox Image Container */}
          <div
            className="relative max-w-5xl max-h-[88vh] w-full h-[72vh] flex flex-col items-center justify-center touch-pan-y"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={currentImage.imageUrl}
                alt={currentImage.caption || roomName}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Bottom Caption Bar */}
            <div className="w-full bg-forest-dark/95 border border-gold/30 p-4 text-center mt-3 rounded-2xl max-w-2xl shadow-xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">
                  {roomName}
                </span>
                <span className="text-[11px] text-ivory/60">
                  Photo {selectedIndex + 1} of {displayImages.length}
                </span>
              </div>
              {currentImage.caption && (
                <p className="text-xs sm:text-sm text-ivory/90 leading-relaxed font-normal">
                  {currentImage.caption}
                </p>
              )}
              <div className="mt-2 pt-2 border-t border-gold/15 flex items-center justify-center gap-2 text-[10px]">
                {isAuthentic ? (
                  <span className="text-gold font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-gold" />
                    Verified Authentic Resort Photograph • Hill Queen Eco Resort
                  </span>
                ) : (
                  <span className="text-ivory/60 italic">
                    Placeholder preview • Authentic photo will be uploaded by the resort owner
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

