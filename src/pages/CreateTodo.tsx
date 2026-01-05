import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodos } from '../TodoContext';
import { TodoStatus } from '../types';
import Button from '../components/Button';

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
    <div className="max-w-7xl mx-auto p-5">
      <h1 className="mb-6 text-3xl text-slate-700">TODO 作成</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm max-w-2xl">
        <div className="mb-5">
          <label htmlFor="title" className="block mb-2 font-medium text-gray-700">題名 *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-2.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="description" className="block mb-2 font-medium text-gray-700">説明</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-2.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="status" className="block mb-2 font-medium text-gray-700">状態 *</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-2.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="新規">新規</option>
            <option value="実施中">実施中</option>
            <option value="完了">完了</option>
            <option value="不要">不要</option>
          </select>
        </div>

        <div className="mb-5">
          <label htmlFor="assignee" className="block mb-2 font-medium text-gray-700">担当者</label>
          <input
            type="text"
            id="assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            className="w-full px-2.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="dueDate" className="block mb-2 font-medium text-gray-700">期限</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-2.5 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-6 flex gap-2">
          <Button type="submit" variant="primary">
            作成
          </Button>
          <Button type="button" onClick={() => navigate('/')}>
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTodo;
