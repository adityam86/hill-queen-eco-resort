import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'hill-queen-resort-super-secret-jwt-key-change-in-production-2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE || 'hq_admin_session';

export interface AdminSessionPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
}

// In-memory rate limiting map: identifier -> { count, expiresAt }
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): { allowed: boolean; remainingAttempts: number; retryAfterSec?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || entry.expiresAt < now) {
    rateLimitMap.set(identifier, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  if (entry.count >= maxAttempts) {
    const retryAfterSec = Math.ceil((entry.expiresAt - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSec };
  }

  entry.count += 1;
  return { allowed: true, remainingAttempts: maxAttempts - entry.count };
}

export function resetRateLimit(identifier: string) {
  rateLimitMap.delete(identifier);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminSessionPayload;
  } catch (error) {
    return null;
  }
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch (err) {
    return null;
  }
}

export async function getCurrentAdmin() {
  const session = await getAdminSession();
  if (!session?.userId) return null;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}
