'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/utils/context/profileContext';
import { createClient } from '@/utils/supabase/client';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ChatMessagePayloadType, ChatMessageType, postChatMessage } from '../actions';
import ChatHeader from './chatHeader';
import ChatMessage from './chatMessage';
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scroll">
        {!messages?.length ? (
          <EmptyChat />
        ) : (
          messages?.map((message) => (
            <ChatMessage key={`msg-${message.id}`} isMyMessage={message.profile_id === profile?.id} message={message} />
          ))
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
