import { NextRequest, NextResponse } from 'next/server';
import { createPortalSessionToken, findPortalAccount, getPortalSessionCookieName, getPortalSessionCookieOptions, verifyPortalPassword } from '@/lib/auth/portal-session';
import { getPortalUserResponse } from '@/lib/auth/portal-user';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const identity = String(body.username || body.email || '').trim();
    const password = String(body.password || '');

    if (!identity || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const account = findPortalAccount(identity);
    if (!account || !verifyPortalPassword(account, password)) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const response = NextResponse.json({ user: await getPortalUserResponse(account) });
    response.cookies.set(
      getPortalSessionCookieName(),
      createPortalSessionToken({ username: account.username, issuedAt: new Date().toISOString() }),
      getPortalSessionCookieOptions()
    );

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid login request' }, { status: 400 });
  }
}
