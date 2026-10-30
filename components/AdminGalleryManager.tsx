'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Filter,
  Eye,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string | null;
  category: string;
  displayOrder: number;
}

interface AdminGalleryManagerProps {
  initialPhotos: GalleryItem[];
}

export default function AdminGalleryManager({ initialPhotos }: AdminGalleryManagerProps) {
  const [photos, setPhotos] = useState<GalleryItem[]>(initialPhotos);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Form states for new photo
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Resort Exterior');
  const [displayOrder, setDisplayOrder] = useState('0');

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const categories = [
    'Resort Exterior',
    'Rooms',
    'Property Surroundings',
    'Food',
    'Facilities',
    'Nearby Attractions',
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setImageUrl(data.url);
      setSuccess('Image file uploaded successfully! Ready to save.');
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError('Please provide an image URL or upload an image file');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          caption: caption.trim() || null,
          category,
          displayOrder: parseInt(displayOrder, 10) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add photo');

      setPhotos([...photos, data.photo]);
      setImageUrl('');
      setCaption('');
      setDisplayOrder('0');
      setSuccess('Photograph added to gallery successfully and published!');
    } catch (err: any) {
      setError(err.message || 'Failed to add photograph');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this photograph?');
    if (!confirmed) return;

    try {
      const res = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete photo');

      setPhotos(photos.filter((p) => p.id !== id));
    } catch (err: any) {
      alert('Error deleting photo: ' + err.message);
    }
  };

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-10">
      {/* 1. Add New Photo Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-dark shadow-sm">
        <h2 className="font-serif text-xl font-bold text-forest border-b border-ivory-dark pb-3 mb-6">
          Add New Photograph
        </h2>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleAddPhoto} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Image URL / Upload */}
            <div className="md:col-span-8">
              <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
                Image Source (URL or Upload) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste photograph URL or upload a file"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
                />
                <label className="btn-forest px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-2 shrink-0">
                  <Upload className="w-4 h-4 text-gold" />
                  <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Caption */}
            <div className="md:col-span-9">
              <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
                Photo Caption / Description
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. View of Murguma Dam at sunset from the hill path"
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
              />
            </div>

            {/* Sequence */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Image Preview if provided */}
          {imageUrl && (
            <div className="pt-2">
              <span className="text-[11px] text-forest/70 block mb-1">Preview:</span>
              <div className="relative w-48 h-32 rounded-xl overflow-hidden border border-ivory-dark bg-forest-dark">
                <Image src={imageUrl} alt="Upload preview" fill className="object-cover" />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Adding Photo...' : 'Publish to Gallery'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Gallery Photos Grid with Filters */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-dark shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-dark pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-forest">
              Existing Photographs ({photos.length})
            </h2>
            <p className="text-xs text-forest/70 mt-0.5">
              Click delete to remove any photo from public display.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === 'All'
                  ? 'bg-forest text-gold'
                  : 'bg-ivory text-forest hover:bg-forest hover:text-ivory'
              }`}
            >
              All ({photos.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-forest text-gold'
                    : 'bg-ivory text-forest hover:bg-forest hover:text-ivory'
                }`}
              >
                {cat} ({photos.filter((p) => p.category === cat).length})
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16 text-forest/60 text-xs">
            No photographs found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="relative rounded-2xl overflow-hidden border border-ivory-dark group bg-forest-dark flex flex-col justify-between"
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.caption || photo.category}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <span className="absolute top-2 left-2 text-[10px] font-semibold bg-forest/90 text-gold px-2 py-0.5 rounded border border-gold/30">
                    {photo.category}
                  </span>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    title="Delete Photo"
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 bg-white text-forest text-xs">
                  {photo.caption ? (
                    <p className="line-clamp-2 text-forest/80 font-medium">
                      {photo.caption}
                    </p>
                  ) : (
                    <span className="text-forest/50 italic text-[11px]">No caption set</span>
                  )}
                  <span className="text-[10px] text-forest/50 block mt-1">
                    Order: #{photo.displayOrder}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
