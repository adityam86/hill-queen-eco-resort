import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key');
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'hq-resort-murguma-2026';

    if (key !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized: Invalid secret key' }, { status: 401 });
    }

    // Inspect available database environment variables
    const currentDbUrl = process.env.DATABASE_URL || '';
    const fallbackDbUrl =
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL ||
      process.env.STORAGE_URL;

    // If current DATABASE_URL is invalid (e.g. SQLite file:./dev.db), replace with fallback
    if (currentDbUrl.startsWith('file:') && fallbackDbUrl) {
      process.env.DATABASE_URL = fallbackDbUrl;
    }

    const envDiagnostics = {
      has_DATABASE_URL: Boolean(process.env.DATABASE_URL),
      DATABASE_URL_starts_with: process.env.DATABASE_URL ? process.env.DATABASE_URL.split(':')[0] : null,
      has_POSTGRES_PRISMA_URL: Boolean(process.env.POSTGRES_PRISMA_URL),
      has_POSTGRES_URL: Boolean(process.env.POSTGRES_URL),
      has_STORAGE_URL: Boolean(process.env.STORAGE_URL),
    };

    if (process.env.DATABASE_URL?.startsWith('file:')) {
      return NextResponse.json({
        error: 'DATABASE_URL is currently set to SQLite file:./dev.db on Vercel. A PostgreSQL connection string (postgresql://...) is required.',
        diagnostics: envDiagnostics,
        solution: 'In Vercel -> Settings -> Environment Variables, replace DATABASE_URL with your PostgreSQL connection string, or delete it so the Vercel Postgres integration can be used.',
      }, { status: 400 });
    }

    const adminEmail = 'admin@hillqueenecoresorts.com';
    let admin = await prisma.adminUser.findFirst({
      where: {
        OR: [{ username: 'admin' }, { email: adminEmail }],
      },
    });

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('AdminPassword@2026', salt);

    if (!admin) {
      admin = await prisma.adminUser.create({
        data: {
          username: 'admin',
          email: adminEmail,
          passwordHash,
          name: 'Resort Administrator',
          role: 'OWNER_ADMIN',
          isActive: true,
        },
      });
    } else {
      admin = await prisma.adminUser.update({
        where: { id: admin.id },
        data: {
          passwordHash,
          role: 'OWNER_ADMIN',
          isActive: true,
        },
      });
    }

    // Seed website settings if missing
    const settings = await prisma.websiteSettings.findFirst();
    if (!settings) {
      await prisma.websiteSettings.create({
        data: {
          resortName: 'Hill Queen Eco Resort',
          tagline: 'Escape Into Nature. Stay Close to Serenity.',
          address: 'Mamudi, Murguma, Purulia, West Bengal 723152, India',
          phonePrimary: '9735888106',
          phoneSecondary: '9733713255',
          phoneTertiary: '8670214030',
          whatsappNumber: '9735888106',
          email: 'hillqueenecoresort@gmail.com',
          websiteUrl: 'https://hillqueenecoresorts.com',
          googleMapsUrl: 'https://share.google/yDmE0tmJM7PhlxVlN',
          checkInTime: '11:00 AM',
          checkOutTime: '10:00 AM',
          heroHeading: 'Discover Your Peaceful Escape.',
          heroSubheading: 'Experience the beauty of nature and a relaxing stay at Hill Queen Eco Resort, Murguma, Purulia.',
          seoTitle: 'Hill Queen Eco Resort | Luxury Nature Resort in Murguma, Purulia',
          seoDescription: 'Experience peaceful luxury at Hill Queen Eco Resort in Mamudi, Murguma, Purulia.',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account and website settings successfully initialized in production!',
      loginUrl: 'https://hill-queen-eco-resort.vercel.app/admin/login',
      credentials: {
        username: 'admin',
        email: adminEmail,
        password: 'AdminPassword@2026',
      },
    });
  } catch (error: any) {
    console.error('Init DB error:', error);
    return NextResponse.json(
      {
        error: 'Database initialization failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

