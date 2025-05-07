'use server';

import { createClient } from '@/utils/supabase/server';

export const getChatHistory = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.log(userError?.message);
    return [];
  }
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();
  if (!profile) {
    console.log(profileError?.message);
    return [];
  }
  const { data: chatHistory, error } = await supabase
    .from('chat_history')
    .select('*, profiles(id, full_name, avatar_url)')
    .eq('family_id', profile.family_id ?? -1)
    .limit(50)
    .order('created_at', { ascending: true });
  if (error) console.log(error);
  return chatHistory ?? [];
};

export const postChatMessage = async (payload: ChatMessagePayloadType) => {
  console.log('reached server');
  const supabase = await createClient();
  const { error } = await supabase.from('chat_history').insert(payload);
  if (error) {
    console.log('error from posting', error);
    return { success: false };
  }
  console.log('message posted');
  return { success: true };
};

export type ChatMessageType = NonNullable<Awaited<ReturnType<typeof getChatHistory>>>[0];
export type ChatMessagePayloadType = Omit<
  ChatMessageType,
  'profiles' | 'created_at' | 'updated_at' | 'id' | 'status' | 'is_deleted'
>;
