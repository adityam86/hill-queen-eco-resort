import React from 'react';
import Link from 'next/link';
import {
  BedDouble,
  Image as ImageIcon,
  Phone,
  MessageSquare,
  PlusCircle,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Server,
  AlertTriangle,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getResortSettings } from '@/lib/settings';
import { getCurrentAdmin, getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const settings = await getResortSettings();
  const currentAdmin = await getCurrentAdmin();

  let totalRooms = 0;
  let activeRooms = 0;
  let inactiveRooms = 0;
  let totalGallery = 0;

  try {
    totalRooms = await prisma.room.count();
    activeRooms = await prisma.room.count({ where: { isActive: true } });
    inactiveRooms = await prisma.room.count({ where: { isActive: false } });
    totalGallery = await prisma.galleryImage.count();
  } catch (error) {
    console.warn('Dashboard DB query error:', error);
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* 1. Header with Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ivory-dark">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold block mb-1">
            Resort Management System
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
            Welcome, {currentAdmin?.name || 'Administrator'}
          </h1>
          <p className="text-xs sm:text-sm text-forest/70 mt-1">
            Hill Queen Eco Resort • Mamudi, Murguma, Purulia
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/rooms/new"
            className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4 fill-forest text-forest" />
            <span>Add New Room</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-forest/20 text-forest hover:bg-forest hover:text-ivory text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <span>Live Site</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Rooms */}
        <div className="bg-white p-6 rounded-2xl border border-ivory-dark shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-forest/60 font-semibold">
              Total Categories
            </span>
            <div className="p-2.5 rounded-xl bg-ivory text-gold">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-forest">{totalRooms}</p>
          <p className="text-[11px] text-forest/60 mt-1">Managed room categories</p>
        </div>

        {/* Active Rooms */}
        <div className="bg-white p-6 rounded-2xl border border-ivory-dark shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-green-700 font-semibold">
              Active on Website
            </span>
            <div className="p-2.5 rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-green-700">{activeRooms}</p>
          <p className="text-[11px] text-forest/60 mt-1">Visible with tariffs to guests</p>
        </div>

        {/* Inactive Rooms */}
        <div className="bg-white p-6 rounded-2xl border border-ivory-dark shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-amber-700 font-semibold">
              Inactive / Paused
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-amber-800">{inactiveRooms}</p>
          <p className="text-[11px] text-forest/60 mt-1">Hidden from public listing</p>
        </div>

        {/* Total Gallery Photos */}
        <div className="bg-white p-6 rounded-2xl border border-ivory-dark shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-forest/60 font-semibold">
              Gallery Photos
            </span>
            <div className="p-2.5 rounded-xl bg-ivory text-gold">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-forest">{totalGallery}</p>
          <p className="text-[11px] text-forest/60 mt-1">Photos across all categories</p>
        </div>
      </div>

      {/* 3. Quick Actions & Verified Contact Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-ivory-dark shadow-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-forest border-b border-ivory-dark pb-3">
            Quick Actions & Management
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/rooms"
              className="p-4 rounded-2xl bg-ivory/50 border border-ivory-dark hover:border-gold hover:bg-white transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-xl bg-forest text-gold group-hover:scale-105 transition-transform">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm text-forest font-semibold mb-0.5">
                  Manage Rooms & Tariffs
                </strong>
                <p className="text-xs text-forest/70">
                  Update nightly prices, change occupancy, toggle availability.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/gallery"
              className="p-4 rounded-2xl bg-ivory/50 border border-ivory-dark hover:border-gold hover:bg-white transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-xl bg-forest text-gold group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm text-forest font-semibold mb-0.5">
                  Update Photo Gallery
                </strong>
                <p className="text-xs text-forest/70">
                  Upload genuine property photos, categorize and reorder.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="p-4 rounded-2xl bg-ivory/50 border border-ivory-dark hover:border-gold hover:bg-white transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-xl bg-forest text-gold group-hover:scale-105 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm text-forest font-semibold mb-0.5">
                  Website Settings
                </strong>
                <p className="text-xs text-forest/70">
                  Modify phone numbers, WhatsApp, Google Maps, and SEO tags.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/password"
              className="p-4 rounded-2xl bg-ivory/50 border border-ivory-dark hover:border-gold hover:bg-white transition-all flex items-start gap-3 group"
            >
              <div className="p-2 rounded-xl bg-forest text-gold group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm text-forest font-semibold mb-0.5">
                  Security & Password
                </strong>
                <p className="text-xs text-forest/70">
                  Change admin login password and review credentials.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Current Contact Details Snapshot */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-ivory-dark shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-dark pb-3">
            <h2 className="font-serif text-xl font-bold text-forest">
              Active Contact Numbers
            </h2>
            <Link
              href="/admin/settings"
              className="text-xs text-gold-dark hover:underline font-medium"
            >
              Edit
            </Link>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-ivory/60 border border-ivory-dark">
              <span className="text-forest/70">Primary Phone:</span>
              <strong className="text-forest font-semibold">
                +91 {settings.phonePrimary}
              </strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-ivory/60 border border-ivory-dark">
              <span className="text-forest/70">Secondary Phone:</span>
              <strong className="text-forest font-semibold">
                +91 {settings.phoneSecondary || 'Not set'}
              </strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-ivory/60 border border-ivory-dark">
              <span className="text-forest/70">Third Phone:</span>
              <strong className="text-forest font-semibold">
                +91 {settings.phoneTertiary || 'Not set'}
              </strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30">
              <span className="text-forest/70">WhatsApp Inquiries:</span>
              <strong className="text-forest font-semibold">
                +91 {settings.whatsappNumber}
              </strong>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-ivory/60 border border-ivory-dark">
              <span className="text-forest/70">Email:</span>
              <strong className="text-forest font-semibold truncate max-w-[180px]">
                {settings.email}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Hosting & Deployment Environment Card */}
      <div className="bg-forest-dark text-ivory rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-luxury">
        <div className="flex items-center gap-3 mb-4">
          <Server className="w-6 h-6 text-gold" />
          <h2 className="font-serif text-xl font-bold text-ivory">
            Hosting & Environment Status
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-ivory/80">
          <div className="p-4 rounded-xl bg-forest/80 border border-gold/20">
            <span className="text-gold font-semibold block mb-1">Target Hosting</span>
            <p>GoDaddy cPanel (Node.js 22 Compatible)</p>
            <p className="text-[11px] text-ivory/60 mt-1">
              Supports standalone deployment, Passenger, or persistent PM2 runner.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-forest/80 border border-gold/20">
            <span className="text-gold font-semibold block mb-1">Database Adaptability</span>
            <p>Configurable Prisma Architecture</p>
            <p className="text-[11px] text-ivory/60 mt-1">
              Currently running SQLite locally; switchable with one command to MySQL or PostgreSQL.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-forest/80 border border-gold/20">
            <span className="text-gold font-semibold block mb-1">Data Independence</span>
            <p>Zero Static Hardcoding</p>
            <p className="text-[11px] text-ivory/60 mt-1">
              All prices, descriptions, and photographs persist directly in database tables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
