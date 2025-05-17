'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/clsx';
import { useProfile } from '@/utils/context/profileContext';
import useAutoSave from '@/utils/hooks/useAutoSave';
import { Tables } from '@/utils/supabase/db';
import { Loader, Save } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { toast } from 'sonner';
import { addTask, getLists, ListType, TaskPayloadType } from '../action';
import AddTaskForm from './addTaskForm';
import EditTaskDialog from './editTaskDialog';
import TaskItem from './taskItem';

const ListContainer = () => {
  const [lists, setLists] = useState<ListType[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<Tables<'tasks'>>();
  // const [countdown, setCountdown] = useState(0);
  const ref = useRef<HTMLButtonElement>(null);
  const { family } = useProfile();
  // const timeOutRef = useRef<NodeJS.Timeout | null>(null);

  const saveData = () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  const { countdown, saving, trigger } = useAutoSave(saveData, 5);

  // useInterval(
  //   () => {
  //     setCountdown((t) => t - 1);
  //   },
  //   countdown > 0 ? 1000 : null,
  // );

  // const queueServerCall = useCallback(() => {
  //   if (timeOutRef.current) clearTimeout(timeOutRef.current);
  //   setCountdown(5);
  //   timeOutRef.current = setTimeout(() => {
  //     // make api call
  //     setLoading(true);
  //     setTimeout(() => {
  //       setLoading(false);
  //       setCountdown(0);
  //     }, 2000);
  //   }, autoSaveInterval * 1000);
  // }, []);

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

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    /**
     * Moving between lists
     */
    if (source.droppableId !== destination.droppableId) {
      if (!lists?.length) return;
      const sourceList = lists.find((list) => list.id.toString() === source.droppableId);
      const destList = lists.find((list) => list.id.toString() === destination.droppableId);
      if (!sourceList || !destList) return;
      const [movedTask] = sourceList.tasks.splice(source.index, 1);
      if (movedTask) {
        destList.tasks.splice(destination.index, 0, movedTask);
      }
      const restOfLists = lists.filter((list) => list.id !== sourceList.id && list.id !== destList.id);
      setLists([...restOfLists, destList, sourceList].sort((a, b) => (a.index || 0) - (b.index || 0)));
    } else {
      /**
       * Re-ordering within the same list
       */
      if (!lists?.length) return;
      const sourceList = lists.find((list) => list.id.toString() === source.droppableId);
      if (!sourceList) return;
      const [movedTask] = sourceList.tasks.splice(source.index, 1);
      if (movedTask) {
        sourceList.tasks.splice(destination.index, 0, movedTask);
      }
      const restOfLists = lists.filter((item) => item.id !== sourceList.id);
      setLists([...restOfLists, sourceList].sort((a, b) => (a.index || 0) - (b.index || 0)));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="border p-4 rounded-lg mb-4 bg-ash/10">
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
      </div>
      <div className="flex gap-4 w-min">
        {lists?.map((list) => (
          <Droppable key={list.id} droppableId={list.id.toString()} direction="vertical">
            {(provided) => (
              <div
                className={cn('flex flex-col gap-2 rounded-lg w-[65vw] xl:w-[25vw] p-2 bg-ash/10 self-start')}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="flex items-center gap-4">
                  <p className="text-xl font-medium">{list.icon}</p>
                  <p className="text-xl font-medium">{list.title}</p>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {list.tasks.map((task, idx) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={idx}>
                      {(provided) => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          <TaskItem
                            task={task}
                            onClick={() => onTaskClick(task)}
                            markAsCompleted={() => markTaskAsCompleted(task)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <AddTaskForm
                    onSubmit={(data) => onAddTask({ ...data, list_id: list.id, index: list.tasks.length })}
                  />
                </div>
              </div>
            )}
          </Droppable>
        ))}

        <EditTaskDialog ref={ref} task={activeTask} onSubmit={fetchLists} />
      </div>
    </DragDropContext>
  );
};

export default ListContainer;
