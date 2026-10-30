import { NextRequest, NextResponse } from 'next/server';
import {
  verifySecretKey,
  createGatekeeperToken,
  setGatekeeperCookie,
  checkRateLimit,
  resetRateLimit,
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    const rateLimit = checkRateLimit(`gatekeeper-${ip}`, 5, 15 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many unsuccessful attempts. Access locked for ${rateLimit.retryAfterSec} seconds.`,
        },
        { status: 429 }
      );
    }

    const { secretKey } = await req.json();

    if (!secretKey) {
      return NextResponse.json(
        { error: 'Security key is required.' },
        { status: 400 }
      );
    }

    const isValid = verifySecretKey(secretKey);

    if (!isValid) {
      return NextResponse.json(
        {
          error: 'Access denied: Invalid security key.',
          remainingAttempts: rateLimit.remainingAttempts,
        },
        { status: 403 }
      );
    }

    // Reset rate limit on success
    resetRateLimit(`gatekeeper-${ip}`);

    // Create and set gatekeeper clearance cookie
    const token = await createGatekeeperToken();
    await setGatekeeperCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Access granted.',
      redirect: '/admin/login',
    });
  } catch (error: any) {
    console.error('Gatekeeper error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during authorization.' },
      { status: 500 }
    );
  }
}
