import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';

    const attractions = await prisma.attraction.findMany({
      where: all ? undefined : { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ success: true, attractions });
  } catch (error: any) {
    console.error('Failed to fetch attractions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attractions' },
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

    const body = await req.json();
    const {
      name,
      title,
      slug,
      description,
      category,
      distanceKm,
      drivingTimeMin,
      imageUrl,
      imageAlt,
      directionsUrl,
      bestTimeToVisit,
      highlights,
      travelTip,
      displayOrder,
      isActive,
    } = body;

    if (!name || !description || !category || distanceKm === undefined || drivingTimeMin === undefined) {
      return NextResponse.json(
        { error: 'Name, description, category, distance, and driving time are required.' },
        { status: 400 }
      );
    }

    const calculatedSlug =
      slug?.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const attraction = await prisma.attraction.create({
      data: {
        name: name.trim(),
        title: title?.trim() || name.trim(),
        slug: calculatedSlug,
        description: description.trim(),
        category: category.trim(),
        distanceKm: parseFloat(distanceKm) || 0,
        drivingTimeMin: parseInt(drivingTimeMin, 10) || 0,
        imageUrl: imageUrl?.trim() || '/images/attractions/murguma-dam.jpg',
        imageAlt: imageAlt?.trim() || name.trim(),
        directionsUrl:
          directionsUrl?.trim() ||
          `https://www.google.com/maps/dir/?api=1&origin=Hill+Queen+Eco+Resort,+Mamudi,+Murguma,+West+Bengal+723152&destination=${encodeURIComponent(
            name.trim() + ', Purulia, West Bengal'
          )}`,
        bestTimeToVisit: bestTimeToVisit?.trim() || null,
        highlights: highlights ? (typeof highlights === 'string' ? highlights : JSON.stringify(highlights)) : null,
        travelTip: travelTip?.trim() || null,
        displayOrder: parseInt(displayOrder, 10) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    revalidatePath('/attractions');
    revalidatePath('/');
    revalidatePath('/admin/attractions');

    return NextResponse.json({ success: true, attraction });
  } catch (error: any) {
    console.error('Failed to create attraction:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create attraction' },
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

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Attraction ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.slug !== undefined) updateData.slug = data.slug.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.category !== undefined) updateData.category = data.category.trim();
    if (data.distanceKm !== undefined) updateData.distanceKm = parseFloat(data.distanceKm);
    if (data.drivingTimeMin !== undefined) updateData.drivingTimeMin = parseInt(data.drivingTimeMin, 10);
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl.trim();
    if (data.imageAlt !== undefined) updateData.imageAlt = data.imageAlt ? data.imageAlt.trim() : null;
    if (data.directionsUrl !== undefined) updateData.directionsUrl = data.directionsUrl.trim();
    if (data.bestTimeToVisit !== undefined)
      updateData.bestTimeToVisit = data.bestTimeToVisit ? data.bestTimeToVisit.trim() : null;
    if (data.highlights !== undefined) {
      updateData.highlights =
        typeof data.highlights === 'string' ? data.highlights : JSON.stringify(data.highlights);
    }
    if (data.travelTip !== undefined) updateData.travelTip = data.travelTip ? data.travelTip.trim() : null;
    if (data.displayOrder !== undefined) updateData.displayOrder = parseInt(data.displayOrder, 10);
    if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);

    const updated = await prisma.attraction.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/attractions');
    revalidatePath('/');
    revalidatePath('/admin/attractions');

    return NextResponse.json({ success: true, attraction: updated });
  } catch (error: any) {
    console.error('Failed to update attraction:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update attraction' },
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
      return NextResponse.json({ error: 'Attraction ID is required' }, { status: 400 });
    }

    await prisma.attraction.delete({
      where: { id },
    });

    revalidatePath('/attractions');
    revalidatePath('/');
    revalidatePath('/admin/attractions');

    return NextResponse.json({
      success: true,
      message: 'Attraction deleted successfully',
    });
  } catch (error: any) {
    console.error('Failed to delete attraction:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete attraction' },
      { status: 500 }
    );
  }
}

