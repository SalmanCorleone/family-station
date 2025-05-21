import { ListType, TaskType } from '@/app/app/(modules)/to-do/action';
import { cn } from '@/utils/clsx';

interface IListProps {
  list: ListType;
  renderTasks: (tasks: TaskType[]) => React.ReactNode;
  renderAddTaskForm: (list: ListType) => React.ReactNode;
}

const List = ({ list, renderTasks, renderAddTaskForm }: IListProps) => {
  return (
    <div className={cn('flex flex-col gap-2 rounded-lg w-[65vw] xl:w-[25vw] p-2 bg-ash/10 self-start', {})}>
      <div className="flex items-center gap-4 px-2">
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
