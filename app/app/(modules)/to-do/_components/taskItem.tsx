import { Tables } from '@/utils/supabase/db';

interface ITaskItemProps {
  task: Tables<'tasks'>;
  onClick: () => void;
}

const TaskItem = ({ task, onClick }: ITaskItemProps) => {
  return (
    <div className="flex gap-2 p-4 rounded-lg bg-white hover:bg-muted cursor-pointer shadow-sm" onClick={onClick}>
      <p>{task.title}</p>
    </div>
  );
};

export default TaskItem;
