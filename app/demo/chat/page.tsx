import { DEMO_DATA } from '../demoData';
import ChatInterface from './_components/chatInterface';

const Chat = async () => {
  const chatHistory = DEMO_DATA.CHAT_HISTORY;

  return (
    <div className="h-full overflow-y-auto">
      <ChatInterface chatHistory={chatHistory ?? []} />
    </div>
  );
};

export default Chat;
