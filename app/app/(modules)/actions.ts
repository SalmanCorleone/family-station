'use server';

import { createClient } from '@/utils/supabase/server';
import { getRecords } from './budget/actions';

export const getDashboardData = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not found');
    return {};
  }
  const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (profileError || !profile.family_id) {
    console.log(profileError);
    return {};
  }
  const financialRecords = await getRecords(profile.family_id, 0);
  const { data: urgentTasks, error: urgentTasksError } = await supabase
    .from('tasks')
    .select('*, profiles!tasks_assigned_to_fkey(id, full_name, avatar_url), lists!inner(id, family_id)')
    .eq('lists.family_id', profile.family_id)
    .eq('is_urgent', true)
    .eq('is_completed', false)
    .order('created_at', { ascending: false });
  if (urgentTasksError) {
    console.log(urgentTasksError);
    return {};
  }
  return { financialRecords, urgentTasks, profile };
};
