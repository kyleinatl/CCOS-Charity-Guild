import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { findPortalAccount, getPortalSessionCookieName, readPortalSessionToken } from '@/lib/auth/portal-session';
import { getPortalUserResponse } from '@/lib/auth/portal-user';

export async function GET() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(getPortalSessionCookieName())?.value;
  const session = readPortalSessionToken(sessionToken);

  if (!session) {
    return NextResponse.json({ user: null });
  }

  const account = findPortalAccount(session.username);
  if (!account) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: await getPortalUserResponse(account) });
}
