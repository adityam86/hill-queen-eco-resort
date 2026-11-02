import React from 'react';
import { notFound } from 'next/navigation';
import { getAdminSession, getCurrentAdmin, getGatekeeperPass } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';

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
      {/* Responsive Admin Navigation (Top Bar on Mobile, Sticky Left Sidebar on Desktop) */}
      {session && (
        <AdminSidebar
          session={{ username: session.username, role: session.role }}
          adminName={admin?.name || session.username}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
    </div>
  );
}
