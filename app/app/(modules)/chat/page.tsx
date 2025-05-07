import ChatInterface from './_components/chatInterface';
import { getChatHistory } from './actions';

const Chat = async () => {
  const chatHistory = await getChatHistory();

  console.log({ chatHistory });

  return (
    <div className="h-full overflow-y-auto">
      <ChatInterface chatHistory={chatHistory ?? []} />
    </div>
  );
};

export default Chat;
