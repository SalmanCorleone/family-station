'use server';

import { Tables } from '@/utils/supabase/db';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const getLists = async (familyId: number) => {
  const supabase = await createClient();
  const { data: lists, error } = await supabase
    .from('lists')
    .select(
      `*,
    tasks(*)
  `,
    )
    .eq('family_id', familyId)
    .order('index', { ascending: true })
    .order('index', { referencedTable: 'tasks', ascending: true });
  if (error) {
    console.log('error', error);
    return;
  }

  return lists;
};

export const addTask = async (task: TaskPayloadType) => {
  const supabase = await createClient();
  const { error } = await supabase.from('tasks').insert(task);
  if (error) {
    console.log('error', error);
    return false;
  }
  revalidatePath('/app/to-do');
  return true;
};

export type ListType = NonNullable<Awaited<ReturnType<typeof getLists>>>[0];
export type TaskPayloadType = Pick<OmitId<Tables<'tasks'>>, 'title' | 'list_id' | 'index'>;
