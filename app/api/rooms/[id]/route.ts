import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, room });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve room details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
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

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { error: 'Valid positive price per night in INR is required.' },
        { status: 400 }
      );
    }

    const updatedRoom = await prisma.room.update({
      where: { id: params.id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        price: numericPrice,
        maximumOccupancy: maximumOccupancy !== undefined ? parseInt(maximumOccupancy, 10) : undefined,
        bedConfiguration: bedConfiguration !== undefined ? bedConfiguration : undefined,
        roomType: roomType !== undefined ? roomType : undefined,
        isAc: isAc !== undefined ? Boolean(isAc) : undefined,
        hasAttachedBath: hasAttachedBath !== undefined ? Boolean(hasAttachedBath) : undefined,
        extraBedAvailable: extraBedAvailable !== undefined ? Boolean(extraBedAvailable) : undefined,
        foodInclusion: foodInclusion !== undefined ? foodInclusion : undefined,
        amenities: Array.isArray(amenities) ? amenities.join(', ') : amenities,
        mainImage: mainImage !== undefined ? mainImage : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : undefined,
      },
    });

    // Update images if provided
    if (Array.isArray(images)) {
      // Remove old additional images and recreate
      await prisma.roomImage.deleteMany({
        where: { roomId: params.id },
      });

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img?.imageUrl) {
          await prisma.roomImage.create({
            data: {
              roomId: params.id,
              imageUrl: img.imageUrl,
              caption: img.caption || null,
              displayOrder: i + 1,
            },
          });
        }
      }
    }

    // Dynamic Next.js page revalidation
    revalidatePath('/');
    revalidatePath('/rooms');
    revalidatePath(`/rooms/${updatedRoom.slug}`);

    return NextResponse.json({ success: true, room: updatedRoom });
  } catch (error: any) {
    console.error('Failed to update room:', error);
    return NextResponse.json(
      { error: 'Failed to update room category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (session.role !== 'OWNER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only the resort owner (OWNER_ADMIN) can delete room records.' },
        { status: 403 }
      );
    }

    const room = await prisma.room.findUnique({
      where: { id: params.id },
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    await prisma.room.delete({
      where: { id: params.id },
    });

    revalidatePath('/');
    revalidatePath('/rooms');
    revalidatePath(`/rooms/${room.slug}`);

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error: any) {
    console.error('Failed to delete room:', error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
}
