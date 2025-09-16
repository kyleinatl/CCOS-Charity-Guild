import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eueqffggclywmajfwiio.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZXFmZmdnY2x5d21hamZ3aWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzQxMDUsImV4cCI6MjA3MzU1MDEwNX0.C3EcY0LgKJ2vOybc1rBHlwgsviKJ5w32xW9MxZHJ85E'
  )
}