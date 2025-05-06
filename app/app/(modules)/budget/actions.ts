'use server';

import { createClient } from '@/utils/supabase/server';
import { addFinancialRecordSchema } from '@/utils/zod/schemas';
import { revalidatePath } from 'next/cache';

export const getRecords = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('financial_records')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) console.log(error);
  return data;
};

export const createRecord = async (payload: AddFinancialRecordPayloadType): Promise<boolean> => {
  const validatedPayload = addFinancialRecordSchema.safeParse(payload);
  if (validatedPayload.error) {
    console.log(validatedPayload.error.flatten());
    return false;
  }
  const supabase = await createClient();
  const { error } = await supabase.from('financial_records').insert(validatedPayload.data);
  if (error) {
    console.log(error.message);
    return false;
  }
  revalidatePath('/budget');
  return true;
};
