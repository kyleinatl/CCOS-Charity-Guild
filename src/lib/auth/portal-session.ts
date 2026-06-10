import crypto from 'node:crypto';
import { portalAccounts, type PortalAccount } from './portal-seed';

const SESSION_COOKIE_NAME = 'ccos_portal_session';
const SESSION_SECRET = process.env.PORTAL_SESSION_SECRET || 'ccos-portal-session-secret';

export interface PortalSessionPayload {
  username: string;
  issuedAt: string;
}

function normalizeIdentity(value: string) {
  return value.trim().toLowerCase();
}

export function hashPortalPassword(password: string) {
  return crypto.createHash('sha256').update(`ccos-portal:${password}`).digest('hex');
}

export function findPortalAccount(identity: string) {
  const normalizedIdentity = normalizeIdentity(identity);

  return portalAccounts.find((account) =>
    [account.username, account.displayName, account.email].some(
      (candidate) => normalizeIdentity(candidate) === normalizedIdentity
    )
  );
}

export function verifyPortalPassword(account: PortalAccount, password: string) {
  return account.passwordHash === hashPortalPassword(password);
}

function signPayload(payload: string) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
}

export function createPortalSessionToken(payload: PortalSessionPayload) {
  const serializedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signPayload(serializedPayload);
  return `${serializedPayload}.${signature}`;
}

export function readPortalSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const [serializedPayload, signature] = token.split('.');
  if (!serializedPayload || !signature) {
    return null;
  }

  if (signPayload(serializedPayload) !== signature) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(serializedPayload, 'base64url').toString('utf8')) as PortalSessionPayload;
    if (!parsed.username || !parsed.issuedAt) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getPortalSessionCookieOptions(maxAgeSeconds = 60 * 60 * 12) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

export function getPortalSessionCookieName() {
  return SESSION_COOKIE_NAME;
}
