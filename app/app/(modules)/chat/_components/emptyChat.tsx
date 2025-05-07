import { Squirrel } from 'lucide-react';

const EmptyChat = () => {
  return (
    <div className="flex flex-col gap-4 h-full justify-center items-center">
      <Squirrel size={48} />
      <p className="text-gray-400">No chat history yet</p>
    </div>
  );
};

export default EmptyChat;
