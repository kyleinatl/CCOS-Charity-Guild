export interface PortalAccount {
  username: string;
  displayName: string;
  passwordHash: string;
  role: 'admin_role' | 'treasurer_role' | 'member_role';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  email: string;
  memberId: string | null;
}

// Admin accounts only - real donors/members come from Supabase database
export const portalAccounts: PortalAccount[] = [
  {
    username: "admin",
    displayName: "Admin",
    passwordHash: "6d66d16574d52348a706c15db4ba388471d235d0b2bb0ba97270f91ce882705e",
    role: "admin_role" as PortalAccount['role'],
    tier: "platinum" as PortalAccount['tier'],
    email: "admin@ccoscharityguild.org",
    memberId: null,
  },
];

export const portalCredentialBootstrap = portalAccounts.map(({ username, displayName, role }) => ({ username, displayName, role }));
