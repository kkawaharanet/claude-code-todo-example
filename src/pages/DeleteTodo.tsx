import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTodos } from '../TodoContext';
import { Todo } from '../types';

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
    return <div className="container">読み込み中...</div>;
  }

  return (
    <div className="container">
      <h1>TODO 削除確認</h1>
      
      <div className="delete-confirmation">
        <p>以下のTODOを削除してもよろしいですか?</p>
        
        <div className="todo-detail">
          <div className="detail-row">
            <span className="detail-label">題名:</span>
            <span className="detail-value">{todo.title}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">説明:</span>
            <span className="detail-value">{todo.description || '(なし)'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">状態:</span>
            <span className="detail-value">{todo.status}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">担当者:</span>
            <span className="detail-value">{todo.assignee || '(なし)'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">期限:</span>
            <span className="detail-value">{todo.dueDate || '(なし)'}</span>
          </div>
        </div>

        <div className="form-actions">
          <button className="button button-danger" onClick={handleDelete}>
            削除
          </button>
          <button className="button" onClick={() => navigate('/')}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTodo;
