'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Upload,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ImageIcon,
} from 'lucide-react';
import Link from 'next/link';

interface RoomFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function RoomForm({ initialData, isEditing = false }: RoomFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    roomType: initialData?.roomType || 'Cottage',
    price: initialData?.price !== undefined ? initialData.price.toString() : '2500',
    description: initialData?.description || '',
    maximumOccupancy: initialData?.maximumOccupancy || 2,
    bedConfiguration: initialData?.bedConfiguration || '1 King Bed',
    isAc: initialData?.isAc || false,
    hasAttachedBath: initialData?.hasAttachedBath !== undefined ? initialData.hasAttachedBath : true,
    extraBedAvailable: initialData?.extraBedAvailable || false,
    foodInclusion: initialData?.foodInclusion || 'Complimentary morning tea; dining available on order',
    amenities: initialData?.amenities || 'Attached Western Bathroom, 24/7 Running Water, Mountain View, Power Backup, Tea Maker',
    mainImage: initialData?.mainImage || 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    displayOrder: initialData?.displayOrder || 0,
  });

  const [additionalImages, setAdditionalImages] = useState<string[]>(
    initialData?.images?.map((img: any) => img.imageUrl) || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Image file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain = true) => {
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

      if (isMain) {
        setFormData((prev) => ({ ...prev, mainImage: data.url }));
      } else {
        setAdditionalImages((prev) => [...prev, data.url]);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setAdditionalImages([...additionalImages, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      maximumOccupancy: parseInt(formData.maximumOccupancy.toString(), 10),
      displayOrder: parseInt(formData.displayOrder.toString(), 10),
      images: additionalImages.map((url, idx) => ({
        imageUrl: url,
        displayOrder: idx + 1,
      })),
    };

    try {
      const url = isEditing ? `/api/rooms/${initialData.id}` : '/api/rooms';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save room');

      setSuccess('Room saved successfully! Changes are now live on the public website.');
      setTimeout(() => {
        router.push('/admin/rooms');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error saving room category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Top action bar */}
      <div className="flex items-center justify-between pb-4 border-b border-ivory-dark">
        <Link
          href="/admin/rooms"
          className="inline-flex items-center gap-2 text-xs text-forest/70 hover:text-forest transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rooms List</span>
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Room Category'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 1. Core Details */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-dark shadow-sm space-y-6">
        <h2 className="font-serif text-lg font-bold text-forest border-b border-ivory-dark pb-3">
          1. Basic Room Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Room Name */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Room Category Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Eco Lake View Cottage"
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Accommodation Type *
            </label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            >
              <option value="Cottage">Cottage</option>
              <option value="Deluxe Cottage">Deluxe Cottage</option>
              <option value="Family Cottage">Family Cottage</option>
              <option value="Standard Room">Standard Room</option>
              <option value="Nature Suite">Nature Suite</option>
            </select>
          </div>
        </div>

        {/* Pricing & Occupancy */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Nightly Price */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Price per Night (INR) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-forest/50 font-bold text-sm">₹</span>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="50"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm font-semibold focus:outline-none focus:border-gold"
              />
            </div>
            <span className="text-[11px] text-forest/60 mt-1 block">
              Displayed transparently to customers.
            </span>
          </div>

          {/* Maximum Occupancy */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Maximum Guests *
            </label>
            <input
              type="number"
              name="maximumOccupancy"
              min="1"
              max="12"
              value={formData.maximumOccupancy}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Display Sequence Order
            </label>
            <input
              type="number"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            Room Description *
          </label>
          <textarea
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Detailed description of cottage layout, views, peace, surroundings..."
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* 2. Room Specifications & Amenities */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-dark shadow-sm space-y-6">
        <h2 className="font-serif text-lg font-bold text-forest border-b border-ivory-dark pb-3">
          2. Specifications & Amenities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Bed Configuration */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Bed Layout Details
            </label>
            <input
              type="text"
              name="bedConfiguration"
              value={formData.bedConfiguration}
              onChange={handleInputChange}
              placeholder="e.g. 1 King Bed or 2 Double Beds"
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {/* Food Inclusion */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Food / Meal Terms
            </label>
            <input
              type="text"
              name="foodInclusion"
              value={formData.foodInclusion}
              onChange={handleInputChange}
              placeholder="e.g. Complimentary morning tea; meal packages extra"
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Checkbox toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-ivory-dark bg-ivory/20 cursor-pointer hover:bg-ivory/40">
            <input
              type="checkbox"
              name="isAc"
              checked={formData.isAc}
              onChange={handleInputChange}
              className="w-4 h-4 text-forest rounded focus:ring-gold"
            />
            <span className="text-xs font-semibold text-forest">Air Conditioned (AC)</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-ivory-dark bg-ivory/20 cursor-pointer hover:bg-ivory/40">
            <input
              type="checkbox"
              name="hasAttachedBath"
              checked={formData.hasAttachedBath}
              onChange={handleInputChange}
              className="w-4 h-4 text-forest rounded focus:ring-gold"
            />
            <span className="text-xs font-semibold text-forest">Attached Bathroom</span>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-xl border border-ivory-dark bg-ivory/20 cursor-pointer hover:bg-ivory/40">
            <input
              type="checkbox"
              name="extraBedAvailable"
              checked={formData.extraBedAvailable}
              onChange={handleInputChange}
              className="w-4 h-4 text-forest rounded focus:ring-gold"
            />
            <span className="text-xs font-semibold text-forest">Extra Bed Available</span>
          </label>
        </div>

        {/* Amenities (comma-separated) */}
        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            Amenities (Comma-separated list)
          </label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleInputChange}
            placeholder="Attached Western Bathroom, 24/7 Running Water, Mountain View, Power Backup, Tea Maker"
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
          />
          <span className="text-[11px] text-forest/60 mt-1 block">
            These will display as amenity pills on the room card and details page.
          </span>
        </div>

        {/* Active Toggle */}
        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="w-4 h-4 text-forest rounded focus:ring-gold"
            />
            <span className="text-xs font-bold text-forest">
              Publish Room on Website (Active)
            </span>
          </label>
        </div>
      </div>

      {/* 3. Photographs & Gallery */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-dark shadow-sm space-y-6">
        <h2 className="font-serif text-lg font-bold text-forest border-b border-ivory-dark pb-3">
          3. Room Photographs
        </h2>

        {/* Main Image */}
        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            Main Room Photograph URL or Upload
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="text"
              name="mainImage"
              value={formData.mainImage}
              onChange={handleInputChange}
              placeholder="https://... or upload local image file below"
              className="flex-1 px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
            <label className="btn-forest px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-2 shrink-0">
              <Upload className="w-4 h-4 text-gold" />
              <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true)}
                className="hidden"
              />
            </label>
          </div>

          {/* Main image preview */}
          {formData.mainImage && (
            <div className="mt-3 relative w-48 h-32 rounded-xl overflow-hidden border border-ivory-dark bg-forest-dark">
              <Image
                src={formData.mainImage}
                alt="Main image preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Additional Images */}
        <div className="pt-4 border-t border-ivory-dark space-y-4">
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider">
            Additional Room Photographs
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Paste photo URL here"
              className="flex-1 px-4 py-2 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-xs focus:outline-none focus:border-gold"
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 rounded-xl bg-forest text-ivory text-xs font-semibold hover:bg-olive"
            >
              Add URL
            </button>
            <label className="btn-forest px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 shrink-0">
              <Upload className="w-3.5 h-3.5 text-gold" />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, false)}
                className="hidden"
              />
            </label>
          </div>

          {/* Additional Photos List */}
          {additionalImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {additionalImages.map((url, idx) => (
                <div
                  key={idx}
                  className="relative h-24 rounded-xl overflow-hidden border border-ivory-dark group"
                >
                  <Image src={url} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={saving}
          className="w-full btn-gold py-3.5 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-luxury uppercase tracking-wider disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Room Data...' : isEditing ? 'Save All Room Changes' : 'Publish New Room Category'}</span>
        </button>
      </div>
    </form>
  );
}
