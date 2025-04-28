'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(4, 'Password must be at least 4 characters long')
    .max(16, 'Password must be 16 characters or less'),
});

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or less'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password must be 100 characters or less'),
});

export async function login(formData: FormData) {
  console.log('entered login func-----------------', { formData });
  const supabase = await createClient();
  const jsonData = Object.fromEntries(formData);
  const validation = loginSchema.safeParse(jsonData);
  console.log({ validation });
  if (!validation.success) {
    console.log(validation.error.flatten());
    return;
  } else {
    console.log('Validation succeeded:', validation.data);
  }
  const { error } = await supabase.auth.signInWithPassword(validation.data);
  if (error) {
    // redirect('/error');
    toast.error(error.message);
    return;
  }
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const validation = signUpSchema.safeParse(formData);
  if (!validation.success) {
    console.log(validation.error.flatten().fieldErrors);
    return;
  } else {
    console.log('Validation succeeded:', validation.data);
  }

  const data = {
    ...validation.data,
    options: {
      data: {
        full_name: `${validation.data.firstName + ' ' + validation.data.lastName}`,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect('/error');
  }

  redirect('/logout');
}

export async function signInWithGoogle() {
  // console.log({ origin });
  // return;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
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
