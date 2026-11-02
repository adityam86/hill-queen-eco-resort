'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Mountain,
  LayoutDashboard,
  BedDouble,
  PlusCircle,
  Image as ImageIcon,
  Settings,
  KeyRound,
  ExternalLink,
  Users,
  Menu,
  X,
} from 'lucide-react';
import AdminLogoutButton from '@/components/AdminLogoutButton';

interface AdminSidebarProps {
  session: {
    username: string;
    role: string;
  };
  adminName: string;
}

export default function AdminSidebar({ session, adminName }: AdminSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isOwner = session.role === 'OWNER_ADMIN';

  const navLinks = [
    { href: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
    { href: '/admin/rooms', label: 'Rooms & Tariffs', icon: BedDouble },
    ...(isOwner ? [{ href: '/admin/rooms/new', label: 'Add New Room', icon: PlusCircle }] : []),
    { href: '/admin/gallery', label: 'Photo Gallery', icon: ImageIcon },
    ...(isOwner
      ? [
          { href: '/admin/staff', label: 'Staff Management', icon: Users },
          { href: '/admin/settings', label: 'Website Settings', icon: Settings },
        ]
      : []),
    { href: '/admin/password', label: 'Change Password', icon: KeyRound },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Header (Visible only on screens below md) */}
      <div className="md:hidden bg-forest-dark text-ivory border-b border-gold/20 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest border border-gold/40 flex items-center justify-center text-gold">
              <Mountain className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-xs font-bold text-ivory block leading-tight">
                HILL QUEEN
              </span>
              <span className="text-[9px] text-gold uppercase tracking-widest font-semibold block">
                Owner Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                isOwner
                  ? 'bg-gold/20 text-gold border border-gold/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {isOwner ? 'Owner' : 'Staff'}
            </span>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-forest text-gold border border-gold/30 hover:bg-forest/80 focus:outline-none"
              aria-label="Toggle admin navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="px-4 pb-4 pt-2 border-t border-gold/15 bg-forest-dark space-y-1 animate-fadeIn shadow-2xl">
            <div className="px-3 py-1.5 mb-2 rounded-lg bg-forest/40 text-[11px] text-ivory/60 flex items-center justify-between">
              <span>Signed in as: <strong className="text-ivory font-medium">{adminName}</strong></span>
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    active
                      ? 'bg-forest text-gold font-bold border border-gold/30'
                      : 'text-ivory/80 hover:bg-forest hover:text-gold'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-gold' : 'text-gold/70'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 border-t border-gold/15 space-y-1">
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-ivory/70 hover:text-gold hover:bg-forest"
              >
                <ExternalLink className="w-4 h-4 text-gold" />
                <span>View Public Website</span>
              </Link>
              <div className="pt-1">
                <AdminLogoutButton />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar (Visible on md and above) */}
      <aside className="hidden md:flex w-64 bg-forest-dark text-ivory flex-shrink-0 flex-col border-r border-gold/20 min-h-screen sticky top-0">
        {/* Admin Header */}
        <div className="p-6 border-b border-gold/15">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-forest border border-gold/40 flex items-center justify-center text-gold">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-sm font-bold text-ivory tracking-wide">
                HILL QUEEN
              </h1>
              <p className="text-[10px] text-gold uppercase tracking-widest font-semibold">
                Owner Portal
              </p>
            </div>
          </Link>
        </div>

        {/* User badge */}
        <div className="px-6 py-3 bg-forest/40 border-b border-gold/10 flex items-center justify-between text-xs">
          <span className="text-ivory/70 truncate">{adminName}</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
              isOwner
                ? 'bg-gold/20 text-gold border border-gold/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {isOwner ? 'Owner Admin' : 'Staff'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5 text-xs font-medium overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  active
                    ? 'bg-forest text-gold font-bold border border-gold/30'
                    : 'text-ivory/80 hover:bg-forest hover:text-gold'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-gold' : 'text-gold/70'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-gold/15 space-y-1.5 mt-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-forest text-ivory/70 hover:text-gold transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-gold" />
                <span>View Public Website</span>
              </div>
            </Link>

            <AdminLogoutButton />
          </div>
        </nav>
      </aside>
    </>
  );
}
