import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, rooms });
  } catch (error: any) {
    console.error('Failed to query rooms:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve room listings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (session.role !== 'OWNER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only the resort owner (OWNER_ADMIN) can create new room categories.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      maximumOccupancy,
      bedConfiguration,
      roomType,
      isAc,
      hasAttachedBath,
      extraBedAvailable,
      foodInclusion,
      amenities,
      mainImage,
      isActive,
      displayOrder,
      images,
    } = body;

    if (!name || price === undefined || !description) {
      return NextResponse.json(
        { error: 'Room name, price, and description are required.' },
        { status: 400 }
      );
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { error: 'Valid positive price per night in INR is required.' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = slugify(name);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.room.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const room = await prisma.room.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description.trim(),
        price: numericPrice,
        maximumOccupancy: parseInt(maximumOccupancy, 10) || 2,
        bedConfiguration: bedConfiguration || '1 King Bed',
        roomType: roomType || 'Cottage',
        isAc: Boolean(isAc),
        hasAttachedBath: hasAttachedBath !== undefined ? Boolean(hasAttachedBath) : true,
        extraBedAvailable: Boolean(extraBedAvailable),
        foodInclusion: foodInclusion || 'Complimentary morning tea; dining available on order',
        amenities: Array.isArray(amenities) ? amenities.join(', ') : amenities || '',
        mainImage: mainImage || 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=1200',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        displayOrder: parseInt(displayOrder, 10) || 0,
      },
    });

    // Create additional images if provided
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img?.imageUrl) {
          await prisma.roomImage.create({
            data: {
              roomId: room.id,
              imageUrl: img.imageUrl,
              caption: img.caption || null,
              displayOrder: i + 1,
            },
          });
        }
      }
    }

    // Revalidate public pages so changes appear immediately
    revalidatePath('/');
    revalidatePath('/rooms');

    return NextResponse.json({ success: true, room });
  } catch (error: any) {
    console.error('Failed to create room:', error);
    return NextResponse.json(
      { error: 'Failed to create room category' },
      { status: 500 }
    );
  }
}
