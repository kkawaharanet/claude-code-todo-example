import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodos } from '../TodoContext';
import { TodoStatus } from '../types';

const CreateTodo: React.FC = () => {
  const navigate = useNavigate();
  const { addTodo } = useTodos();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '新規' as TodoStatus,
    assignee: '',
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo(formData);
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <h1>TODO 作成</h1>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group">
          <label htmlFor="title">題名 *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">説明</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">状態 *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="新規">新規</option>
            <option value="実施中">実施中</option>
            <option value="完了">完了</option>
            <option value="不要">不要</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="assignee">担当者</label>
          <input
            type="text"
            id="assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">期限</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="button button-primary">
            作成
          </button>
          <button type="button" className="button" onClick={() => navigate('/')}>
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTodo;
