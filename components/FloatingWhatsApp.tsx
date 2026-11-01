'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageSquare, X } from 'lucide-react';
import { buildWhatsAppLink } from '@/lib/settings';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
}

export default function FloatingWhatsApp({
  whatsappNumber = '9735888106',
}: FloatingWhatsAppProps) {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(true);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/portal-gate')) {
    return null;
  }

  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-20 sm:bottom-8 right-5 z-40 flex items-end gap-3 group">
      {/* Friendly Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-forest-dark text-ivory text-xs px-3.5 py-2 rounded-xl shadow-luxury-lg border border-gold/30 animate-bounce transition-all">
          <span className="font-medium">Have questions? Chat on WhatsApp!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-ivory/50 hover:text-ivory"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={buildWhatsAppLink(whatsappNumber)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Hill Queen Eco Resort on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-luxury-lg hover:scale-110 active:scale-95 transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(37,211,102,0.6)]"
      >
        {/* Subtle Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" />
        <MessageSquare className="w-7 h-7 fill-white text-white relative z-10" />
      </a>
    </aside>
  );
}
