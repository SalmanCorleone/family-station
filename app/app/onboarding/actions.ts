'use server';

import { getFileExtension } from '@/utils';
import { createClient } from '@/utils/supabase/server';

export const createFamily = async (data: { title: string; image?: File }) => {
  const supabase = await createClient();
  const payload = {
    title: data.title,
  };
  const { data: family, error } = await supabase.from('family').insert(payload).select().single();
  if (error) {
    console.log('insert family error', error);
    return;
  }
  return family;
};

export type FamilyType = NonNullable<Awaited<ReturnType<typeof createFamily>>>;

export const updateFamily = async (data: { id: number; title: string; image?: File; imageName?: string }) => {
  const supabase = await createClient();
  /**
   *  1, upload image if available
   */
  let imageUrl = '';
  if (data.image) {
    const { data: image, error } = await supabase.storage
      .from('family-images')
      .upload(data.imageName || `family_${data.id}__0.${getFileExtension(data.image)}`, data.image, { upsert: true });

    if (error) {
      console.log('storage error', error);
      return false;
    }
    imageUrl = image.fullPath;
  }
  /**
   * 2, update family
   */
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

export const updateFamilySettings = async ({ id, settings }: { id: number; settings: FamilySettingsType }) => {
  const supabase = await createClient();
  const { data: updatedFamily, error } = await supabase
    .from('family')
    .update({ settings })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.log('update family settings error', error);
    return false;
  }
  return updatedFamily;
};
