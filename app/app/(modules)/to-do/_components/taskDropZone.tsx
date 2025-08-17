import { useDroppable } from '@dnd-kit/core';
import { ListType, TaskType } from '../action';
import { motion } from 'framer-motion';

interface TaskDropZoneProps {
  taskId: TaskType['id'];
  listId: ListType['id'];
  index: number;
}

const TaskDropZone = ({ index, listId, taskId }: TaskDropZoneProps) => {
  const { active, isOver, node, setNodeRef, over } = useDroppable({
    id: `task-drop-zone-${listId}-${taskId}-${index}`,
    data: { taskId, listId, index },
  });

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: isOver ? 24 : 0, opacity: isOver ? 1 : 0 }}
      // transition={{ duration: 100 }}
      ref={setNodeRef}
      className="rounded bg-green-50 border"
    ></motion.div>
  );
};

export default TaskDropZone;
