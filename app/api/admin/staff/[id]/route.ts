import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession, hashPassword } from '@/lib/auth';

// PUT /api/admin/staff/[id] - Update or deactivate staff account (OWNER_ADMIN only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'OWNER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only the resort owner can edit staff accounts.' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const { name, email, isActive, password, role } = body;

    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Owner cannot deactivate their own account
    if (existing.id === session.userId && isActive === false) {
      return NextResponse.json(
        { error: 'Cannot deactivate your own owner account.' },
        { status: 400 }
      );
    }

    let passwordHash: string | undefined = undefined;
    if (password && password.trim().length >= 8) {
      passwordHash = await hashPassword(password.trim());
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data: {
        name: name !== undefined ? (name ? name.trim() : null) : undefined,
        email: email !== undefined ? email.trim().toLowerCase() : undefined,
        isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        role: role !== undefined ? (role === 'OWNER_ADMIN' ? 'OWNER_ADMIN' : 'STAFF') : undefined,
        passwordHash: passwordHash || undefined,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, account: updated });
  } catch (error: any) {
    console.error('Failed to update staff account:', error);
    return NextResponse.json({ error: 'Failed to update account.' }, { status: 500 });
  }
}

// DELETE /api/admin/staff/[id] - Delete a staff account (OWNER_ADMIN only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'OWNER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only the resort owner can delete staff accounts.' },
        { status: 403 }
      );
    }

    const { id } = params;

    // Owner cannot delete themselves
    if (id === session.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own active owner account.' },
        { status: 400 }
      );
    }

    await prisma.adminUser.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Account deleted successfully.' });
  } catch (error: any) {
    console.error('Failed to delete staff account:', error);
    return NextResponse.json({ error: 'Failed to delete account.' }, { status: 500 });
  }
}

