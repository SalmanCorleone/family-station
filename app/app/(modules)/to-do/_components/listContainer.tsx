'use client';

import { toast } from 'sonner';
import { addTask, getLists, ListType, TaskPayloadType } from '../action';
import AddTaskForm from './addTaskForm';
import TaskItem from './taskItem';
import EditTaskDialog from './editTaskDialog';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Tables } from '@/utils/supabase/db';
import { useProfile } from '@/utils/context/profileContext';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { cn } from '@/utils/clsx';

const ListContainer = () => {
  const [lists, setLists] = useState<ListType[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<Tables<'tasks'>>();
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const { family } = useProfile();

  console.log({ dragging });

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
      <div className="flex gap-4 w-min">
        {lists?.map((list) => (
          <Droppable key={list.id} droppableId={list.id.toString()} direction="vertical">
            {(provided) => (
              <div
                className={cn('flex flex-col gap-2 rounded-lg w-[65vw] xl:w-[25vw] p-2 bg-ash/10 self-start', {
                  'bg-green border': dragging,
                })}
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
                          <TaskItem task={task} onClick={() => onTaskClick(task)} />
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

        <EditTaskDialog ref={ref} task={activeTask} />
      </div>
    </DragDropContext>
  );
};

export default ListContainer;
