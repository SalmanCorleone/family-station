'use client';

import { toast } from 'sonner';
import { addTask, getLists, ListType, TaskPayloadType } from '../action';
import AddTaskForm from './addTaskForm';
import TaskItem from './taskItem';
import EditTaskDialog from './editTaskDialog';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Tables } from '@/utils/supabase/db';
import { useProfile } from '@/utils/context/profileContext';

const ListContainer = () => {
  const [lists, setLists] = useState<ListType[] | undefined>();
  const [activeTask, setActiveTask] = useState<Tables<'tasks'>>();
  const ref = useRef<HTMLButtonElement>(null);
  const { family } = useProfile();

  const fetchLists = useCallback(async () => {
    if (!family?.id) return;
    const res = await getLists(family?.id);
    if (!res) {
      toast.error('Oops! Something went wrong!');
      return;
    }
    setLists(res);
  }, [family?.id]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

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
    <div className="flex gap-4 w-min">
      {lists?.map((list) => (
        <div key={list.id} className="flex flex-col gap-2 rounded-lg w-[65vw] xl:w-[25vw] p-2 bg-ash/10 self-start">
          <div className="flex items-center gap-4">
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
