import { createClient } from '@supabase/supabase-js';

export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eueqffggclywmajfwiio.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZXFmZmdnY2x5d21hamZ3aWlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk3NDEwNSwiZXhwIjoyMDczNTUwMTA1fQ.2GUzSbCQO3hy7nZGa4fAdVRSzdGYrkQrNaovOUUdwys'
  );
};
