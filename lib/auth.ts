import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from './prisma';

export type UserRole = 'OWNER_ADMIN' | 'STAFF';

export interface AdminSessionPayload {
  userId: string;
  username: string;
  email: string;
  role: UserRole;
}

// 1. Secure Secret Resolution (No hardcoded fallback in production)
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length === 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable is required in production.');
    }
    // Safe dev fallback only
    return new TextEncoder().encode('hq-resort-local-development-secret-key-32chars');
  }
  if (secret.length < 32 && process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL SECURITY ERROR: JWT_SECRET must be at least 32 characters in production.');
  }
  return new TextEncoder().encode(secret);
}

export function getAdminSecretKey(): string {
  const key = process.env.ADMIN_SECRET_KEY;
  if (!key || key.trim().length === 0) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL SECURITY ERROR: ADMIN_SECRET_KEY environment variable is required in production.');
    }
    return 'hq-resort-murguma-2026';
  }
  return key;
}

const COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE || 'hq_admin_session';
const GATEKEEPER_COOKIE_NAME = process.env.GATEKEEPER_COOKIE_NAME || 'hq_gatekeeper_pass';

// 2. In-Memory Rate Limiting
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remainingAttempts: number; retryAfterSec?: number } {
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

// 3. Gatekeeper Token Verification
export function verifySecretKey(inputKey: string): boolean {
  if (!inputKey) return false;
  return inputKey.trim() === getAdminSecretKey().trim();
}

export async function createGatekeeperToken(): Promise<string> {
  return new SignJWT({ gatekeeper: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(getJwtSecret());
}

export async function verifyGatekeeperToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return Boolean(payload?.gatekeeper);
  } catch {
    return false;
  }
}

export async function setGatekeeperCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(GATEKEEPER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 2, // 2 hours
    path: '/',
  });
}

export async function clearGatekeeperCookie() {
  const cookieStore = cookies();
  cookieStore.set(GATEKEEPER_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

export async function getGatekeeperPass(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(GATEKEEPER_COOKIE_NAME)?.value;
    if (!token) return false;
    return await verifyGatekeeperToken(token);
  } catch {
    return false;
  }
}

// 4. Password Security
export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 5. Session Tokens & Cookies
export async function createSessionToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  await clearGatekeeperCookie();
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
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
        isActive: true,
        createdAt: true,
      },
    });

    // If account was deleted or deactivated, revoke session immediately
    if (!user || user.isActive === false) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

// 6. Role-Based Access Control (RBAC) Helpers
export function isOwnerAdmin(session: AdminSessionPayload | null): boolean {
  return session?.role === 'OWNER_ADMIN';
}

export function isStaffOrOwner(session: AdminSessionPayload | null): boolean {
  return session?.role === 'OWNER_ADMIN' || session?.role === 'STAFF';
}
