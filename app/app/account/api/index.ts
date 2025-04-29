'use server';

import { createClient } from '@/utils/supabase/server';

export const getProfile = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log('no user');
    return;
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
  if (error) {
    console.log(error.message);
    return;
  }
  console.log('user', data);
  return data;
};
