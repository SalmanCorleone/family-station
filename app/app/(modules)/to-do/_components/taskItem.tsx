import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/clsx';
import { Check, Zap } from 'lucide-react';
import { useMemo } from 'react';
import { TaskType } from '../action';
import { AnimatePresence, motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';

interface ITaskItemProps {
  task: TaskType;
  onClick: () => void;
  markAsCompleted: () => void;
  members: FamilyMemberType[] | null;
  membersImageMap: Record<string, string | undefined> | null;
  index: number;
}

const TaskItem = ({ task, onClick, markAsCompleted, members, membersImageMap, index }: ITaskItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `task-${task.id}-${task.list_id}-${index}`,
    data: { taskId: task.id, listId: task.list_id, index },
  });
  const assignedTo = useMemo(
    () => members?.find((member) => member.profile_id === task.assigned_to),
    [members, task.assigned_to],
  );

  return (
    <div
      ref={setNodeRef}
      className={cn('flex items-center gap-2 p-4 rounded-lg bg-white cursor-pointer shadow-sm z-10', {
        'z-20': isDragging,
        'hover-bg-muted': !isDragging,
      })}
      onClick={onClick}
      style={{ transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined }}
      {...attributes}
      {...listeners}
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
      <div className="flex gap-2 items-center">
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
