'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, CheckCircle2, AlertCircle, Phone, MessageSquare, Mail, MapPin, Globe } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: any;
}

export default function AdminSettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    resortName: initialSettings.resortName || 'Hill Queen Eco Resort',
    tagline: initialSettings.tagline || 'Escape Into Nature. Stay Close to Serenity.',
    address: initialSettings.address || 'Mamudi, Murguma, Purulia, West Bengal, India',
    phonePrimary: initialSettings.phonePrimary || '9735888106',
    phoneSecondary: initialSettings.phoneSecondary || '9733713255',
    phoneTertiary: initialSettings.phoneTertiary || '8670214030',
    whatsappNumber: initialSettings.whatsappNumber || '9735888106',
    email: initialSettings.email || 'hillqueenecoresort@gmail.com',
    websiteUrl: initialSettings.websiteUrl || 'https://hillqueenecoresort.com',
    googleMapsUrl: initialSettings.googleMapsUrl || 'https://maps.google.com/?q=Murguma+Dam+Purulia+West+Bengal',
    checkInTime: initialSettings.checkInTime || '11:00 AM',
    checkOutTime: initialSettings.checkOutTime || '10:00 AM',
    heroHeading: initialSettings.heroHeading || 'Discover Your Peaceful Escape.',
    heroSubheading: initialSettings.heroSubheading || 'Experience the beauty of nature and a relaxing stay at Hill Queen Eco Resort, Murguma, Purulia.',
    aboutText: initialSettings.aboutText || '',
    seoTitle: initialSettings.seoTitle || 'Hill Queen Eco Resort | Luxury Nature Resort in Murguma, Purulia',
    seoDescription: initialSettings.seoDescription || 'Experience peaceful luxury at Hill Queen Eco Resort in Mamudi, Murguma, Purulia. Serene accommodation near Murguma Dam & Ajodhya Hills with authentic hospitality.',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      setSuccess('Website settings updated successfully! All public pages are now synchronized.');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
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

      {/* 1. Verified Contact Numbers & Inquiries */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-dark shadow-sm space-y-6">
        <h2 className="font-serif text-lg font-bold text-forest border-b border-ivory-dark pb-3">
          1. Direct Contact & Enquiry Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Primary Phone */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Primary Phone *
            </label>
            <input
              type="text"
              name="phonePrimary"
              required
              value={formData.phonePrimary}
              onChange={handleChange}
              placeholder="9735888106"
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm font-semibold focus:outline-none focus:border-gold"
            />
          </div>

          {/* Secondary Phone */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Secondary Phone
            </label>
            <input
              type="text"
              name="phoneSecondary"
              value={formData.phoneSecondary}
              onChange={handleChange}
              placeholder="9733713255"
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {/* Third Phone */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Third Phone / Desk
            </label>
            <input
              type="text"
              name="phoneTertiary"
              value={formData.phoneTertiary}
              onChange={handleChange}
              placeholder="8670214030"
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* WhatsApp Number */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Primary WhatsApp Number *
            </label>
            <input
              type="text"
              name="whatsappNumber"
              required
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="9735888106"
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm font-semibold focus:outline-none focus:border-gold"
            />
            <span className="text-[11px] text-forest/60 mt-1 block">
              Used for all 1-tap WhatsApp room enquiries and floating buttons.
            </span>
          </div>

          {/* Official Email */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Official Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="hillqueenecoresort@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            Full Verified Address *
          </label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            placeholder="Mamudi, Murguma, Purulia, West Bengal, India"
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Website URL */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Website Domain URL
            </label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="https://hillqueenecoresort.com"
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {/* Google Maps Link */}
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Google Maps Location URL
            </label>
            <input
              type="text"
              name="googleMapsUrl"
              value={formData.googleMapsUrl}
              onChange={handleChange}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* Timings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Check-in Time
            </label>
            <input
              type="text"
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleChange}
              placeholder="11:00 AM"
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
              Check-out Time
            </label>
            <input
              type="text"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleChange}
              placeholder="10:00 AM"
              className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
            />
          </div>
        </div>
      </div>

      {/* 2. Homepage Content & Narrative */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-dark shadow-sm space-y-6">
        <h2 className="font-serif text-lg font-bold text-forest border-b border-ivory-dark pb-3">
          2. Homepage Content & Brand Narrative
        </h2>

        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            Hero Heading (Main Title)
          </label>
          <input
            type="text"
            name="heroHeading"
            value={formData.heroHeading}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            Hero Subheading / Tagline
          </label>
          <input
            type="text"
            name="heroSubheading"
            value={formData.heroSubheading}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            About the Resort Introduction
          </label>
          <textarea
            name="aboutText"
            rows={5}
            value={formData.aboutText}
            onChange={handleChange}
            placeholder="Introduction text displayed on home and about pages..."
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* 3. SEO & Search Engine Metadata */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-ivory-dark shadow-sm space-y-6">
        <h2 className="font-serif text-lg font-bold text-forest border-b border-ivory-dark pb-3">
          3. Local SEO & Meta Tags
        </h2>

        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            SEO Page Title
          </label>
          <input
            type="text"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            SEO Meta Description
          </label>
          <textarea
            name="seoDescription"
            rows={3}
            value={formData.seoDescription}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/20 text-forest text-sm focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button
          type="submit"
          disabled={saving}
          className="w-full btn-gold py-3.5 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-luxury uppercase tracking-wider disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Website Settings...' : 'Save All Settings'}</span>
        </button>
      </div>
    </form>
  );
}
