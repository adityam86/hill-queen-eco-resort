import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const photos = await prisma.galleryImage.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json({ success: true, photos });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
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

    const { imageUrl, caption, category, displayOrder } = await req.json();

    if (!imageUrl || !category) {
      return NextResponse.json(
        { error: 'Image URL and Category are required.' },
        { status: 400 }
      );
    }

    const photo = await prisma.galleryImage.create({
      data: {
        imageUrl: imageUrl.trim(),
        caption: caption ? caption.trim() : null,
        category: category.trim(),
        displayOrder: parseInt(displayOrder, 10) || 0,
      },
    });

    revalidatePath('/gallery');
    revalidatePath('/');

    return NextResponse.json({ success: true, photo });
  } catch (error: any) {
    console.error('Failed to add gallery photo:', error);
    return NextResponse.json(
      { error: 'Failed to add gallery photo' },
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

    const { id, imageUrl, caption, category, displayOrder } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }

    const updated = await prisma.galleryImage.update({
      where: { id },
      data: {
        imageUrl: imageUrl !== undefined ? imageUrl.trim() : undefined,
        caption: caption !== undefined ? (caption ? caption.trim() : null) : undefined,
        category: category !== undefined ? category.trim() : undefined,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : undefined,
      },
    });

    revalidatePath('/gallery');
    revalidatePath('/');

    return NextResponse.json({ success: true, photo: updated });
  } catch (error: any) {
    console.error('Failed to update gallery photo:', error);
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }

    await prisma.galleryImage.delete({
      where: { id },
    });

    revalidatePath('/gallery');
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error: any) {
    console.error('Failed to delete photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
