'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MessageSquare, Mountain } from 'lucide-react';
import { buildTelLink, buildWhatsAppLink } from '@/lib/settings';

interface NavbarProps {
  phone?: string;
  whatsapp?: string;
  resortName?: string;
}

export default function Navbar({
  phone = '9735888106',
  whatsapp = '9735888106',
  resortName = 'Hill Queen Eco Resort',
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Do not render public consumer navigation in admin panel or portal gate
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/portal-gate')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Rooms & Pricing', href: '/rooms' },
    { name: 'Sightseeing', href: '/attractions' },
    { name: 'Photo Gallery', href: '/gallery' },
    { name: 'Contact & Map', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const isHome = pathname === '/';

  return (
    <>
      {/* Locked / Fixed Navigation Container */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
        {/* Top verified contact banner */}
        <div
          className={`bg-forest-dark text-ivory/80 text-xs px-4 border-b border-gold/15 hidden md:block transition-all duration-300 ${
            scrolled
              ? 'max-h-0 py-0 opacity-0 border-transparent overflow-hidden'
              : 'max-h-12 py-1.5 opacity-100'
          }`}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-gold" />
                Mamudi, Murguma, Purulia, West Bengal 723152
              </span>
              <span className="text-ivory/40">|</span>
              <span>Direct Resort Bookings & Inquiries</span>
            </div>
            <div className="flex items-center gap-6">
              <a
                href={buildTelLink(phone)}
                className="hover:text-gold transition-colors flex items-center gap-1 font-medium"
              >
                <Phone className="w-3 h-3 text-gold" /> Call: +91 {phone}
              </a>
              <a
                href={buildWhatsAppLink(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors flex items-center gap-1 font-medium"
              >
                <MessageSquare className="w-3 h-3 text-gold" /> WhatsApp Inquiry
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation with Luxury Glass */}
        <header
          className={`w-full glass-nav transition-all duration-300 ${
            scrolled ? 'shadow-luxury py-2.5 sm:py-3' : 'py-3.5 sm:py-4 shadow-md'
          }`}
        >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold/40 bg-forest flex items-center justify-center text-gold group-hover:scale-105 transition-transform shadow-inner">
                <Mountain className="w-5 h-5 text-gold" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-ivory group-hover:text-gold transition-colors">
                  HILL QUEEN
                </span>
                <span className="text-[10px] sm:text-xs tracking-[0.25em] text-gold uppercase font-medium">
                  Eco Resort • Murguma
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm tracking-wide font-medium transition-all duration-200 relative py-1 ${
                      active
                        ? 'text-gold font-semibold'
                        : 'text-ivory/90 hover:text-gold'
                    }`}
                  >
                    {link.name}
                    {active && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions (Desktop) */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={buildTelLink(phone)}
                className="px-4 py-2 rounded-full border border-gold/40 text-ivory text-xs font-medium hover:border-gold hover:text-gold transition-all flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span className="hidden xl:inline">Call:</span> {phone}
              </a>
              <a
                href={buildWhatsAppLink(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 tracking-wide"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-forest text-forest" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href={buildTelLink(phone)}
                className="p-2 rounded-full text-gold border border-gold/30 hover:bg-gold/10"
                aria-label="Call Resort"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-ivory hover:text-gold focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden bg-forest-dark border-t border-gold/20 px-4 pt-3 pb-6 animate-fadeIn">
            <div className="flex flex-col space-y-3 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-olive text-gold'
                      : 'text-ivory hover:bg-forest hover:text-gold'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-gold/20 flex flex-col gap-2.5">
                <a
                  href={buildWhatsAppLink(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold text-center py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-forest text-forest" />
                  Chat & Inquire on WhatsApp
                </a>
                <a
                  href={buildTelLink(phone)}
                  className="w-full text-center py-2.5 rounded-lg border border-gold/40 text-ivory text-sm font-medium hover:border-gold hover:text-gold flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-gold" />
                  Call Directly: +91 {phone}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>

    {/* Spacer on non-home pages so content is not obscured by the fixed navbar */}
    {!isHome && (
      <div className="h-20 sm:h-24 w-full shrink-0" aria-hidden="true" />
    )}
  </>
);
}
