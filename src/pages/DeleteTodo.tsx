import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTodos } from '../TodoContext';
import { Todo } from '../types';
import Button from '../components/Button';

const DeleteTodo: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getTodoById, deleteTodo } = useTodos();
  const [todo, setTodo] = useState<Todo | null>(null);

  useEffect(() => {
    if (id) {
      const foundTodo = getTodoById(id);
      if (foundTodo) {
        setTodo(foundTodo);
      } else {
        navigate('/');
      }
    }
  }, [id, getTodoById, navigate]);

  const handleDelete = () => {
    if (id) {
      deleteTodo(id);
      navigate('/');
    }
  };

  if (!todo) {
    return <div className="w-full max-w-screen-xl mx-auto p-5">読み込み中...</div>;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto p-5">
      <h1 className="mb-6 text-3xl text-slate-700">TODO 削除確認</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-2xl mx-auto">
        <p className="mb-5 font-medium text-rose-600">以下のTODOを削除してもよろしいですか?</p>

        <div className="bg-gray-50 p-4 rounded mb-5">
          <div className="flex mb-2 last:mb-0">
            <span className="font-semibold min-w-[100px] text-gray-700">題名:</span>
            <span className="text-gray-600">{todo.title}</span>
          </div>
          <div className="flex mb-2 last:mb-0">
            <span className="font-semibold min-w-[100px] text-gray-700">説明:</span>
            <span className="text-gray-600">{todo.description || '(なし)'}</span>
          </div>
          <div className="flex mb-2 last:mb-0">
            <span className="font-semibold min-w-[100px] text-gray-700">状態:</span>
            <span className="text-gray-600">{todo.status}</span>
          </div>
          <div className="flex mb-2 last:mb-0">
            <span className="font-semibold min-w-[100px] text-gray-700">担当者:</span>
            <span className="text-gray-600">{todo.assignee || '(なし)'}</span>
          </div>
          <div className="flex mb-2 last:mb-0">
            <span className="font-semibold min-w-[100px] text-gray-700">期限:</span>
            <span className="text-gray-600">{todo.dueDate || '(なし)'}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="danger" onClick={handleDelete}>
            削除
          </Button>
          <Button onClick={() => navigate('/')}>
            キャンセル
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTodo;
