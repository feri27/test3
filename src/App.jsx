import React, { useState, useEffect } from 'react';
    import Calendar from 'react-calendar';
    import { format } from 'date-fns';
    import { v4 as uuidv4 } from 'uuid';
    import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/solid';

    function App() {
      const [date, setDate] = useState(new Date());
      const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
          return JSON.parse(savedTodos);
        } else {
          return {};
        }
      });
      const [newTodo, setNewTodo] = useState('');

      useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
      }, [todos]);

      const handleDateChange = (newDate) => {
        setDate(newDate);
      };

      const handleAddTodo = () => {
        if (newTodo.trim() === '') return;
        const formattedDate = format(date, 'yyyy-MM-dd');
        const newTodoItem = {
          id: uuidv4(),
          text: newTodo,
          completed: false,
        };
        setTodos((prevTodos) => ({
          ...prevTodos,
          [formattedDate]: [...(prevTodos[formattedDate] || []), newTodoItem],
        }));
        setNewTodo('');
      };

      const handleToggleComplete = (id) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        setTodos((prevTodos) => {
          const updatedTodos = (prevTodos[formattedDate] || []).map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          );
          return { ...prevTodos, [formattedDate]: updatedTodos };
        });
      };

      const handleDeleteTodo = (id) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        setTodos((prevTodos) => {
          const updatedTodos = (prevTodos[formattedDate] || []).filter((todo) => todo.id !== id);
          return { ...prevTodos, [formattedDate]: updatedTodos };
        });
      };

      const formattedDate = format(date, 'yyyy-MM-dd');
      const todosForSelectedDate = todos[formattedDate] || [];

      return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
          <h1 className="text-3xl font-bold mb-4">Todo App</h1>
          <div className="flex flex-col md:flex-row w-full max-w-4xl">
            <div className="md:w-1/3 p-4">
              <Calendar value={date} onChange={handleDateChange} />
            </div>
            <div className="md:w-2/3 p-4">
              <div className="mb-4">
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  placeholder="Add a new todo"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 w-full"
                  onClick={handleAddTodo}
                >
                  Add Todo
                </button>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Todos for {format(date, 'MMMM dd, yyyy')}
              </h2>
              {todosForSelectedDate.length === 0 ? (
                <p>No todos for this date.</p>
              ) : (
                <ul className="space-y-2">
                  {todosForSelectedDate.map((todo) => (
                    <li
                      key={todo.id}
                      className="flex items-center justify-between bg-white p-3 rounded shadow"
                    >
                      <div className="flex items-center">
                        <button onClick={() => handleToggleComplete(todo.id)}>
                          {todo.completed ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <span className="h-5 w-5 border border-gray-400 rounded-full mr-2 inline-block"></span>
                          )}
                        </button>
                        <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                          {todo.text}
                        </span>
                      </div>
                      <button onClick={() => handleDeleteTodo(todo.id)}>
                        <TrashIcon className="h-5 w-5 text-red-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      );
    }

    export default App;
