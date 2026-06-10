import type { User } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/supabase/admin';

type PortalAccount = {
  username: string;
  displayName: string;
  email: string;
  role: 'admin_role' | 'treasurer_role' | 'member_role';
  tier: string;
};

function normalizeTier(rawTier: string) {
  if (rawTier === 'diamond') return 'platinum';
  if (rawTier === 'platinum') return 'platinum';
  if (rawTier === 'gold') return 'gold';
  if (rawTier === 'silver') return 'silver';
  return 'bronze';
}

function buildProfile(account: PortalAccount, profile: Record<string, any> | null, now: string) {
  if (profile) {
    return profile;
  }

  const [firstName, ...rest] = account.displayName.split(' ');
  const normalizedTier = normalizeTier(account.tier);
  return {
    id: account.email,
    first_name: firstName || account.displayName,
    last_name: rest.join(' '),
    tier: normalizedTier,
    total_donated: 0,
    phone: '',
    address_line1: '',
    city: '',
    state: '',
    zip_code: '',
    engagement_score: 0,
    created_at: now,
    updated_at: now,
  };
}

function buildUser(account: PortalAccount, profile: Record<string, any> | null) {
  const now = new Date().toISOString();
  const normalizedTier = normalizeTier(account.tier);
  const memberProfile = buildProfile(account, profile, now);
  const [firstName, ...rest] = memberProfile.first_name
    ? [memberProfile.first_name, memberProfile.last_name || '']
    : account.displayName.split(' ');

  return {
    id: memberProfile.id || account.email,
    aud: 'authenticated',
    role: 'authenticated',
    email: account.email,
    email_confirmed_at: now,
    phone: '',
    confirmed_at: now,
    last_sign_in_at: now,
    app_metadata: {
      role: account.role,
      tier: normalizedTier,
    },
    user_metadata: {
      first_name: firstName || account.displayName,
      last_name: rest.join(' ').trim(),
      display_name: account.displayName,
      role: account.role,
      tier: normalizedTier,
    },
    identities: [],
    created_at: memberProfile.created_at || now,
    updated_at: memberProfile.updated_at || now,
    member_profile: memberProfile,
  } as User & { member_profile: Record<string, any> };
}

export async function getPortalUserResponse(account: PortalAccount) {
  const supabase: any = createAdminClient();
  const { data: profile } = await supabase
    .from('members')
    .select('*')
    .eq('email', account.email)
    .maybeSingle();

  if (!profile) {
    const [firstName, ...rest] = account.displayName.split(' ');
    const normalizedTier = normalizeTier(account.tier);
    const { data: insertedProfile } = await supabase
      .from('members')
      .upsert(
        {
          email: account.email,
          first_name: firstName || account.displayName,
          last_name: rest.join(' ') || firstName || account.displayName,
          tier: normalizedTier,
          total_donated: 0,
          engagement_score: 0,
          email_subscribed: true,
          sms_subscribed: false,
          newsletter_subscribed: true,
          country: 'United States',
        },
        { onConflict: 'email' }
      )
      .select('*')
      .single();

    return buildUser(account, insertedProfile || null);
  }

  return buildUser(account, profile || null);
}
