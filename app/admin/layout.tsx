import React from 'react';
import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import {
  Mountain,
  LayoutDashboard,
  BedDouble,
  PlusCircle,
  Image as ImageIcon,
  Settings,
  KeyRound,
  LogOut,
  ExternalLink,
  Shield,
  Users,
} from 'lucide-react';
import { getAdminSession, getCurrentAdmin, getGatekeeperPass } from '@/lib/auth';
import AdminLogoutButton from '@/components/AdminLogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const gatekeeper = await getGatekeeperPass();

  // Stealth Cloak: If visitor does NOT have an active admin session and does NOT have a valid gatekeeper pass,
  // return 404 (Not Found) so the admin path appears completely non-existent to bots and unauthorized users.
  if (!session && !gatekeeper) {
    notFound();
  }

  const admin = await getCurrentAdmin();

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-forest flex flex-col md:flex-row">
      {/* If logged in, show full Admin Sidebar */}
      {session && (
        <aside className="w-full md:w-64 bg-forest-dark text-ivory flex-shrink-0 flex flex-col border-r border-gold/20">
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
            <span className="text-ivory/70 truncate">
              {admin?.name || session.username}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                session.role === 'OWNER_ADMIN'
                  ? 'bg-gold/20 text-gold border border-gold/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {session.role === 'OWNER_ADMIN' ? 'Owner Admin' : 'Staff'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1.5 text-xs font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-forest text-ivory/80 hover:text-gold transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-gold" />
              <span>Dashboard Overview</span>
            </Link>

            <Link
              href="/admin/rooms"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-forest text-ivory/80 hover:text-gold transition-colors"
            >
              <BedDouble className="w-4 h-4 text-gold" />
              <span>Rooms & Tariffs</span>
            </Link>

            {session.role === 'OWNER_ADMIN' && (
              <Link
                href="/admin/rooms/new"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-forest text-ivory/80 hover:text-gold transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-gold" />
                <span>Add New Room</span>
              </Link>
            )}

            <Link
              href="/admin/gallery"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-forest text-ivory/80 hover:text-gold transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-gold" />
              <span>Photo Gallery</span>
            </Link>

            {session.role === 'OWNER_ADMIN' && (
              <Link
                href="/admin/staff"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-forest text-ivory/80 hover:text-gold transition-colors"
              >
                <Users className="w-4 h-4 text-gold" />
                <span>Staff Management</span>
              </Link>
            )}

            {session.role === 'OWNER_ADMIN' && (
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-forest text-ivory/80 hover:text-gold transition-colors"
              >
                <Settings className="w-4 h-4 text-gold" />
                <span>Website Settings</span>
              </Link>
            )}

            <Link
              href="/admin/password"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-forest text-ivory/80 hover:text-gold transition-colors"
            >
              <KeyRound className="w-4 h-4 text-gold" />
              <span>Change Password</span>
            </Link>

            <div className="pt-4 border-t border-gold/15 space-y-1.5">
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
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
