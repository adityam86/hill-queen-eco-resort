import React from 'react';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Globe,
  Clock,
  Compass,
  ExternalLink,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { getResortSettings, buildTelLink, buildWhatsAppLink } from '@/lib/settings';
import ContactForm from '@/components/ContactForm';

export const revalidate = 60;

export const metadata = {
  title: 'Contact & Location | Hill Queen Eco Resort, Murguma, Purulia',
  description: 'Contact Hill Queen Eco Resort in Mamudi, Murguma, Purulia, West Bengal. Direct telephone numbers: 9735888106, 9733713255, 8670214030. WhatsApp enquiry and Google Maps directions.',
};

export default async function ContactPage() {
  const settings = await getResortSettings();

  return (
    <div className="bg-[#FAF7EF] min-h-screen text-forest pb-24">
      {/* 1. Header Banner */}
      <section className="relative py-20 sm:py-24 bg-forest-dark text-ivory overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop"
            alt="Murguma landscape"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/80 to-forest-dark/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest/80 border border-gold/40 text-gold text-xs font-semibold mb-4 tracking-wider uppercase">
            <MapPin className="w-3.5 h-3.5" />
            <span>Verified Property Coordinates</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-ivory mb-4">
            Contact & Directions
          </h1>
          <p className="text-sm sm:text-base text-ivory/80 leading-relaxed max-w-2xl mx-auto font-light">
            We welcome direct enquiries from travellers, families, and nature enthusiasts. Reach out via WhatsApp or phone for date availability and route assistance.
          </p>
        </div>
      </section>

      {/* 2. Main Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Verified Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ivory-dark shadow-luxury space-y-6">
              <div className="border-b border-ivory-dark pb-4">
                <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold block mb-1">
                  Resort Property
                </span>
                <h2 className="font-serif text-2xl font-bold text-forest">
                  {settings.resortName}
                </h2>
                <p className="text-xs text-forest/70 mt-1">
                  Mamudi, Murguma, Purulia, West Bengal, India
                </p>
              </div>

              {/* Direct Telephone Lines */}
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-gold-dark font-semibold block">
                  Direct Telephone Lines:
                </span>
                <div className="space-y-2 text-sm">
                  <a
                    href={buildTelLink(settings.phonePrimary)}
                    className="flex items-center justify-between p-3 rounded-xl bg-ivory border border-ivory-dark hover:border-gold hover:bg-gold/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-forest">
                        +91 {settings.phonePrimary}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-gold-dark bg-white px-2 py-0.5 rounded border border-ivory-dark">
                      Primary
                    </span>
                  </a>

                  {settings.phoneSecondary && (
                    <a
                      href={buildTelLink(settings.phoneSecondary)}
                      className="flex items-center justify-between p-3 rounded-xl bg-ivory border border-ivory-dark hover:border-gold hover:bg-gold/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-forest">
                          +91 {settings.phoneSecondary}
                        </span>
                      </div>
                      <span className="text-[11px] text-forest/60">Alternate</span>
                    </a>
                  )}

                  {settings.phoneTertiary && (
                    <a
                      href={buildTelLink(settings.phoneTertiary)}
                      className="flex items-center justify-between p-3 rounded-xl bg-ivory border border-ivory-dark hover:border-gold hover:bg-gold/10 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-forest">
                          +91 {settings.phoneTertiary}
                        </span>
                      </div>
                      <span className="text-[11px] text-forest/60">Desk</span>
                    </a>
                  )}
                </div>
              </div>

              {/* WhatsApp Direct Line */}
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-gold-dark font-semibold block">
                  Official WhatsApp:
                </span>
                <a
                  href={buildWhatsAppLink(settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/40 hover:bg-[#25D366]/20 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-[#25D366] fill-[#25D366]" />
                    <span className="font-bold text-forest text-sm">
                      +91 {settings.whatsappNumber}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#25D366] underline">
                    Open Chat
                  </span>
                </a>
              </div>

              {/* Email & Website */}
              <div className="space-y-2 pt-2 border-t border-ivory-dark text-xs sm:text-sm">
                <div className="flex items-center gap-3 text-forest/80">
                  <Mail className="w-4 h-4 text-gold shrink-0" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-gold transition-colors font-medium break-all"
                  >
                    {settings.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-forest/80">
                  <Globe className="w-4 h-4 text-gold shrink-0" />
                  <a
                    href={settings.websiteUrl}
                    className="hover:text-gold transition-colors font-medium"
                  >
                    {settings.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-forest/80">
                  <Clock className="w-4 h-4 text-gold shrink-0" />
                  <span>
                    Check-in: <strong>{settings.checkInTime}</strong> | Check-out: <strong>{settings.checkOutTime}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct WhatsApp Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-ivory-dark shadow-luxury">
              <div className="mb-6">
                <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold block mb-1">
                  Instant Direct Inquiry
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                  Send Your Stay Enquiry
                </h2>
                <p className="text-xs sm:text-sm text-forest/70 mt-1">
                  Fill in your travel preferences below. This will generate an organized inquiry message and open WhatsApp directly with our resort reservations desk.
                </p>
              </div>

              {/* Interactive Contact Form Component */}
              <ContactForm whatsappNumber={settings.whatsappNumber} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Map & How To Reach */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl overflow-hidden border border-ivory-dark shadow-luxury p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
                Google Maps Location
              </span>
              <h2 className="font-serif text-2xl font-bold text-forest mt-1">
                Find Hill Queen Eco Resort on the Map
              </h2>
              <p className="text-xs text-forest/70">
                Mamudi, near Murguma Dam, Purulia District, West Bengal
              </p>
            </div>
            {settings.googleMapsUrl && (
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-6 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2 self-start"
              >
                <span>Open in Google Maps App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="w-full h-80 sm:h-[420px] rounded-2xl overflow-hidden border border-ivory-dark relative bg-forest-dark">
            <iframe
              title="Hill Queen Eco Resort Murguma Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14639.467828776826!2d86.05581977934273!3d23.338720173678077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f60b86a344d567%3A0xe989cbf446d337f7!2sMuruguma%20Dam!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
