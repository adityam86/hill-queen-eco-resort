import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { getResortSettings } from '@/lib/settings';

export async function GET() {
  try {
    const settings = await getResortSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve website settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (session.role !== 'OWNER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only the resort owner (OWNER_ADMIN) can modify global website settings.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const existing = await prisma.websiteSettings.findFirst();

    let settings;
    if (existing) {
      settings = await prisma.websiteSettings.update({
        where: { id: existing.id },
        data: {
          resortName: body.resortName !== undefined ? body.resortName : undefined,
          tagline: body.tagline !== undefined ? body.tagline : undefined,
          address: body.address !== undefined ? body.address : undefined,
          phonePrimary: body.phonePrimary !== undefined ? body.phonePrimary : undefined,
          phoneSecondary: body.phoneSecondary !== undefined ? body.phoneSecondary : undefined,
          phoneTertiary: body.phoneTertiary !== undefined ? body.phoneTertiary : undefined,
          whatsappNumber: body.whatsappNumber !== undefined ? body.whatsappNumber : undefined,
          email: body.email !== undefined ? body.email : undefined,
          websiteUrl: body.websiteUrl !== undefined ? body.websiteUrl : undefined,
          googleMapsUrl: body.googleMapsUrl !== undefined ? body.googleMapsUrl : undefined,
          checkInTime: body.checkInTime !== undefined ? body.checkInTime : undefined,
          checkOutTime: body.checkOutTime !== undefined ? body.checkOutTime : undefined,
          heroHeading: body.heroHeading !== undefined ? body.heroHeading : undefined,
          heroSubheading: body.heroSubheading !== undefined ? body.heroSubheading : undefined,
          aboutText: body.aboutText !== undefined ? body.aboutText : undefined,
          seoTitle: body.seoTitle !== undefined ? body.seoTitle : undefined,
          seoDescription: body.seoDescription !== undefined ? body.seoDescription : undefined,
        },
      });
    } else {
      settings = await prisma.websiteSettings.create({
        data: body,
      });
    }

    // Revalidate all pages
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Failed to update website settings:', error);
    return NextResponse.json(
      { error: 'Failed to update website settings' },
      { status: 500 }
    );
  }
}
