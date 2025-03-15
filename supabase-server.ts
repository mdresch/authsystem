import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: {
          getItem: async (key: string) => {
            const store = await cookieStore;
            const cookie = store.getAll(key);
            return cookie.length > 0 ? cookie[0].value : null;
          },
          setItem: async (key: string, value: string) => {
            const store = await cookieStore;
            store.set(key, value);
          },
          removeItem: async (key: string) => {
            const store = await cookieStore;
            store.delete(key);
          },
        },
      },
    }
  );

  return supabase;
};
