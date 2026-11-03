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
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

interface RoomGalleryItem {
  id?: string;
  imageUrl: string;
  caption?: string;
}

interface RoomFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function RoomForm({ initialData, isEditing = false }: RoomFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    roomType: initialData?.roomType || 'Double Bedded Room',
    price: initialData?.price !== undefined ? initialData.price.toString() : '2000',
    description: initialData?.description || '',
    maximumOccupancy: initialData?.maximumOccupancy || 2,
    bedConfiguration: initialData?.bedConfiguration || '1 Double Bed',
    isAc: initialData?.isAc !== undefined ? initialData.isAc : true,
    hasAttachedBath: initialData?.hasAttachedBath !== undefined ? initialData.hasAttachedBath : true,
    extraBedAvailable: initialData?.extraBedAvailable || false,
    foodInclusion: initialData?.foodInclusion || 'Complimentary morning tea; authentic Bengali meals available on order',
    amenities: initialData?.amenities || 'Air Conditioning, Attached Western Toilet, Geyser / Hot Water, Power Backup, Bonfire, Lawn Access',
    mainImage: initialData?.mainImage || '/images/placeholders/double-bedded-room.svg',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    displayOrder: initialData?.displayOrder || 0,
  });

  const [additionalImages, setAdditionalImages] = useState<RoomGalleryItem[]>(
    initialData?.images?.map((img: any) =>
      typeof img === 'string'
        ? { imageUrl: img, caption: '' }
        : { id: img.id, imageUrl: img.imageUrl, caption: img.caption || '' }
    ) || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');

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
        setAdditionalImages((prev) => [...prev, { imageUrl: data.url, caption: '' }]);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setAdditionalImages((prev) => [
      ...prev,
      { imageUrl: newImageUrl.trim(), caption: newImageCaption.trim() },
    ]);
    setNewImageUrl('');
    setNewImageCaption('');
  };

  const handleCaptionChange = (index: number, caption: string) => {
    setAdditionalImages((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, caption } : item))
    );
  };

  const handleSetAsCover = (index: number) => {
    const chosen = additionalImages[index];
    const previousCover = formData.mainImage;
    setFormData((prev) => ({ ...prev, mainImage: chosen.imageUrl }));
    // Swap previous cover image into the gallery at this slot
    setAdditionalImages((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, imageUrl: previousCover } : item
      )
    );
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= additionalImages.length) return;
    setAdditionalImages((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
  };

  const handleRemoveImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, idx) => idx !== index));
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
      images: additionalImages.map((item, idx) => ({
        imageUrl: item.imageUrl,
        caption: item.caption || null,
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
              <option value="Double Bedded Room">Double Bedded Room</option>
              <option value="Triple Bedded Room">Triple Bedded Room</option>
              <option value="Four Bedded Room">Four Bedded Room</option>
              <option value="Five Bedded Room">Five Bedded Room</option>
              <option value="Tent Accommodation">Tent Accommodation</option>
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
        <div>
          <h2 className="font-serif text-lg font-bold text-forest border-b border-ivory-dark pb-3">
            3. Room Photographs & Visual Gallery
          </h2>
          <p className="text-xs text-forest/70 mt-1">
            Manage genuine property photographs for this room category. You can set the main cover image, add gallery photos, edit descriptive captions, reorder pictures, or replace them anytime.
          </p>
        </div>

        {/* Main Cover Image */}
        <div className="p-5 rounded-2xl bg-ivory/30 border border-ivory-dark">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider">
              Primary Cover Photograph (Shown on cards & catalogue) *
            </label>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold bg-forest-dark px-2.5 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-gold text-gold" />
              <span>Active Cover</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="text"
              name="mainImage"
              value={formData.mainImage}
              onChange={handleInputChange}
              placeholder="/images/... or https://... or upload below"
              className="flex-1 px-4 py-2.5 rounded-xl border border-ivory-dark bg-white text-forest text-sm focus:outline-none focus:border-gold"
            />
            <label className="btn-forest px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-2 shrink-0">
              <Upload className="w-4 h-4 text-gold" />
              <span>{uploading ? 'Uploading...' : 'Upload Cover Photo'}</span>
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
            <div className="mt-3 relative w-full sm:w-64 h-36 rounded-xl overflow-hidden border border-ivory-dark bg-forest-dark shadow-sm">
              <Image
                src={formData.mainImage}
                alt="Main cover image preview"
                fill
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 backdrop-blur-sm text-ivory px-2 py-0.5 rounded">
                Current Main Photo
              </span>
            </div>
          )}
        </div>

        {/* Additional Images Section */}
        <div className="pt-4 border-t border-ivory-dark space-y-5">
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1">
              Add Additional Room Photographs
            </label>
            <p className="text-xs text-forest/65">
              Add interior perspectives, bathroom views, private veranda, or bed arrangements.
            </p>
          </div>

          {/* Input Controls */}
          <div className="p-4 rounded-2xl bg-white border border-ivory-dark shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste photograph URL or use device upload button"
                className="sm:col-span-7 px-4 py-2 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-xs focus:outline-none focus:border-gold"
              />
              <input
                type="text"
                value={newImageCaption}
                onChange={(e) => setNewImageCaption(e.target.value)}
                placeholder="Caption (e.g. Attached Clean Bathroom)"
                className="sm:col-span-5 px-4 py-2 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-xs focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex items-center gap-3 justify-end pt-1">
              <button
                type="button"
                onClick={handleAddImageUrl}
                disabled={!newImageUrl.trim()}
                className="btn-gold px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo by URL</span>
              </button>
              <label className="btn-forest px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-gold" />
                <span>{uploading ? 'Uploading...' : 'Upload from Device'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Additional Photos List */}
          {additionalImages.length > 0 ? (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-forest uppercase tracking-wider block">
                Attached Room Gallery ({additionalImages.length} Photographs)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {additionalImages.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-2xl border border-ivory-dark shadow-sm space-y-2.5 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Thumbnail with overlay badge */}
                      <div className="relative h-36 w-full rounded-xl overflow-hidden border border-ivory-dark bg-forest-dark">
                        <Image
                          src={item.imageUrl}
                          alt={item.caption || `Room photo ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute top-2 left-2 text-[10px] bg-black/70 backdrop-blur-sm text-gold px-2 py-0.5 rounded font-semibold">
                          #{idx + 1}
                        </span>
                      </div>

                      {/* Caption Input */}
                      <div className="mt-2.5">
                        <input
                          type="text"
                          value={item.caption || ''}
                          onChange={(e) => handleCaptionChange(idx, e.target.value)}
                          placeholder="Photo caption (e.g. Washroom)"
                          className="w-full px-3 py-1.5 rounded-lg border border-ivory-dark bg-ivory/20 text-forest text-xs focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    {/* Action Toolbar */}
                    <div className="pt-2 border-t border-ivory-dark flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => handleSetAsCover(idx)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-dark hover:text-forest transition-colors"
                        title="Make this photo the main room cover"
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span>Set as Cover</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'left')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-ivory text-forest hover:bg-forest hover:text-white disabled:opacity-30 transition-colors"
                          title="Move Earlier"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'right')}
                          disabled={idx === additionalImages.length - 1}
                          className="p-1.5 rounded-lg bg-ivory text-forest hover:bg-forest hover:text-white disabled:opacity-30 transition-colors"
                          title="Move Later"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors ml-1"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-ivory/30 border border-ivory-dark text-center text-xs text-forest/70">
              No additional photographs attached yet. Upload images above to show detailed interior and bathroom views.
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
