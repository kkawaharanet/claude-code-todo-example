import React from 'react';
import { Link } from 'react-router-dom';
import { useTodos } from '../TodoContext';
import { Todo } from '../types';

const TodoList: React.FC = () => {
  const { todos } = useTodos();

  const getStatusColor = (status: Todo['status']) => {
    switch (status) {
      case '新規': return '#3b82f6';
      case '実施中': return '#eab308';
      case '完了': return '#22c55e';
      case '不要': return '#6b7280';
    }
  };

  return (
    <div className="container">
      <h1>TODO 一覧</h1>
      
      <Link to="/create" className="button button-primary">
        新規TODO作成
      </Link>

      <div className="todo-list">
        {todos.length === 0 ? (
          <p>TODOがありません</p>
        ) : (
          <table className="todo-table">
            <thead>
              <tr>
                <th>題名</th>
                <th>状態</th>
                <th>担当者</th>
                <th>期限</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id}>
                  <td>{todo.title}</td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(todo.status) }}
                    >
                      {todo.status}
                    </span>
                  </td>
                  <td>{todo.assignee}</td>
                  <td>{todo.dueDate}</td>
                  <td>
                    <Link to={`/edit/${todo.id}`} className="button button-small">
                      編集
                    </Link>
                    <Link to={`/delete/${todo.id}`} className="button button-small button-danger">
                      削除
                    </Link>
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
