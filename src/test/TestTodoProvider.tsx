import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Todo } from '../types';

interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  getTodoById: (id: string) => Todo | undefined;
}

const TestTodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTestTodos = () => {
  const context = useContext(TestTodoContext);
  if (!context) {
    throw new Error('useTestTodos must be used within a TestTodoProvider');
  }
  return context;
};

interface TestTodoProviderProps {
  children: ReactNode;
  initialTodos?: Todo[];
}

export const TestTodoProvider: React.FC<TestTodoProviderProps> = ({ children, initialTodos }) => {
  const defaultTodos: Todo[] = initialTodos ?? [
    {
      id: '1',
      title: 'サンプルTODO',
      description: 'これはサンプルのTODOです',
      status: '新規',
      assignee: '山田太郎',
      dueDate: '2026-01-10',
    },
  ];

  const [todos, setTodos] = useState<Todo[]>(defaultTodos);

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
    <TestTodoContext.Provider value={{ todos, addTodo, updateTodo, deleteTodo, getTodoById }}>
      {children}
    </TestTodoContext.Provider>
  );
};
