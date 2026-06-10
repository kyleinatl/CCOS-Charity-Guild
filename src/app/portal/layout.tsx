'use client';

import { MemberPortalLayout } from '@/components/layout/member-portal-layout';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <MemberPortalLayout>{children}</MemberPortalLayout>;
}
