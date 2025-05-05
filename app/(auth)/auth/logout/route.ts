import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.auth.signOut();
  }
  console.log('logout', { user });
  revalidatePath('/', 'layout');
  return NextResponse.redirect(new URL('/login', request.url));
}
