import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './TodoContext';
import TodoList from './pages/TodoList';
import CreateTodo from './pages/CreateTodo';
import EditTodo from './pages/EditTodo';
import DeleteTodo from './pages/DeleteTodo';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TodoProvider>
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="/create" element={<CreateTodo />} />
          <Route path="/edit/:id" element={<EditTodo />} />
          <Route path="/delete/:id" element={<DeleteTodo />} />
        </Routes>
      </TodoProvider>
    </BrowserRouter>
  );
};

export default App;
