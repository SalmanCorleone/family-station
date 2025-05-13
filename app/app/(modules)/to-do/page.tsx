import Empty from '@/components/empty';
import { getLists } from './action';
import ListContainer from './_components/listContainer';

const Todo = async () => {
  const lists = await getLists(11);

  if (!lists)
    return (
      <div className="flex flex-1">
        <Empty text="No lists found. + Add a new list." />
      </div>
    );

  return (
    <div>
      <div className="p-4 border-b border-ash/10">
        <h1 className="text-xl font-semibold">Lists</h1>
      </div>
      <div className="p-4 overflow-x-auto">
        <ListContainer lists={lists} />
      </div>
    </div>
  );
};

export default Todo;
