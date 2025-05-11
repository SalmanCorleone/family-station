'use server';

import { getRandomInt } from '@/utils';
import { createClient } from '@/utils/supabase/server';

export const createFamily = async (data: { title: string; image?: File }) => {
  const supabase = await createClient();
  // 1, upload image if available
  let imageUrl = '';
  if (data.image) {
    const { data: image, error } = await supabase.storage
      .from('family-images')
      .upload(`family_${getRandomInt()}_${data.image.name}`, data.image, { upsert: false });
    if (error) {
      console.log('storage error', error);
      return false;
    }
    imageUrl = image.fullPath;
  }

  // 2, create family
  const payload = {
    title: data.title,
    image: imageUrl,
  };
  const { data: family, error } = await supabase.from('family').insert(payload).select().single();
  if (error) {
    console.log('insert family error', error);
    return false;
  }

  return family;
};

export const updateFamily = async (data: { id: number; title: string; image?: File; imageName?: string }) => {
  const supabase = await createClient();
  // 1, upload image if available
  let imageUrl = '';
  if (data.image) {
    const { data: image, error } = await supabase.storage
      .from('family-images')
      .upload(data.imageName || `family_${getRandomInt()}_${data.image.name}`, data.image, { upsert: true });

    if (error) {
      console.log('storage error', error);
      return false;
    }
    imageUrl = image.fullPath;
  }
  // 2, update family
  const payload = {
    title: data.title,
    image: imageUrl,
  };
  const { data: updatedFamily, error } = await supabase
    .from('family')
    .update(payload)
    .eq('id', data.id)
    .select()
    .single();
  if (error) {
    console.log('update family error', error);
    return false;
  }
  return updatedFamily;
};
