import { cn } from '@/utils/clsx';
// import { useDroppable } from '@dnd-kit/core';
import { ListType, TaskType } from '../action';

interface IListProps {
  list: ListType;
  renderTasks: (tasks: TaskType[]) => React.ReactNode;
  renderAddTaskForm: (list: ListType) => React.ReactNode;
}

const List = ({ list, renderTasks, renderAddTaskForm }: IListProps) => {
  // const { setNodeRef, isOver } = useDroppable({
  //   id: list.id.toString(),
  //   data: list,
  // });

  return (
    <div
      // ref={setNodeRef}
      className={cn('flex flex-col gap-2 rounded-lg w-[65vw] xl:w-[25vw] p-2 bg-ash/10 self-start', {
        // 'border-2 border-green': isOver,
      })}
    >
      <div className="flex items-center gap-4">
        <p className="text-xl font-medium">{list.icon}</p>
        <p className="text-xl font-medium">{list.title}</p>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {renderTasks(list.tasks)}
        {renderAddTaskForm(list)}
      </div>
    </div>
  );
};

export default List;
