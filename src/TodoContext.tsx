import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Todo } from './types';

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
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      title: 'サンプルTODO',
      description: 'これはサンプルのTODOです',
      status: '新規',
      assignee: '山田太郎',
      dueDate: '2026-01-10',
    },
  ]);

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
