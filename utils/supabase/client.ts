import { createBrowserClient } from '@supabase/ssr';
export function createClient() {
  return createBrowserClient(process.env.DB_URL!, process.env.DB_KEY!);
}
