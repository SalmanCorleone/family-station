import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from './db';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(process.env.DB_URL!, process.env.DB_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          console.log('error setting cookies');
        }
      },
    },
  });
}
