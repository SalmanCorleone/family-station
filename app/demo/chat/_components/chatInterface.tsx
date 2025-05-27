'use client';

import type React from 'react';

import PageHeader from '@/components/pageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ChatMessage from './chatMessage';
import EmptyChat from './emptyChat';
import dayjs from 'dayjs';
import { DEMO_DATA } from '../../demoData';

const profile = DEMO_DATA.PROFILE;
const members = DEMO_DATA.MEMBERS;
const membersImageMap = DEMO_DATA.MEMBERS_IMAGE_MAP;
interface IChatInterfaceProps {
  chatHistory: ChatMessageType[];
}

const ChatInterface = ({ chatHistory }: IChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>(chatHistory);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      console.log('It was a empty string');
      return;
    }
    if (!profile?.id) {
      console.log('no profile id');
      return;
    }
    const payload: ChatMessageType = {
      text: newMessage,
      profile_id: profile?.id,
      family_id: profile?.family_id,
      created_at: dayjs().toISOString(),
      updated_at: null,
      id: messages.length + 1,
      is_deleted: false,
      status: null,
      profiles: profile,
    };
    setMessages((prev) => [...prev, payload]);
    setNewMessage('');
    setTimeout(() => {
      const usersWhoCanReply = Object.keys(membersImageMap).filter((key) => key !== profile?.id);
      const randomIndex = Math.floor(Math.random() * 10) % usersWhoCanReply.length;
      const userId = usersWhoCanReply[randomIndex];
      const replyPayload: ChatMessageType = {
        ...payload,
        text: 'This is a typical reply',
        profile_id: userId,
        family_id: profile?.family_id,
        id: messages.length + 1,
        profiles: members.find((member) => member.profile_id === userId)?.profiles || members[1].profiles,
      };
      setMessages((prev) => [...prev, replyPayload]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Chat" />

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
