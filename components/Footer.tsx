import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Mail, MapPin, Clock, Mountain, ShieldCheck, ExternalLink } from 'lucide-react';
import { ResortSettings, buildTelLink, buildWhatsAppLink } from '@/lib/settings';

interface FooterProps {
  settings: ResortSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-dark text-ivory/80 pt-16 pb-10 border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gold/15">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold/40 bg-forest flex items-center justify-center text-gold">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-ivory tracking-wide">
                  HILL QUEEN
                </h3>
                <p className="text-xs text-gold tracking-widest uppercase">
                  Eco Resort • Murguma
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-ivory/70">
              Escape Into Nature. Stay Close to Serenity. Experience genuine Purulia hospitality surrounded by the scenic Ajodhya Hills and peaceful Murguma waters.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-gold">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Direct Booking & Inquiry</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-ivory tracking-wider uppercase mb-4 border-b border-gold/20 pb-2">
              Explore Resort
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1.5">
                  <span>›</span> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors flex items-center gap-1.5">
                  <span>›</span> About the Resort & Purulia
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-gold transition-colors flex items-center gap-1.5">
                  <span>›</span> Cottages, Rooms & Pricing
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-gold transition-colors flex items-center gap-1.5">
                  <span>›</span> Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors flex items-center gap-1.5">
                  <span>›</span> Location, Map & Directions
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-gold text-ivory/50 transition-colors flex items-center gap-1.5 pt-1">
                  <span>›</span> Management Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Direct Inquiries */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-ivory tracking-wider uppercase mb-4 border-b border-gold/20 pb-2">
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gold font-medium mb-1">
                  Direct Phone Lines:
                </p>
                <div className="space-y-1">
                  <a
                    href={buildTelLink(settings.phonePrimary)}
                    className="flex items-center gap-2 hover:text-gold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>+91 {settings.phonePrimary} (Primary)</span>
                  </a>
                  {settings.phoneSecondary && (
                    <a
                      href={buildTelLink(settings.phoneSecondary)}
                      className="flex items-center gap-2 hover:text-gold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>+91 {settings.phoneSecondary}</span>
                    </a>
                  )}
                  {settings.phoneTertiary && (
                    <a
                      href={buildTelLink(settings.phoneTertiary)}
                      className="flex items-center gap-2 hover:text-gold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>+91 {settings.phoneTertiary}</span>
                    </a>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-gold font-medium mb-1">
                  WhatsApp Inquiries:
                </p>
                <a
                  href={buildWhatsAppLink(settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-ivory hover:text-gold transition-colors font-medium"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>+91 {settings.whatsappNumber}</span>
                </a>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-gold font-medium mb-1">
                  Email Address:
                </p>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>{settings.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Location & Timings */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-ivory tracking-wider uppercase mb-4 border-b border-gold/20 pb-2">
              Location & Schedule
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Check-in: <strong>{settings.checkInTime}</strong> | Check-out: <strong>{settings.checkOutTime}</strong></span>
              </div>
              {settings.googleMapsUrl && (
                <div className="pt-2">
                  <a
                    href={settings.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-gold hover:text-gold-light text-xs font-medium underline underline-offset-4"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              <div className="pt-2">
                <p className="text-[11px] text-ivory/60 leading-normal">
                  Hill Queen Eco Resort is a serene nature stay. We do not require advance online payment gateway transactions. Connect with us directly via phone or WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/50 gap-4">
          <p>
            © {currentYear} {settings.resortName}. All rights reserved. Mamudi, Murguma, Purulia, West Bengal.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-gold transition-colors">
              About
            </Link>
            <Link href="/rooms" className="hover:text-gold transition-colors">
              Rooms & Tariffs
            </Link>
            <Link href="/contact" className="hover:text-gold transition-colors">
              Contact Us
            </Link>
            <Link href="/admin/login" className="hover:text-gold transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
