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
  const { data, error } = await supabase.from('profiles').select('*, family(*)').eq('id', user?.id).single();
  console.log({ profileData: data });
  if (error) {
    console.log(error.message);
    return;
  }
  console.log('user', data);
  return data;
};

export const getFamilyMembers = async (id: number) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log('no user');
    return;
  }
  const { data: familyMembers, error } = await supabase.from('family_members').select('*').eq('family_id', id);
  if (error) {
    console.log(error.message);
    return;
  }
  console.log('members', familyMembers);
  return familyMembers;
};
