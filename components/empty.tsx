import { Squirrel } from 'lucide-react';

const Empty = ({ text = 'No data available' }: { text?: string }) => {
  return (
    <div className="flex flex-col gap-4 h-full justify-center items-center">
      <Squirrel size={48} />
      <p className="text-gray-400">{text}</p>
    </div>
  );
};

export default Empty;
