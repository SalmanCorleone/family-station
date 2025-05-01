import { createClient } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest, { params }: { params: { token: string } }) => {
  console.log('invite api has been hit');

  const invitationToken = params.token;

  if (!invitationToken) {
    return new Response('No invitation token found', { status: 400 });
  }

  console.log({ invitationToken });

  const supabase = await createClient();

  const user = await supabase.auth.getUser();

  if (!user) {
    return new Response('User not found', { status: 401 });
  }
  // check if the invitation token is valid
  // if valid, redirect to the family page
  const { data: family } = await supabase.from('family').select('*').eq('invitation_token', invitationToken).single();
  console.log({ family });
  // if not, return a 404 response
};
