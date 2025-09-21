import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/clsx';
import { Check, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { TaskType } from '../action';

interface ITaskItemProps {
  task: TaskType;
  onClick: () => void;
  markAsCompleted: () => void;
  members: FamilyMemberType[] | null;
  membersImageMap: Record<string, string | undefined> | null;
  index: number;
}

const TaskItem = ({ task, onClick, markAsCompleted, members, membersImageMap }: ITaskItemProps) => {
  const assignedTo = useMemo(
    () => members?.find((member) => member.profile_id === task.assigned_to),
    [members, task.assigned_to],
  );

  return (
    <div
      className={cn('flex items-center rounded-lg bg-white cursor-pointer shadow-sm z-10 hover:bg-gray-50', {})}
      onClick={onClick}
    >
      {/* Mark as complete */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          markAsCompleted();
        }}
        className="h-16 px-4 flex items-center justify-center"
      >
        <div
          className={cn('border w-4 h-4 rounded-3xl flex items-center justify-center', {
            'bg-green border-0': task.is_completed,
          })}
        >
          {task.is_completed ? <Check size={12} stroke="white" /> : null}
        </div>
      </div>

      {/* Title */}
      <div className="flex-1">
        <p>{task.title}</p>
      </div>

      {/* Assigned to & Urgent */}
      <div className="flex gap-2 items-center mr-4">
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
            <Zap fill="var(--color-orange)" className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
