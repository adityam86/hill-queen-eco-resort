'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Upload,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Filter,
  Eye,
  ShieldCheck,
  Info,
  X,
  Camera,
} from 'lucide-react';

export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string | null;
  category: string;
  displayOrder: number;
}

interface AdminGalleryManagerProps {
  initialPhotos: GalleryItem[];
}

import { RESORT_GALLERY_CATEGORIES } from '@/lib/gallery-categories';

export default function AdminGalleryManager({ initialPhotos }: AdminGalleryManagerProps) {
  const [photos, setPhotos] = useState<GalleryItem[]>(initialPhotos);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Form states for adding photo
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<string>(RESORT_GALLERY_CATEGORIES[0]);
  const [displayOrder, setDisplayOrder] = useState('0');
  const [isAuthentic, setIsAuthentic] = useState(true);

  // States for Editing/Replacing photo
  const [editingPhoto, setEditingPhoto] = useState<GalleryItem | null>(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editCategory, setEditCategory] = useState<string>(RESORT_GALLERY_CATEGORIES[0]);
  const [editDisplayOrder, setEditDisplayOrder] = useState('0');
  const [editUploading, setEditUploading] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isEdit) {
      setEditUploading(true);
    } else {
      setUploading(true);
    }
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

      if (isEdit) {
        setEditImageUrl(data.url);
      } else {
        setImageUrl(data.url);
      }
      setSuccess('Photograph uploaded successfully to local storage! Ready to save.');
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      if (isEdit) {
        setEditUploading(false);
      } else {
        setUploading(false);
      }
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

    // Format caption with placeholder notice if marked as temporary
    let formattedCaption = caption.trim();
    if (!isAuthentic && !formattedCaption.includes('[Preview Placeholder]')) {
      formattedCaption = formattedCaption
        ? `[Preview Placeholder] ${formattedCaption}`
        : `[Preview Placeholder] Suitable temporary image for ${category}`;
    }

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imageUrl.trim(),
          caption: formattedCaption || null,
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
      setIsAuthentic(true);
      setSuccess('Photograph added to gallery successfully and published!');
    } catch (err: any) {
      setError(err.message || 'Failed to add photograph');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (photo: GalleryItem) => {
    setEditingPhoto(photo);
    setEditImageUrl(photo.imageUrl);
    setEditCaption(photo.caption || '');
    setEditCategory(photo.category);
    setEditDisplayOrder(photo.displayOrder.toString());
  };

  const closeEditModal = () => {
    setEditingPhoto(null);
    setEditImageUrl('');
    setEditCaption('');
  };

  const handleUpdatePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPhoto.id,
          imageUrl: editImageUrl.trim(),
          caption: editCaption.trim() || null,
          category: editCategory,
          displayOrder: parseInt(editDisplayOrder, 10) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update photo');

      setPhotos(photos.map((p) => (p.id === editingPhoto.id ? data.photo : p)));
      setSuccess('Photograph updated successfully!');
      closeEditModal();
    } catch (err: any) {
      setError(err.message || 'Failed to update photograph');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this photograph from the website?');
    if (!confirmed) return;

    try {
      const res = await fetch('/api/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Failed to delete photo');

      setPhotos(photos.filter((p) => p.id !== id));
      setSuccess('Photograph deleted from gallery.');
    } catch (err: any) {
      alert('Error deleting photo: ' + err.message);
    }
  };

  const isPhotoPlaceholder = (item: GalleryItem) => {
    return (
      item.caption?.includes('[Preview Placeholder]') ||
      item.caption?.includes('[Sample Placeholder]') ||
      item.caption?.includes('[Attraction Guide]') ||
      item.imageUrl.includes('unsplash.com')
    );
  };

  const filteredPhotos =
    selectedCategory === 'All'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-10">
      {/* 1. Photo Source Priority & Compliance Guidance */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-ivory-dark shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-forest/5 text-forest shrink-0">
            <Camera className="w-6 h-6 text-gold-dark" />
          </div>
          <div>
            <h2 className="font-serif text-base sm:text-lg font-bold text-forest">
              Resort Photography Source Policy & Standards
            </h2>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-forest/80 leading-relaxed">
              <div className="p-3 rounded-xl bg-ivory/60 border border-ivory-dark">
                <strong className="block text-forest mb-1">Priority 1 & 2: Original Resort Photos</strong>
                <span>
                  Upload genuine photographs captured directly at Hill Queen Eco Resort. You can add, replace, and delete photos anytime using the tools below.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-ivory/60 border border-ivory-dark">
                <strong className="block text-forest mb-1">Priority 3 & 4: Google Maps & Copyright Integrity</strong>
                <span>
                  Never scrape or download customer-uploaded Google Maps photos without permission. Maps photos may only be shown via official Google APIs with full attribution.
                </span>
              </div>
            </div>
            <p className="text-[11px] text-forest/70 mt-2">
              <strong>Priority 5 (Placeholders):</strong> Temporary preview images are clearly labelled as placeholders to avoid misleading travellers until replaced by authentic photos.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Add New Photo Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-dark shadow-sm">
        <h2 className="font-serif text-xl font-bold text-forest border-b border-ivory-dark pb-3 mb-6">
          Add New Photograph to Gallery
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

        <form onSubmit={handleAddPhoto} className="space-y-6">
          {/* 1. Image Source & Upload Box */}
          <div className="p-5 rounded-2xl bg-ivory/30 border border-ivory-dark space-y-3">
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider">
              Photograph Image Source *
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste photograph URL or click Upload from Device"
                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-ivory-dark bg-white text-forest text-sm focus:outline-none focus:border-gold"
              />
              <label className="btn-forest px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm shrink-0 whitespace-nowrap">
                <Upload className="w-4 h-4 text-gold" />
                <span>{uploading ? 'Uploading...' : 'Upload from Device'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-[11px] text-forest/60">
              Tip: Pasting direct photo URLs is recommended for cloud deployments. Supported: JPG, PNG, WebP, AVIF.
            </p>

            {/* Live Image Preview Thumbnail */}
            {imageUrl && (
              <div className="pt-2 flex items-center gap-4 bg-white p-3 rounded-xl border border-ivory-dark">
                <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gold/40 bg-forest-dark shrink-0">
                  <Image src={imageUrl} alt="Upload preview" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <span className="font-semibold text-forest block">Photo Preview Ready</span>
                  <p className="text-forest/60 truncate font-mono text-[11px] mt-0.5">{imageUrl}</p>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="mt-1 text-red-600 hover:text-red-700 text-[11px] font-medium underline"
                  >
                    Clear photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Photo Metadata in a Balanced 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
                Gallery Category (8 Sections) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold font-medium"
              >
                {RESORT_GALLERY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Photo Type (Authenticity) */}
            <div>
              <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
                Photo Authenticity Type
              </label>
              <select
                value={isAuthentic ? 'authentic' : 'placeholder'}
                onChange={(e) => setIsAuthentic(e.target.value === 'authentic')}
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
              >
                <option value="authentic">Authentic Resort Photograph (Owner/Staff)</option>
                <option value="placeholder">Temporary Preview Placeholder</option>
              </select>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
                Photo Caption / Description
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Front veranda of Eco Cottage overlooking the garden"
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
              />
            </div>

            {/* Sequence */}
            <div>
              <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
                Display Order (Sequence)
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || uploading}
              className="btn-gold px-7 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : '+ Publish Photograph to Gallery'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Existing Gallery Photos Grid with Filters & Actions */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-dark shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ivory-dark pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-forest">
              Existing Photographs ({photos.length})
            </h2>
            <p className="text-xs text-forest/70 mt-0.5">
              Filter by category, replace photo files, update captions, or delete.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap max-w-full">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === 'All'
                  ? 'bg-forest text-gold'
                  : 'bg-ivory text-forest hover:bg-forest hover:text-ivory'
              }`}
            >
              All ({photos.length})
            </button>
            {RESORT_GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
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
          <div className="text-center py-16 text-forest/60 text-xs bg-ivory/30 rounded-2xl border border-dashed border-ivory-dark">
            No photographs found in this category. Upload or add the first photo above!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => {
              const isPlaceholder = isPhotoPlaceholder(photo);
              return (
                <div
                  key={photo.id}
                  className="relative rounded-2xl overflow-hidden border border-ivory-dark group bg-forest-dark flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption || photo.category}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

                    {/* Category badge */}
                    <span className="absolute top-2 left-2 text-[10px] font-semibold bg-forest/90 text-gold px-2 py-0.5 rounded border border-gold/30">
                      {photo.category}
                    </span>

                    {/* Authenticity badge */}
                    <span
                      className={`absolute bottom-2 left-2 text-[9px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm border ${
                        isPlaceholder
                          ? 'bg-black/60 text-ivory/80 border-white/20'
                          : 'bg-gold/90 text-forest border-gold font-bold'
                      }`}
                    >
                      {isPlaceholder ? 'Preview Placeholder' : '✓ Authentic Photo'}
                    </span>

                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(photo)}
                        title="Replace or Edit Photo"
                        className="p-1.5 rounded-full bg-forest/90 text-gold hover:bg-forest transition-colors shadow-sm border border-gold/40"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        title="Delete Photo"
                        className="p-1.5 rounded-full bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-white text-forest text-xs flex-1 flex flex-col justify-between">
                    <div>
                      {photo.caption ? (
                        <p className="line-clamp-2 text-forest/85 font-medium">
                          {photo.caption}
                        </p>
                      ) : (
                        <span className="text-forest/50 italic text-[11px]">No caption set</span>
                      )}
                    </div>
                    <div className="pt-2 border-t border-ivory-dark mt-2 flex items-center justify-between text-[10px] text-forest/60">
                      <span>Order: #{photo.displayOrder}</span>
                      <button
                        onClick={() => openEditModal(photo)}
                        className="text-gold-dark hover:text-forest font-semibold underline"
                      >
                        Replace / Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Edit / Replace Photo Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-ivory-dark shadow-2xl relative animate-fadeIn">
            <div className="flex items-center justify-between border-b border-ivory-dark pb-3 mb-5">
              <h3 className="font-serif text-lg font-bold text-forest">
                Replace / Edit Photograph
              </h3>
              <button
                onClick={closeEditModal}
                className="p-1.5 rounded-full hover:bg-ivory text-forest/70 hover:text-forest"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePhoto} className="space-y-4 text-xs">
              {/* Replace Image File / URL */}
              <div className="space-y-1.5 p-3 rounded-xl bg-ivory/30 border border-ivory-dark">
                <label className="block font-semibold text-forest uppercase tracking-wider text-[11px]">
                  Replace Image Source *
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="Paste new image URL"
                    className="flex-1 px-3 py-2 rounded-xl border border-ivory-dark bg-white text-forest text-xs focus:outline-none focus:border-gold"
                  />
                  <label className="btn-forest px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0 shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-gold" />
                    <span>{editUploading ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Category & Order Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category */}
                <div>
                  <label className="block font-semibold text-forest uppercase tracking-wider mb-1 text-[11px]">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-xs focus:outline-none focus:border-gold"
                  >
                    {RESORT_GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block font-semibold text-forest uppercase tracking-wider mb-1 text-[11px]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editDisplayOrder}
                    onChange={(e) => setEditDisplayOrder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block font-semibold text-forest uppercase tracking-wider mb-1 text-[11px]">
                  Caption / Description
                </label>
                <input
                  type="text"
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  placeholder="Photo caption"
                  className="w-full px-3 py-2 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-xs focus:outline-none focus:border-gold"
                />
              </div>

              {/* Preview */}
              {editImageUrl && (
                <div className="pt-1 flex items-center gap-3 p-2.5 rounded-xl bg-ivory/40 border border-ivory-dark">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-gold/40 bg-forest-dark shrink-0">
                    <Image src={editImageUrl} alt="Edit preview" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-forest/70 font-semibold block">Replacement Preview</span>
                    <p className="text-[10px] text-forest/50 truncate font-mono">{editImageUrl}</p>
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2 border-t border-ivory-dark">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 rounded-xl border border-forest/20 text-forest text-xs hover:bg-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || editUploading}
                  className="btn-gold px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <span>{submitting ? 'Saving...' : 'Save & Replace'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
