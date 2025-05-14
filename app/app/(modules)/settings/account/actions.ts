'use server';

import { getFileExtension } from '@/utils';
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
  if (error) {
    console.log(error.message);
    return;
  }
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
  const { data: familyMembers, error } = await supabase
    .from('family_members')
    .select('*, profiles(*)')
    .eq('family_id', id);
  if (error) {
    console.log(error.message);
    return;
  }
  return familyMembers;
};

export const updateProfile = async (data: {
  id: string;
  fullName: string;
  profilePic?: File;
  isNewImage?: boolean;
  profileImageName?: string;
}) => {
  const supabase = await createClient();
  // 1. upload to storage
  let avatar_url = '';
  if (data.profilePic && data.isNewImage) {
    const { data: image, error } = await supabase.storage
      .from('user-images')
      .upload(data.profileImageName || `profile_${data.id}__0.${getFileExtension(data.profilePic)}`, data.profilePic, {
        upsert: false,
      });
    if (error) {
      console.log(error.message);
      return;
    }
    avatar_url = image.fullPath;
  }
  const payload: Record<string, string> = {
    full_name: data.fullName,
  };
  if (!!avatar_url) payload.avatar_url = avatar_url;
  // 2. update profile
  const { error } = await supabase.from('profiles').update(payload).eq('id', data.id);
  if (error) {
    console.log(error.message);
    return;
  }
  return true;
};

export type ProfileType = NonNullable<Awaited<ReturnType<typeof getProfile>>>;
export type FamilyMemberType = NonNullable<Awaited<ReturnType<typeof getFamilyMembers>>>[0];
