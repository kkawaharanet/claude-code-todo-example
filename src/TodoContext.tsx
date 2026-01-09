import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Todo } from './types';
import { createStorage, StorageStrategy } from './storage';

interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  getTodoById: (id: string) => Todo | undefined;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
  initialTodos?: Todo[];
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children, initialTodos }) => {
  const storageRef = useRef<StorageStrategy>(createStorage());

  const [todos, setTodos] = useState<Todo[]>(() => {
    if (initialTodos !== undefined) {
      return initialTodos;
    }
    return storageRef.current.load();
  });

  useEffect(() => {
    storageRef.current.save(todos);
  }, [todos]);

  const addTodo = (todo: Omit<Todo, 'id'>) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
    };
    setTodos([...todos, newTodo]);
  };

  const updateTodo = (id: string, updatedFields: Partial<Todo>) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, ...updatedFields } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getTodoById = (id: string) => {
    return todos.find(todo => todo.id === id);
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, updateTodo, deleteTodo, getTodoById }}>
      {children}
    </TodoContext.Provider>
  );
};
