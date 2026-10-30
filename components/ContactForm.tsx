'use client';

import React, { useState } from 'react';
import { MessageSquare, Calendar, Users, Home, Phone, Send, CheckCircle2 } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/settings';

interface ContactFormProps {
  whatsappNumber: string;
}

export default function ContactForm({ whatsappNumber }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: '2 Guests',
    roomType: 'Eco Cottage',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const formattedNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

    let message = `Hello Hill Queen Eco Resort,\nI would like to enquire about booking availability:\n`;
    if (formData.name) message += `• Name: ${formData.name}\n`;
    if (formData.phone) message += `• Contact: ${formData.phone}\n`;
    if (formData.checkIn) message += `• Check-in Date: ${formData.checkIn}\n`;
    if (formData.checkOut) message += `• Check-out Date: ${formData.checkOut}\n`;
    message += `• Guests: ${formData.guests}\n`;
    message += `• Accommodation Preference: ${formData.roomType}\n`;
    if (formData.notes) message += `• Details/Food requirements: ${formData.notes}\n`;
    message += `Please confirm current availability and tariffs. Thank you.`;

    const url = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            Your Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Subrata Mukherjee"
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/30 text-forest text-sm focus:outline-none focus:border-gold focus:bg-white transition-colors"
          />
        </div>

        {/* Contact Phone */}
        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            Your Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. 9830000000"
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/30 text-forest text-sm focus:outline-none focus:border-gold focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Check-in Date */}
        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            Approximate Check-in
          </label>
          <input
            type="date"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/30 text-forest text-sm focus:outline-none focus:border-gold focus:bg-white transition-colors"
          />
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            Approximate Check-out
          </label>
          <input
            type="date"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/30 text-forest text-sm focus:outline-none focus:border-gold focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Guests */}
        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            Total Guests
          </label>
          <select
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/30 text-forest text-sm focus:outline-none focus:border-gold focus:bg-white transition-colors"
          >
            <option value="1 Guest">1 Guest</option>
            <option value="2 Guests">2 Guests (Couple / Friends)</option>
            <option value="3 Guests">3 Guests</option>
            <option value="4 Guests">4 Guests (Family)</option>
            <option value="5-8 Guests">5 - 8 Guests (Group)</option>
            <option value="9+ Guests">9+ Guests (Large Group)</option>
          </select>
        </div>

        {/* Preferred Accommodation */}
        <div>
          <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
            Preferred Accommodation
          </label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/30 text-forest text-sm focus:outline-none focus:border-gold focus:bg-white transition-colors"
          >
            <option value="Eco Lake View Cottage">Eco Lake View Cottage</option>
            <option value="Deluxe Hillside Family Cottage">Deluxe Hillside Family Cottage</option>
            <option value="Standard Serenity Room">Standard Serenity Room</option>
            <option value="Any Available Accommodation">Any Available Accommodation</option>
          </select>
        </div>
      </div>

      {/* Special Requests / Meal Preferences */}
      <div>
        <label className="block text-xs font-semibold text-forest uppercase tracking-wider mb-1.5">
          Meal Preferences / Special Inquiries
        </label>
        <textarea
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          placeholder="e.g. Need Bengali thali meals, extra bed for child, or pick-up assistance from Suisa / Purulia station."
          className="w-full px-4 py-2.5 rounded-xl border border-ivory-dark bg-ivory/30 text-forest text-sm focus:outline-none focus:border-gold focus:bg-white transition-colors"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full btn-gold py-3.5 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 tracking-wide uppercase shadow-luxury"
      >
        <MessageSquare className="w-4 h-4 fill-forest text-forest" />
        <span>Open WhatsApp & Send Enquiry</span>
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-forest/70 pt-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-gold-dark" />
        <span>Connects directly with the resort owner with zero intermediaries</span>
      </div>
    </form>
  );
}
