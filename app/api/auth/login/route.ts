import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  verifyPassword,
  createSessionToken,
  setAdminSessionCookie,
  checkRateLimit,
  resetRateLimit,
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Username/Email and password are required.' },
        { status: 400 }
      );
    }

    const trimmedIdentifier = identifier.trim().toLowerCase();

    // 1. Check rate limit (max 5 failed attempts in 15 minutes)
    const rateLimit = checkRateLimit(trimmedIdentifier, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again after ${rateLimit.retryAfterSec} seconds.`,
        },
        { status: 429 }
      );
    }

    // 2. Lookup AdminUser
    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: trimmedIdentifier },
          { email: trimmedIdentifier },
        ],
      },
    });

    if (!admin) {
      return NextResponse.json(
        {
          error: 'Invalid credentials. Please verify your login details.',
          remainingAttempts: rateLimit.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Check account active status
    if (admin.isActive === false) {
      return NextResponse.json(
        {
          error: 'This account has been deactivated. Please contact the resort owner.',
        },
        { status: 403 }
      );
    }

    // 3. Verify password hash
    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        {
          error: 'Invalid credentials. Please verify your login details.',
          remainingAttempts: rateLimit.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 4. Successful login: reset rate limit & issue secure session token
    resetRateLimit(trimmedIdentifier);

    const token = await createSessionToken({
      userId: admin.id,
      username: admin.username,
      email: admin.email,
      role: (admin.role === 'OWNER_ADMIN' ? 'OWNER_ADMIN' : 'STAFF'),
    });

    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred during authentication.' },
      { status: 500 }
    );
  }
}
