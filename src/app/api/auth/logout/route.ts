import { NextResponse } from 'next/server';
import { getPortalSessionCookieName, getPortalSessionCookieOptions } from '@/lib/auth/portal-session';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getPortalSessionCookieName(), '', {
    ...getPortalSessionCookieOptions(0),
    maxAge: 0,
  });
  return response;
}
