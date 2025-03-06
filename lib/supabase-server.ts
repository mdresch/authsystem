// lib/supabase-server.ts (CORRECT - Using cookies() helper)
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createSupabaseServerClient = async () => { // No context parameter!
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use the SERVICE ROLE KEY
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore.get(name))?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          (await cookieStore).set({ name, value, ...options });
        },
        async remove(name: string, options: CookieOptions) {
          (await cookieStore).delete({ name, ...options });
        },
      },
    }
  );
};