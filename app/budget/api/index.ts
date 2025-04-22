'use server';

import { type Tables } from '@/utils/supabase/db';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const getRecords = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('financial_records').select('*');
  if (error) console.log(error);
  console.table(data);
  return data;
};

export const createRecord = async (record: Tables<'financial_records'>) => {
  const supabase = await createClient();
  const { error } = await supabase.from('financial_records').insert(record);
  if (error) console.log(error);
  revalidatePath('/budget');
  return true;
};
