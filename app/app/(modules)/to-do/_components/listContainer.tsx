'use client';

import { toast } from 'sonner';
import { addTask, ListType, TaskPayloadType } from '../action';
import AddTaskForm from './addTaskForm';
import TaskItem from './taskItem';
import EditTaskDialog from './editTaskDialog';
import { useRef, useState } from 'react';
import { Tables } from '@/utils/supabase/db';

interface IListContainerProps {
  lists: ListType[];
}

const ListContainer = ({ lists }: IListContainerProps) => {
  const [activeTask, setActiveTask] = useState<Tables<'tasks'>>();
  const ref = useRef<HTMLButtonElement>(null);

  const onTaskClick = (task: Tables<'tasks'>) => {
    setActiveTask(task);
    ref.current?.click();
  };

  const onAddTask = async (payload: TaskPayloadType) => {
    const res = await addTask(payload);
    if (!res) {
      toast.error('Oops! Something went wrong!');
    } else {
      toast.success('Task added successfully!');
    }
  };

  return (
    <div className="flex gap-4">
      {lists.map((list) => (
        <div key={list.id} className="flex flex-col gap-2 rounded-lg w-[85%] xl:w-[25%] p-2 bg-gray-50 self-start">
          <div className="flex justify-center items-center gap-4">
            <p className="text-xl font-medium">{list.icon}</p>
            <p className="text-xl font-medium">{list.title}</p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {list.tasks.map((task) => (
              <TaskItem key={task.id} task={task} onClick={() => onTaskClick(task)} />
            ))}
            <AddTaskForm onSubmit={(data) => onAddTask({ ...data, list_id: list.id, index: list.tasks.length })} />
          </div>
        </div>
      ))}

      <EditTaskDialog ref={ref} task={activeTask} />
    </div>
  );
};

export default ListContainer;
