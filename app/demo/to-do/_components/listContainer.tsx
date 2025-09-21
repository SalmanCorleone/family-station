'use client';

import AddTaskForm from '@/app/app/(modules)/to-do/_components/addTaskForm';
import List from '@/app/app/(modules)/to-do/_components/list';
import TaskItem from '@/app/app/(modules)/to-do/_components/taskItem';
import { ListType, TaskType } from '@/app/app/(modules)/to-do/action';
import PageHeader from '@/components/pageHeader';
import { delay, getRandomInt } from '@/utils';
import useAutoSave from '@/utils/hooks/useAutoSave';
import { Tables } from '@/utils/supabase/db';
import dayjs from 'dayjs';
import { Loader } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { DEMO_DATA } from '../../demoData';
import EditTaskDialog from './editTaskDialog';

const profile = DEMO_DATA.PROFILE;
const members = DEMO_DATA.MEMBERS;
const membersImageMap = DEMO_DATA.MEMBERS_IMAGE_MAP;

const ListContainer = () => {
  const [lists, setLists] = useState<ListType[]>(DEMO_DATA.LISTS);
  const [activeTask, setActiveTask] = useState<Tables<'tasks'>>();
  const ref = useRef<HTMLButtonElement>(null);

  const saveData = () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        removeCompletedTasks();
      }, 2000);
    });
  const { countdown, saving, trigger } = useAutoSave(saveData, 5);

  const onTaskClick = (task: Tables<'tasks'>) => {
    setActiveTask(task);
    ref.current?.click();
  };

  const markTaskAsCompleted = useCallback(
    async (task: Tables<'tasks'>) => {
      if (!lists?.length) return;
      const listToUpdate = lists.find((list) => list.id === task.list_id);
      if (!listToUpdate) return;
      const updatedList = {
        ...listToUpdate,
        tasks: listToUpdate.tasks.map((t) => (t.id === task.id ? { ...t, is_completed: !t.is_completed } : t)),
      };
      // trigger();
      setLists(
        [...lists.filter((list) => list.id !== task.list_id), updatedList].sort(
          (a, b) => (a.index || 0) - (b.index || 0),
        ),
      );
      trigger();
      await delay(300);
    },
    [lists, trigger],
  );

  const removeCompletedTasks = () => {
    setLists((prev) =>
      prev.map((list) => ({
        ...list,
        tasks: list.tasks.filter((task) => !task.is_completed),
      })),
    );
  };

  const onAddTask = async (payload: TaskType) => {
    const targetList = lists.find((list) => list.id === payload.list_id);
    if (!targetList) return;
    const updatedList = {
      ...targetList,
      tasks: [...targetList.tasks, { ...payload }],
    };
    setLists(
      [...lists.filter((list) => list.id !== payload.list_id), updatedList].sort(
        (a, b) => (a.index || 0) - (b.index || 0),
      ),
    );
  };

  const renderHeaderLeft = () => {
    return saving ? (
      <div className="flex items-center justify-center translate-y-0.5">
        <Loader className="animate-spin" size={12} />
      </div>
    ) : countdown > 0 && countdown < 4 ? (
      <div className="flex items-center gap-2 translate-y-0.5">
        <p className="text-xs font-medium text-gray-400">Auto-saving in {countdown} seconds</p>
        {/* <Button variant={'ghost'} onClick={trigger}>
          <Save size={16} />
          <p className="text-xs">Save</p>
        </Button> */}
      </div>
    ) : null;
  };

  const onEditTask = useCallback(
    async (task: TaskType) => {
      const targetList = lists.find((list) => list.id === task.list_id);
      if (!targetList) return;
      const updatedList = {
        ...targetList,
        tasks: targetList.tasks.map((t: TaskType) => (t.id === task.id ? { ...t, ...task } : t)),
      };
      setLists(
        [...lists.filter((list) => list.id !== task.list_id), updatedList].sort(
          (a, b) => (a.index || 0) - (b.index || 0),
        ),
      );
    },
    [lists],
  );

  const handleTaskDelete = useCallback(async () => {
    console.log({ activeTask });
    if (!activeTask) return;
    const targetList = lists.find((list) => list.id === activeTask.list_id);
    if (!targetList) return;
    const updatedList = {
      ...targetList,
      tasks: targetList.tasks.filter((t: TaskType) => t.id !== activeTask.id),
    };
    setLists(
      [...lists.filter((list) => list.id !== activeTask.list_id), updatedList].sort(
        (a, b) => (a.index || 0) - (b.index || 0),
      ),
    );
    setActiveTask(undefined);
    ref.current?.click();
  }, [activeTask, lists]);

  return (
    <div>
      <PageHeader title="To-do" renderLeft={renderHeaderLeft} />
      <div className="flex gap-4 w-min p-4">
        {lists?.map((list) => (
          <List
            key={list.id}
            renderTasks={() =>
              list.tasks.map((task, idx) => (
                <TaskItem
                  index={idx}
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task)}
                  markAsCompleted={() => {
                    markTaskAsCompleted(task);
                  }}
                  {...{ members, membersImageMap }}
                />
              ))
            }
            renderAddTaskForm={() => (
              <AddTaskForm
                onSubmit={(data) =>
                  onAddTask({
                    ...data,
                    list_id: list.id,
                    index: list.tasks.length,
                    assigned_to: null,
                    created_at: dayjs().toISOString(),
                    created_by: profile.id,
                    deadline: null,
                    id: getRandomInt(),
                    is_completed: false,
                    is_urgent: false,
                    updated_at: dayjs().toISOString(),
                  })
                }
              />
            )}
            {...{ list }}
          />
        ))}

        <EditTaskDialog ref={ref} task={activeTask} onSubmit={onEditTask} handleTaskDelete={handleTaskDelete} />
      </div>
    </div>
  );
};

export default ListContainer;
