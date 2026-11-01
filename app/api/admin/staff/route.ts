import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession, hashPassword } from '@/lib/auth';

// GET /api/admin/staff - List all staff accounts (OWNER_ADMIN only)
export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'OWNER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only the resort owner can view staff accounts.' },
        { status: 403 }
      );
    }

    const accounts = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, accounts });
  } catch (error: any) {
    console.error('Failed to list staff accounts:', error);
    return NextResponse.json({ error: 'Failed to retrieve accounts.' }, { status: 500 });
  }
}

// POST /api/admin/staff - Create a new staff account (OWNER_ADMIN only)
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.role !== 'OWNER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only the resort owner can create staff accounts.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { username, email, password, name, role = 'STAFF' } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate username/email
    const existing = await prisma.adminUser.findFirst({
      where: {
        OR: [{ username: cleanUsername }, { email: cleanEmail }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with that username or email already exists.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const assignedRole = role === 'OWNER_ADMIN' ? 'OWNER_ADMIN' : 'STAFF';

    const newAccount = await prisma.adminUser.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        passwordHash,
        name: name ? name.trim() : null,
        role: assignedRole,
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, account: newAccount }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create staff account:', error);
    return NextResponse.json({ error: 'Failed to create staff account.' }, { status: 500 });
  }
}

