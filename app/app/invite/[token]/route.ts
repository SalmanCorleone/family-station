import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: { token: string } }) {
  let params = context.params;
  const host = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;
  params = await params;
  const invitationToken = params.token;

  if (!invitationToken) {
    console.log('no token-------------');
    return NextResponse.redirect(baseUrl);
  }

  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser();

  console.log({ user });

  if (error) {
    console.log('no user------------', error);
    return NextResponse.redirect(`${baseUrl}/signup?invitationToken=${invitationToken}`);
  }
  // check if the invitation token is valid
  // if valid, redirect to the family page
  const { data: family } = await supabase.from('family').select('*').eq('invitation_token', invitationToken).single();
  console.log({ family });

  if (!family) {
    console.log('No family found with this token');
    return NextResponse.redirect(baseUrl);
  }

  // update profile db and members table
  if (!user.user?.id) return NextResponse.redirect(baseUrl);

  const { error: updatedProfileError } = await supabase
    .from('profiles')
    .update({ family_id: family.id })
    .eq('id', user.user.id);

  const { error: updatedMembersError } = await supabase
    .from('family_members')
    .upsert({
      family_id: family.id,
      status: 'active',
      profile_id: user.user.id,
      role: 'member',
      is_owner: false,
      email: user.user.email,
    })
    .eq('profile_id', user.user.id);

  if (updatedProfileError || updatedMembersError) {
    console.log({ updatedProfileError, updatedMembersError });
    return NextResponse.redirect(baseUrl);
  }

  return NextResponse.redirect(`${baseUrl}/app`);
}
