'use client';

import { useProfile } from '@/utils/context/profileContext';
import useAutoSave from '@/utils/hooks/useAutoSave';
import { Tables } from '@/utils/supabase/db';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
// import { Loader, Save } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import PageHeader from '@/components/pageHeader';
import SimpleLoader from '@/components/simpleLoader';
import { Loader } from 'lucide-react';
import { toast } from 'sonner';
import { addTask, getLists, ListType, TaskPayloadType, TaskType } from '../action';
import AddTaskForm from './addTaskForm';
import EditTaskDialog from './editTaskDialog';
import List from './list';
import TaskItem from './taskItem';
import TaskDropZone from './taskDropZone';

const ListContainer = () => {
  const [lists, setLists] = useState<ListType[] | undefined>();
  const [draggingTask, setDraggingTask] = useState<TaskType>();
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<Tables<'tasks'>>();
  const ref = useRef<HTMLButtonElement>(null);
  const { family, members, membersImageMap } = useProfile();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const saveData = () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  const { countdown, saving, trigger } = useAutoSave(saveData, 5);

  const fetchLists = useCallback(async () => {
    if (!family?.id) return;
    setLoading(true);
    const res = await getLists(family?.id);
    if (!res) {
      toast.error('Oops! Something went wrong!');
      setLoading(false);
      return;
    }
    setLists(res);
    setLoading(false);
  }, [family?.id]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

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
      trigger();
      setLists(
        [...lists.filter((list) => list.id !== task.list_id), updatedList].sort(
          (a, b) => (a.index || 0) - (b.index || 0),
        ),
      );
    },
    [lists, trigger],
  );

  const onAddTask = async (payload: TaskPayloadType) => {
    const res = await addTask(payload);
    if (!res) {
      toast.error('Oops! Something went wrong!');
    } else {
      await fetchLists();
      toast.success('Task added successfully!');
    }
  };

  const findTaskById = (id: string): { task: TaskType; listId: number } | null => {
    if (!lists) return null;
    for (const list of lists) {
      const task = list.tasks.find((t) => t.id.toString() === id);
      if (task) return { task, listId: list.id };
    }
    return null;
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggingTask(undefined);
    if (!over || !active || !active.data?.current || !over?.data?.current) return;
    if (active.data.current.taskId === over.data.current.taskId) return;

    const sourceTaskId = active.data.current.taskId;
    const sourceListId = active.data.current.listId;
    const targetListId = over.data.current.listId;
    const targetIndex = Math.max(over.data.current.index, 0);
    const isSameList = sourceListId === targetListId;

    let commonListTasks = lists?.find((list) => list.id === sourceListId)?.tasks;
    let sourceListTasks = lists?.find((list) => list.id === sourceListId)?.tasks;
    const targetListTasks = lists?.find((list) => list.id === targetListId)?.tasks;
    if (!sourceListTasks || !targetListTasks || !commonListTasks) return;

    if (isSameList) {
      const taskToMove = commonListTasks.find((task) => task.id === sourceTaskId);
      if (!taskToMove) return;
      commonListTasks = commonListTasks.filter((task) => task.id !== sourceTaskId);
      commonListTasks.splice(targetIndex, 0, taskToMove);
    } else {
      const taskToMove = sourceListTasks.find((task) => task.id === sourceTaskId);
      if (!taskToMove) return;
      sourceListTasks = sourceListTasks.filter((task) => task.id !== sourceTaskId);
      targetListTasks.splice(targetIndex, 0, taskToMove);
    }

    setLists((prevList) => {
      if (!prevList) return [];
      const res = prevList?.reduce((acc, list) => {
        if (isSameList) {
          if (list.id === sourceListId) {
            return [...acc, { ...list, tasks: commonListTasks }];
          } else {
            return [...acc, list];
          }
        } else {
          if (list.id === sourceListId) {
            return [...acc, { ...list, tasks: sourceListTasks }];
          } else if (list.id === targetListId) {
            return [...acc, { ...list, tasks: targetListTasks }];
          } else {
            return [...acc, list];
          }
        }
      }, [] as ListType[]);
      console.log({ res });
      return res;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = findTaskById(event.active.id as string);
    if (!task) return;
    setDraggingTask(task.task);
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

  if (loading)
    return (
      <div className="p-4">
        <SimpleLoader />
      </div>
    );

  return (
    <DndContext
      onDragEnd={onDragEnd}
      sensors={sensors}
      onDragStart={handleDragStart}
      collisionDetection={closestCenter}
    >
      <PageHeader title="To-do" renderLeft={renderHeaderLeft} />
      {/* Debug: Auto save test */}
      {/* <div className="border p-4 rounded-lg mb-4 bg-ash/10">
        {saving ? (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin" size={16} />
          </div>
        ) : countdown > 0 && countdown < 4 ? (
          <div className="flex items-center gap-2">
            <p className="text-xl font-medium">Auto-saving in {countdown} seconds</p>
            <Button variant={'ghost'} onClick={trigger}>
              <Save size={16} />
              <p className="text-xs">Save</p>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant={'ghost'} onClick={trigger}>
              <Save size={16} />
              <p className="text-xs">Save</p>
            </Button>
          </div>
        )}
      </div> */}
      <div className="flex gap-4 w-min p-4">
        {lists?.map((list) => (
          <List
            key={list.id}
            {...{ list }}
            renderTasks={(tasks: TaskType[]) =>
              tasks.map((task, idx) => (
                <>
                  {idx === 0 && (
                    <TaskDropZone
                      key={`task-drop-zone-${list.id}-${task.id}-${-1}`}
                      listId={list.id}
                      taskId={task.id}
                      index={-1}
                    />
                  )}
                  <TaskItem
                    key={'task_' + task.id}
                    index={idx}
                    task={task}
                    {...{ members, membersImageMap }}
                    onClick={() => onTaskClick(task)}
                    markAsCompleted={() => {
                      markTaskAsCompleted(task);
                    }}
                  />
                  <TaskDropZone key={'drop_zone_' + task.id} listId={list.id} taskId={task.id} index={idx} />
                </>
              ))
            }
            renderAddTaskForm={(list: ListType) => (
              <AddTaskForm onSubmit={(data) => onAddTask({ ...data, list_id: list.id, index: 0 })} />
            )}
          />
        ))}

        <EditTaskDialog ref={ref} task={activeTask} onSubmit={fetchLists} />
      </div>
    </DndContext>
  );
};

export default ListContainer;
