import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialTasks = [
  { id: '1', text: 'Buy groceries' },
  { id: '2', text: 'Walk the dog' },
  { id: '3', text: 'Read a book' },
];

const TodoList = () => {
  const [todo, setTodo] = useState(initialTasks);
  const [completed, setCompleted] = useState([]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Moving between lists
    if (source.droppableId !== destination.droppableId) {
      const sourceList = source.droppableId === 'todo' ? todo : completed;
      const destList = destination.droppableId === 'todo' ? todo : completed;
      const [movedTask] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, movedTask);

      setTodo([...todo]);
      setCompleted([...completed]);
    } else {
      // Reordering within the same list
      const list = source.droppableId === 'todo' ? [...todo] : [...completed];
      const [movedTask] = list.splice(source.index, 1);
      list.splice(destination.index, 0, movedTask);

      source.droppableId === 'todo' ? setTodo(list) : setCompleted(list);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-8">
        {/* To Do List */}
        <Droppable droppableId="todo">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="w-1/2 p-4 border rounded">
              <h2 className="font-bold text-lg mb-2">To Do</h2>
              {todo.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      className="p-2 my-1 bg-white border rounded shadow"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {task.text}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Completed List */}
        <Droppable droppableId="completed">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="w-1/2 p-4 border rounded bg-green-50">
              <h2 className="font-bold text-lg mb-2">Completed</h2>
              {completed.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      className="p-2 my-1 bg-gray-100 border rounded shadow"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {task.text}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default TodoList;
