import ListContainer from './_components/listContainer';

const Todo = () => {
  return (
    <div>
      <div className="p-4 border-b border-ash/10">
        <h1 className="text-xl font-semibold">Lists</h1>
      </div>
      <div className="p-4 overflow-x-auto">
        <ListContainer />
      </div>
    </div>
  );
};

export default Todo;
