'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, Info } from 'lucide-react';

export interface GalleryPhoto {
  id: string;
  imageUrl: string;
  caption: string | null;
  category: string;
  displayOrder: number;
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

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
    }
  };

  const prevPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex(
        (activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      );
    }
  };

  const currentPhoto =
    activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            selectedCategory === 'All'
              ? 'btn-gold shadow-md'
              : 'bg-white text-forest border border-ivory-dark hover:border-gold hover:text-gold'
          }`}
        >
          All Photographs ({photos.length})
        </button>
        {categories.map((cat) => {
          const count = photos.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
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

      {/* Notice regarding placeholder photos during development */}
      <div className="max-w-2xl mx-auto mb-10 p-3.5 rounded-xl bg-ivory border border-gold/30 text-xs text-forest/80 flex items-center gap-3">
        <Info className="w-4 h-4 text-gold shrink-0" />
        <p>
          <strong>Owner Photo Notice:</strong> These preview photographs are high-resolution aesthetic placeholders. The resort owner can upload and update authentic on-property images anytime via the Admin Portal.
        </p>
      </div>

      {/* Empty State */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-ivory-dark max-w-lg mx-auto">
          <p className="font-serif text-lg text-forest mb-2">No photographs in this category yet</p>
          <p className="text-xs text-forest/70">
            Photographs can be added easily in the admin dashboard.
          </p>
        </div>
      ) : (
        /* Image Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id || index}
              onClick={() => openLightbox(index)}
              className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer bg-forest-dark border border-ivory-dark shadow-luxury luxury-card"
            >
              <Image
                src={photo.imageUrl}
                alt={photo.caption || `${photo.category} at Hill Queen Eco Resort`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4" />

              {/* Hover overlay content */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="p-2 rounded-full bg-forest/80 text-gold border border-gold/30 flex items-center justify-center">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-gold bg-forest-dark/90 px-2 py-0.5 rounded mb-1 border border-gold/30">
                  {photo.category}
                </span>
                {photo.caption && (
                  <p className="text-xs text-ivory font-medium line-clamp-2">
                    {photo.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {currentPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2 rounded-full bg-forest/80 text-ivory hover:text-gold border border-gold/40 z-20"
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
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-forest/80 text-ivory hover:text-gold border border-gold/40 z-20"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-forest/80 text-ivory hover:text-gold border border-gold/40 z-20"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Image in Lightbox */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-[70vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={currentPhoto.imageUrl}
                alt={currentPhoto.caption || currentPhoto.category}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Caption bar */}
            <div className="w-full bg-forest-dark/90 border-t border-gold/30 p-4 text-center mt-3 rounded-xl max-w-xl">
              <span className="text-xs uppercase tracking-widest text-gold font-semibold">
                {currentPhoto.category} ({activePhotoIndex! + 1} / {filteredPhotos.length})
              </span>
              {currentPhoto.caption && (
                <p className="text-sm text-ivory mt-1">
                  {currentPhoto.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
