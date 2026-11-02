import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { DEFAULT_ROOMS } from '@/lib/rooms';

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

    // Seed or synchronize the 5 official FusionStays room categories
    for (const roomData of DEFAULT_ROOMS) {
      const { images, ...roomFields } = roomData;
      const existing = await prisma.room.findUnique({
        where: { slug: roomFields.slug },
      });
      let roomId = '';
      if (!existing) {
        const created = await prisma.room.create({ data: roomFields });
        roomId = created.id;
      } else {
        roomId = existing.id;
        await prisma.room.update({
          where: { id: existing.id },
          data: {
            name: roomFields.name,
            roomType: roomFields.roomType,
            description: roomFields.description,
            maximumOccupancy: roomFields.maximumOccupancy,
            bedConfiguration: roomFields.bedConfiguration,
            isAc: roomFields.isAc,
            hasAttachedBath: roomFields.hasAttachedBath,
            extraBedAvailable: roomFields.extraBedAvailable,
            foodInclusion: roomFields.foodInclusion,
            amenities: roomFields.amenities,
            mainImage: roomFields.mainImage,
            isActive: true,
            displayOrder: roomFields.displayOrder,
          },
        });
      }

      if (images && images.length > 0) {
        await prisma.roomImage.deleteMany({ where: { roomId } });
        await prisma.roomImage.createMany({
          data: images.map((img) => ({
            roomId,
            imageUrl: img.imageUrl,
            caption: img.caption,
            displayOrder: img.displayOrder,
          })),
        });
      }
    }

    // Clean up old legacy dummy rooms
    await prisma.room.deleteMany({
      where: {
        slug: {
          in: [
            'eco-lake-view-cottage',
            'deluxe-family-cottage',
            'deluxe-hillside-family-cottage',
            'ajodhya-view-double-room',
            'standard-serenity-room',
          ],
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin account, website settings, and 5 room categories successfully initialized in production!',
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

