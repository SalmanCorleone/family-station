import { createBrowserClient } from '@supabase/ssr';
import { Database } from './db';
export function createClient() {
  return createBrowserClient<Database>(process.env.NEXT_PUBLIC_DB_URL!, process.env.NEXT_PUBLIC_DB_KEY!);
}
