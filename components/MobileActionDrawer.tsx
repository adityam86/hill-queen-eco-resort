'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, BedDouble } from 'lucide-react';
import { buildTelLink, buildWhatsAppLink } from '@/lib/settings';

interface MobileActionDrawerProps {
  phone?: string;
  whatsapp?: string;
}

export default function MobileActionDrawer({
  phone = '9735888106',
  whatsapp = '9735888106',
}: MobileActionDrawerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-forest-dark/95 backdrop-blur-md border-t border-gold/30 px-3 py-2 sm:hidden shadow-[0_-10px_25px_rgba(0,0,0,0.3)]">
      <div className="grid grid-cols-3 gap-2">
        {/* Call Now */}
        <a
          href={buildTelLink(phone)}
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-forest border border-gold/30 text-ivory text-[11px] font-medium active:bg-olive"
        >
          <Phone className="w-4 h-4 text-gold mb-0.5" />
          <span>Call Resort</span>
        </a>

        {/* WhatsApp Enquiry */}
        <a
          href={buildWhatsAppLink(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-[#25D366] text-white text-[11px] font-semibold active:opacity-90 shadow-md"
        >
          <MessageSquare className="w-4 h-4 fill-white text-white mb-0.5" />
          <span>WhatsApp</span>
        </a>

        {/* View Rooms */}
        <Link
          href="/rooms"
          className="flex flex-col items-center justify-center py-1.5 px-2 rounded-lg bg-gold text-forest text-[11px] font-semibold active:opacity-90"
        >
          <BedDouble className="w-4 h-4 text-forest mb-0.5" />
          <span>View Rooms</span>
        </Link>
      </div>
    </div>
  );
}
