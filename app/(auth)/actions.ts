'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';
import { signUpSchema } from '@/utils/zod/schemas';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(4, 'Password must be at least 4 characters long')
    .max(16, 'Password must be 16 characters or less'),
});

export async function login(data: z.infer<typeof loginSchema>) {
  const supabase = await createClient();
  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    console.log(validation.error.flatten());
    return { message: 'Invalid email or password', success: false };
  }
  const { error } = await supabase.auth.signInWithPassword(validation.data);
  if (error) {
    console.log(error.message);
    return { message: error.message, success: false };
  }
  revalidatePath('/', 'layout');
  redirect('/');
}

export const signup = async (data: z.infer<typeof signUpSchema>) => {
  const supabase = await createClient();
  const validatedRee = signUpSchema.safeParse(data);
  if (!validatedRee.success) {
    console.log(validatedRee.error.flatten());
    return { message: 'Invalid email or password', success: false };
  }
  const payload = {
    ...validatedRee.data,
    options: {
      data: {
        email: data.email,
        full_name: data.name,
      },
    },
  };
  const { error } = await supabase.auth.signUp(payload);
  if (error) {
    return { message: error.message, success: false };
  }
  revalidatePath('/', 'layout');
  redirect(`/signup/email-sent?email=${data.email}`);
  // return { success: true, message: 'Success' };
};

export async function signInWithGoogle(origin: string) {
  // console.log({ origin });
  // return;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.log(error);
    redirect('/error');
  }

  redirect(data.url);
}

export const crossCheckInvitationToken = async (token: string) => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user?.id) {
    console.log('no user');
    return { message: 'You need to login first to join the family', success: false };
  }

  const { data: alreadyMember } = await supabase
    .from('family_members')
    .select('status')
    .eq('profile_id', user.user.id)
    .single();
  if (alreadyMember) {
    console.log('already member');
    return { message: 'You are already a member of this family', success: true };
  }

  const { data: family } = await supabase.from('family').select('*').eq('invitation_token', token).single();
  if (!family) {
    console.log('no family');
    return { message: 'Invalid token', success: false };
  }
  const { error: profileUpdateError } = await supabase
    .from('profiles')
    .update({ family_id: family.id })
    .eq('id', user.user.id);
  if (profileUpdateError) {
    console.log('no profile');
    return { message: 'Failed to join the family', success: false };
  }

  const { error: membersUpdateError } = await supabase
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
  if (membersUpdateError) {
    console.log('inserting member error');
    return { message: 'Failed to join the family', success: false };
  }

  return { message: 'Success', success: true };
};
