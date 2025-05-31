'use client';

import useAutoSave from '@/utils/hooks/useAutoSave';
import { Tables } from '@/utils/supabase/db';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useCallback, useRef, useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ListType, TaskType } from '@/app/app/(modules)/to-do/action';
import PageHeader from '@/components/pageHeader';
import { delay, getRandomInt } from '@/utils';
import dayjs from 'dayjs';
import { Loader } from 'lucide-react';
import { DEMO_DATA } from '../../demoData';
import EditTaskDialog from './editTaskDialog';
import AddTaskForm from '@/app/app/(modules)/to-do/_components/addTaskForm';
import List from '@/app/app/(modules)/to-do/_components/list';
import TaskItem from '@/app/app/(modules)/to-do/_components/taskItem';

const profile = DEMO_DATA.PROFILE;
const members = DEMO_DATA.MEMBERS;
const membersImageMap = DEMO_DATA.MEMBERS_IMAGE_MAP;

const ListContainer = () => {
  const [lists, setLists] = useState<ListType[]>(DEMO_DATA.LISTS);
  const [draggingTask, setDraggingTask] = useState<TaskType>();
  const [activeTask, setActiveTask] = useState<Tables<'tasks'>>();
  const ref = useRef<HTMLButtonElement>(null);
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
      const filteredList = { ...listToUpdate, tasks: listToUpdate.tasks.filter((t) => t.id !== task.id) };
      setLists(
        [...lists.filter((list) => list.id !== task.list_id), filteredList].sort(
          (a, b) => (a.index || 0) - (b.index || 0),
        ),
      );
    },
    [lists, trigger],
  );

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

  const findTaskById = (id: string): { task: TaskType; listId: number } | null => {
    for (const list of lists) {
      const task = list.tasks.find((t: TaskType) => t.id.toString() === id);
      if (task) return { task, listId: list.id };
    }
    return null;
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggingTask(undefined);
    if (!over || active.id === over.id || !lists) return;

    const fromData = findTaskById(active.id as string);
    const toData = findTaskById(over.id as string);
    if (!fromData || !toData) return;

    const updatedLists = [...lists];
    const fromList = updatedLists.find((l) => l.id === fromData.listId);
    const toList = updatedLists.find((l) => l.id === toData.listId);

    if (!fromList || !toList) return;

    const fromIndex = fromList.tasks.findIndex((t: TaskType) => t.id.toString() === active.id.toString());
    const toIndex = toList.tasks.findIndex((t: TaskType) => t.id.toString() === over.id.toString());

    const [movedTask] = fromList.tasks.splice(fromIndex, 1);
    console.log([fromList.id, fromIndex], [toList.id, toIndex], { movedTask });
    toList.tasks.splice(toIndex, 0, movedTask);

    setLists(updatedLists);
  };

  const renderTasks = (tasks: TaskType[]) =>
    tasks.map((task, idx) => (
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
    ));

  const renderAddTaskForm = (list: ListType) => (
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
  );

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

  return (
    <DndContext
      onDragEnd={onDragEnd}
      sensors={sensors}
      onDragStart={handleDragStart}
      collisionDetection={closestCenter}
    >
      <PageHeader title="To-do" renderLeft={renderHeaderLeft} />
      <div className="flex gap-4 w-min p-4">
        {lists?.map((list) => (
          <SortableContext
            key={list.id}
            // items={list.tasks.map((_, index) => `${list.id}:${index}`)}
            items={list.tasks.map((task: TaskType) => `${task.id}`)}
            strategy={verticalListSortingStrategy}
          >
            <List key={list.id} {...{ renderAddTaskForm, renderTasks, list }} />
          </SortableContext>
        ))}
        <DragOverlay>
          {draggingTask ? <div className="bg-white p-4 rounded shadow text-2xl">{draggingTask.title}</div> : null}
        </DragOverlay>

        <EditTaskDialog ref={ref} task={activeTask} onSubmit={onEditTask} />
      </div>
    </DndContext>
  );
};

export default ListContainer;
