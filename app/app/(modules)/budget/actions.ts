'use server';

import { createClient } from '@/utils/supabase/server';
import { addFinancialRecordSchema } from '@/utils/zod/schemas';
import { revalidatePath } from 'next/cache';

export const getRecords = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.log(userError?.message);
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();
  if (!profile) {
    console.log(profileError?.message);
    return;
  }

  const { data: financialRecords, error } = await supabase
    .from('financial_records')
    .select('*, profiles(id, full_name, avatar_url)')
    .eq('family_id', profile.family_id ?? -1)
    .order('created_at', { ascending: false });
  if (error) console.log(error);
  return financialRecords;
};

export type FinancialRecord = NonNullable<Awaited<ReturnType<typeof getRecords>>>[0];

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
