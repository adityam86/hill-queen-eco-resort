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
  MapPin,
  Car,
  Clock,
  Compass,
  Navigation,
  ExternalLink,
  X,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { AttractionData, AttractionCategory, ATTRACTION_CATEGORIES } from '@/lib/attractions';

interface AdminAttractionsManagerProps {
  initialAttractions: AttractionData[];
}

export default function AdminAttractionsManager({
  initialAttractions,
}: AdminAttractionsManagerProps) {
  const [attractions, setAttractions] = useState<AttractionData[]>(initialAttractions);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Form states for creating a new attraction
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Dams & Lakes');
  const [distanceKm, setDistanceKm] = useState('');
  const [drivingTimeMin, setDrivingTimeMin] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [travelTip, setTravelTip] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');

  // Editing state
  const [editingItem, setEditingItem] = useState<AttractionData | null>(null);
  const [editUploading, setEditUploading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // File upload handler
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isEdit) setEditUploading(true);
    else setUploading(true);
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

      if (isEdit && editingItem) {
        setEditingItem({ ...editingItem, imageUrl: data.url });
      } else {
        setImageUrl(data.url);
      }
      setSuccess('Image uploaded successfully! Ready to save.');
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      if (isEdit) setEditUploading(false);
      else setUploading(false);
    }
  };

  // Create new attraction
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !distanceKm || !drivingTimeMin) {
      setError('Please provide destination name, description, distance, and driving time.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const highlightsArray = highlightsInput
        ? highlightsInput
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const res = await fetch('/api/attractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          title: title || name,
          category,
          distanceKm: parseFloat(distanceKm),
          drivingTimeMin: parseInt(drivingTimeMin, 10),
          imageUrl: imageUrl || '/images/attractions/murguma-dam.jpg',
          description,
          bestTimeToVisit: bestTimeToVisit || null,
          highlights: highlightsArray.length > 0 ? JSON.stringify(highlightsArray) : null,
          travelTip: travelTip || null,
          displayOrder: parseInt(displayOrder, 10) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add attraction');

      setAttractions((prev) => [...prev, data.attraction].sort((a, b) => a.displayOrder - b.displayOrder));
      setSuccess(`"${name}" has been successfully published to the sightseeing guide!`);

      // Reset form
      setName('');
      setTitle('');
      setDistanceKm('');
      setDrivingTimeMin('');
      setImageUrl('');
      setDescription('');
      setBestTimeToVisit('');
      setHighlightsInput('');
      setTravelTip('');
      setDisplayOrder('0');
      setIsAdding(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add attraction');
    } finally {
      setSubmitting(false);
    }
  };

  // Update attraction
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/attractions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update attraction');

      setAttractions((prev) =>
        prev
          .map((a) => (a.id === data.attraction.id ? data.attraction : a))
          .sort((a, b) => a.displayOrder - b.displayOrder)
      );
      setSuccess(`"${data.attraction.name}" updated successfully!`);
      setEditingItem(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update attraction');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (item: AttractionData) => {
    try {
      const res = await fetch('/api/attractions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAttractions((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, isActive: !item.isActive } : a))
      );
      setSuccess(`Visibility updated for "${item.name}".`);
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  // Delete attraction
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the attractions guide?`)) return;

    try {
      const res = await fetch('/api/attractions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAttractions((prev) => prev.filter((a) => a.id !== id));
      setSuccess(`"${name}" deleted.`);
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    }
  };

  const filteredAttractions =
    selectedCategory === 'All'
      ? attractions
      : attractions.filter((a) => a.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">
            <strong>Error: </strong>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3 text-xs sm:text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
          <div className="flex-1">
            <strong>Success: </strong>
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Origin Info Box */}
      <div className="p-5 rounded-2xl bg-white border border-gold/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-base font-bold text-forest">
              Official Reference Location for All Sightseeing Distances
            </h2>
            <p className="text-xs text-forest/70 mt-0.5">
              <strong>Hill Queen Eco Resort</strong> • Mamudi, Murguma, Purulia, West Bengal, PIN 723152. All driving distances (km) and travel durations are calculated strictly from this departure point.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap inline-flex items-center gap-1.5 shadow-sm"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isAdding ? 'Cancel' : 'Add New Attraction'}</span>
        </button>
      </div>

      {/* Add Attraction Form */}
      {isAdding && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-gold/40 shadow-luxury space-y-6"
        >
          <div className="border-b border-ivory-dark pb-4">
            <h3 className="font-serif text-xl font-bold text-forest">
              Add New Nearby Sightseeing Destination
            </h3>
            <p className="text-xs text-forest/70 mt-1">
              Add verified information, authentic photographs, and accurate road distances from Hill Queen Eco Resort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">
                Destination Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Murguma Dam & Lake"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">
                Title / Heading
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Murguma Dam & Water Reservoir"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
              >
                {ATTRACTION_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">
                Distance from Resort (km) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                placeholder="e.g. 1.5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">
                Driving Time (Minutes) *
              </label>
              <input
                type="number"
                required
                value={drivingTimeMin}
                onChange={(e) => setDrivingTimeMin(e.target.value)}
                placeholder="e.g. 5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          {/* Photograph Upload */}
          <div className="p-4 rounded-xl bg-ivory/50 border border-gold/25 space-y-3">
            <span className="block text-xs font-semibold text-forest">
              Destination Photograph (Genuine & Authorized) *
            </span>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL or upload from device below"
                className="flex-1 px-3.5 py-2 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white w-full"
              />
              <label className="btn-forest px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload from Device'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            {imageUrl && (
              <div className="relative h-32 w-48 rounded-xl overflow-hidden border border-gold/30 mt-2">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-forest mb-1.5">
              Description in Natural English *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What makes this destination special and what will guests experience..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">
                Key Experiences / Highlights (1 per line)
              </label>
              <textarea
                rows={3}
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                placeholder="Mirror-like lake reflections&#10;Winter birdwatching&#10;Sunset viewpoints"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-forest mb-1.5">
                Local Travel Tip for Guests
              </label>
              <textarea
                rows={3}
                value={travelTip}
                onChange={(e) => setTravelTip(e.target.value)}
                placeholder="e.g. Sturdy walking shoes recommended for stone steps into gorge..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-forest mb-1.5">
              Best Time / Season to Visit
            </label>
            <input
              type="text"
              value={bestTimeToVisit}
              onChange={(e) => setBestTimeToVisit(e.target.value)}
              placeholder="e.g. October to March; Late afternoon for sunset"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-ivory-dark">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-5 py-2.5 rounded-xl border border-gold/30 text-xs font-semibold text-forest hover:bg-forest/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-gold px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Save & Publish Attraction'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gold/20">
        {ATTRACTION_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-forest text-gold shadow-sm'
                : 'bg-white text-forest/70 hover:bg-forest/5'
            }`}
          >
            {cat} (
            {cat === 'All'
              ? attractions.length
              : attractions.filter((a) => a.category === cat).length}
            )
          </button>
        ))}
      </div>

      {/* Attractions List Cards (Compact Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAttractions.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl overflow-hidden border transition-all duration-300 shadow-sm flex flex-col justify-between ${
              item.isActive ? 'border-gold/30 hover:border-gold/60' : 'border-red-200 opacity-60'
            }`}
          >
            <div>
              {/* Photo */}
              <div className="relative h-36 sm:h-40 w-full bg-forest-dark overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute top-2.5 left-2.5 bg-forest-dark/85 backdrop-blur-sm text-gold px-2 py-0.5 rounded-full text-[9px] font-semibold border border-gold/30">
                  {item.category}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-sm text-ivory px-2 py-0.5 rounded-full text-[9px] font-semibold border border-gold/30 flex items-center gap-1">
                  <Car className="w-2.5 h-2.5 text-gold" />
                  <span>~{item.distanceKm} km</span>
                  <span className="text-gold/50">•</span>
                  <span>~{item.drivingTimeMin}m</span>
                </div>
                {!item.isActive && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-red-300 text-[10px] font-bold uppercase tracking-wider bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-500/40">
                      Hidden
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-3.5">
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <h3 className="font-serif text-sm font-bold text-forest truncate" title={item.name}>
                    {item.name}
                  </h3>
                  <span className="text-[9px] text-forest/50 font-mono shrink-0">
                    #{item.displayOrder}
                  </span>
                </div>

                <p className="text-xs text-forest/70 line-clamp-2 leading-relaxed mb-2">
                  {item.description}
                </p>

                {item.travelTip && (
                  <div className="p-1.5 rounded-lg bg-gold/10 border border-gold/20 text-[10px] text-forest/80 flex items-start gap-1 mb-2">
                    <Info className="w-3 h-3 text-gold-dark shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{item.travelTip}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 pt-0 border-t border-ivory-dark mt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => handleToggleActive(item)}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                  item.isActive
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                {item.isActive ? 'Active (Live)' : 'Draft (Hidden)'}
              </button>

              <div className="flex items-center gap-1.5">
                <a
                  href={item.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-forest/60 hover:text-gold rounded-lg hover:bg-forest/5 transition-colors"
                  title="View Google Maps directions"
                >
                  <Navigation className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setEditingItem({ ...item })}
                  className="p-1.5 text-forest/70 hover:text-forest rounded-lg hover:bg-forest/5 transition-colors"
                  title="Edit Attraction"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete Attraction"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Attraction Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gold/40 my-8 space-y-5">
            <div className="flex items-center justify-between border-b border-ivory-dark pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-forest">
                  Edit Destination: {editingItem.name}
                </h3>
                <span className="text-xs text-forest/60">
                  Measured from Hill Queen Eco Resort, Mamudi, Murguma
                </span>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-forest/5 text-forest hover:bg-forest/10 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    Destination Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    Category
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
                  >
                    {ATTRACTION_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    Distance from Resort (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editingItem.distanceKm}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        distanceKm: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    Driving Time (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingItem.drivingTimeMin}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        drivingTimeMin: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
              </div>

              {/* Photo replace */}
              <div>
                <label className="block text-xs font-semibold text-forest mb-1">
                  Photograph Source
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingItem.imageUrl}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, imageUrl: e.target.value })
                    }
                    className="flex-1 px-3 py-2 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                  <label className="btn-forest px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{editUploading ? 'Uploading...' : 'Replace Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                      disabled={editUploading}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1">
                  Local Travel Tip
                </label>
                <input
                  type="text"
                  value={editingItem.travelTip || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, travelTip: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    value={editingItem.bestTimeToVisit || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        bestTimeToVisit: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingItem.displayOrder}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        displayOrder: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-ivory-dark">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-gold/30 text-xs font-semibold text-forest hover:bg-forest/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold px-5 py-2 rounded-xl text-xs font-semibold shadow-sm"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

