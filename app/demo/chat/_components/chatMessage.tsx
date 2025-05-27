import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/utils';
import { useMemo } from 'react';
import { DEMO_DATA } from '../../demoData';

const profile = DEMO_DATA.PROFILE;
const membersImageMap = DEMO_DATA.MEMBERS_IMAGE_MAP;

interface IChatMessageProps {
  message: ChatMessageType;
  isMyMessage: boolean;
}

const ChatMessage = ({ message, isMyMessage }: IChatMessageProps) => {
  const avatarURLFromContext = useMemo(
    () => (message.profile_id ? (membersImageMap as Record<string, string>)?.[message.profile_id] : undefined),
    [message.profile_id],
  );

  return (
    <div key={message.id} className={`flex items-start gap-2.5 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
      {!isMyMessage && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={avatarURLFromContext || undefined} alt="Avatar" />
          <AvatarFallback className="bg-white">{message.profiles?.full_name?.charAt(0) ?? '😊'}</AvatarFallback>
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
          <AvatarImage src={avatarURLFromContext || undefined} alt="Avatar" />
          <AvatarFallback className="bg-white">
            {profile?.full_name?.charAt(0) ?? profile?.email?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
