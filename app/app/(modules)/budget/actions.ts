'use server';

import { createClient } from '@/utils/supabase/server';
import { addFinancialRecordSchema } from '@/utils/zod/schemas';
import dayjs from 'dayjs';

export const getRecords = async (familyId: number, activeMonthIndex: number = 0) => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.log(userError?.message);
    return;
  }
  const [startDate, endDate] = [
    dayjs().add(activeMonthIndex, 'month').startOf('month').format('YYYY-MM-DD'),
    dayjs().add(activeMonthIndex, 'month').endOf('month').format('YYYY-MM-DD'),
  ];
  const { data: financialRecords, error } = await supabase
    .from('financial_records')
    .select('*, profiles(id, full_name, avatar_url)')
    .eq('family_id', familyId)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: false });
  if (error) {
    console.log(error);
    return;
  }
  return financialRecords;
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
  return true;
};

export const updateRecord = async (
  id: FinancialRecordType['id'],
  payload: AddFinancialRecordPayloadType,
): Promise<boolean> => {
  const validatedPayload = addFinancialRecordSchema.safeParse(payload);
  if (validatedPayload.error) {
    console.log(validatedPayload.error.flatten());
    return false;
  }
  const supabase = await createClient();
  const { error } = await supabase.from('financial_records').update(validatedPayload.data).eq('id', id);
  if (error) {
    console.log(error.message);
    return false;
  }
  return true;
};
