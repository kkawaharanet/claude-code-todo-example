import React from 'react';
import { useTodos } from '../TodoContext';
import LinkButton from '../components/LinkButton';
import { Todo } from '../types';

const TodoList: React.FC = () => {
  const { todos } = useTodos();

  const getStatusClass = (status: Todo['status']) => {
    const statusClasses = {
      新規: 'bg-blue-500',
      実施中: 'bg-yellow-500',
      完了: 'bg-green-500',
      不要: 'bg-gray-500',
    };
    return statusClasses[status];
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-5">
      <h1 className="mb-6 text-3xl text-slate-700">TODO 一覧</h1>

      <LinkButton to="/create" variant="primary" className="mb-5">
        新規TODO作成
      </LinkButton>

      <div className="mt-5">
        {todos.length === 0 ? (
          <p>TODOがありません</p>
        ) : (
          <table className="w-full bg-white shadow-sm rounded-lg overflow-hidden border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left bg-gray-50 font-semibold text-gray-700 border-b border-gray-200">題名</th>
                <th className="p-3 text-left bg-gray-50 font-semibold text-gray-700 border-b border-gray-200">状態</th>
                <th className="p-3 text-left bg-gray-50 font-semibold text-gray-700 border-b border-gray-200">担当者</th>
                <th className="p-3 text-left bg-gray-50 font-semibold text-gray-700 border-b border-gray-200">期限</th>
                <th className="p-3 text-left bg-gray-50 font-semibold text-gray-700 border-b border-gray-200">操作</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200">{todo.title}</td>
                  <td className="p-3 border-b border-gray-200">
                    <span className={`px-3 py-1 rounded-xl text-xs text-white inline-block ${getStatusClass(todo.status)}`}>
                      {todo.status}
                    </span>
                  </td>
                  <td className="p-3 border-b border-gray-200">{todo.assignee}</td>
                  <td className="p-3 border-b border-gray-200">{todo.dueDate}</td>
                  <td className="p-3 border-b border-gray-200">
                    <LinkButton to={`/edit/${todo.id}`} size="small" className="mr-2">
                      編集
                    </LinkButton>
                    <LinkButton to={`/delete/${todo.id}`} variant="danger" size="small">
                      削除
                    </LinkButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TodoList;
