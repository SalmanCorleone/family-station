'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessagePayloadType, ChatMessageType, postChatMessage } from '../actions';
import ChatHeader from './chatHeader';
import { useProfile } from '@/utils/context/profileContext';
import { formatDate } from '@/utils';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import EmptyChat from './emptyChat';

interface IChatInterfaceProps {
  chatHistory: ChatMessageType[];
}

const ChatInterface = ({ chatHistory }: IChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>(chatHistory);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useProfile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('chat-history')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_history',
        },
        (payload: { new: ChatMessageType }) => {
          console.log({ hey: payload?.new });
          setMessages((prev) => (payload.new.family_id === profile?.family_id ? [...prev, payload.new] : prev));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.family_id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      console.log('trim blokced me');
      return;
    }
    if (!profile?.id) {
      console.log('no profile id');
      return;
    }
    const payload: ChatMessagePayloadType = {
      text: newMessage,
      profile_id: profile?.id,
      family_id: profile?.family_id,
    };
    const res = await postChatMessage(payload);
    if (!res) {
      toast.error('Oops! Something went wrong!');
      return;
    }
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!messages?.length ? (
          <EmptyChat />
        ) : (
          messages?.map((message) => {
            const isMyMessage = message.profile_id === profile?.id;
            return (
              <div
                key={message.id}
                className={`flex items-start gap-2.5 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                {!isMyMessage && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.profiles?.avatar_url || undefined} alt="Avatar" />
                    <AvatarFallback className="bg-white">
                      {message.profiles?.full_name?.charAt(0) ?? '😊'}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`flex flex-col max-w-[80%] ${isMyMessage ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isMyMessage ? 'bg-green text-primary-foreground rounded-br-none' : 'bg-white rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{formatDate(message.created_at, true)}</span>
                </div>

                {isMyMessage && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profile.avatar_url || undefined} alt="Avatar" />
                    <AvatarFallback className="bg-white">
                      {profile.full_name?.charAt(0) ?? profile.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-ash/10">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
