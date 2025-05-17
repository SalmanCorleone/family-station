import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/clsx';
import { useProfile } from '@/utils/context/profileContext';
import { Tables } from '@/utils/supabase/db';
import { Check, Zap } from 'lucide-react';
import { useMemo } from 'react';

interface ITaskItemProps {
  task: Tables<'tasks'>;
  onClick: () => void;
  markAsCompleted: () => void;
}

const TaskItem = ({ task, onClick, markAsCompleted }: ITaskItemProps) => {
  const { membersImageMap, members } = useProfile();
  const assignedTo = useMemo(
    () => members?.find((member) => member.profile_id === task.assigned_to),
    [members, task.assigned_to],
  );

  return (
    <div
      className="flex items-center gap-2 p-4 rounded-lg bg-white hover:bg-muted cursor-pointer shadow-sm"
      onClick={onClick}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          markAsCompleted();
        }}
        className={cn('border w-4 h-4 rounded-3xl flex items-center justify-center', {
          'bg-green border-0': task.is_completed,
        })}
      >
        {task.is_completed ? <Check size={12} stroke="white" /> : null}
      </div>
      <div className="flex-1">
        <p>{task.title}</p>
      </div>
      <div className="flex gap-2">
        {!!task.assigned_to && (
          <div className="">
            <Avatar style={{ width: 24, height: 24 }}>
              <AvatarImage src={task.assigned_to ? membersImageMap?.[task.assigned_to] : undefined} />
              <AvatarFallback>{assignedTo?.profiles?.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        )}
        {!!task.is_urgent && (
          <div className="">
            <Zap fill="var(--color-orange)" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
