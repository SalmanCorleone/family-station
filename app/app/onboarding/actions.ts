import { Tables } from '@/utils/supabase/db';
import { createClient } from '@/utils/supabase/server';

export const createFamily = async (data: Partial<Tables<'family'>>) => {
  const payload = {
    title: data.title,
    image: data.image,
  };
  const supabase = await createClient();
  const { data: family, error } = await supabase.from('family').insert(payload).select().single();
  if (error) {
    console.log(error);
    return false;
  }

  return family;
};
