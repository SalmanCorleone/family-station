import { cn } from '@/utils/clsx';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { ListType } from '../action';

interface IListProps {
  list: ListType;
  renderTasks: () => React.ReactNode;
  renderAddTaskForm: () => React.ReactNode;
}

const List = ({ list, renderTasks, renderAddTaskForm }: IListProps) => {
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      className={cn('flex flex-col gap-2 rounded-lg w-[65vw] xl:w-[25vw] p-2 bg-ash/10 self-start', {})}
      ref={listRef}
    >
      <div className="flex items-center gap-2">
        <p className="text-xl font-medium">{list.icon}</p>
        <p className="text-xl font-medium">{list.title}</p>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        {renderTasks()}
        {renderAddTaskForm()}
      </div>
    </motion.div>
  );
};

export default List;
