import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TodoProvider } from '../TodoContext';
import TodoList from './TodoList';
import { Todo } from '../types';

describe('TodoList', () => {
  const createWrapper = (initialTodos?: Todo[]) => {
    return ({ children }: { children: React.ReactNode }) => (
      <BrowserRouter>
        <TodoProvider initialTodos={initialTodos}>{children}</TodoProvider>
      </BrowserRouter>
    );
  };

  const defaultWrapper = createWrapper();

  describe('初期表示', () => {
    it('タイトルが表示される', () => {
      render(<TodoList />, { wrapper: defaultWrapper });

      expect(screen.getByText('TODO 一覧')).toBeInTheDocument();
    });

    it('新規TODO作成ボタンが表示される', () => {
      render(<TodoList />, { wrapper: defaultWrapper });

      const createButton = screen.getByRole('link', { name: '新規TODO作成' });
      expect(createButton).toBeInTheDocument();
      expect(createButton).toHaveAttribute('href', '/create');
    });

    it('デフォルトTODOが表示される', () => {
      render(<TodoList />, { wrapper: defaultWrapper });

      expect(screen.getByText('サンプルTODO')).toBeInTheDocument();
      expect(screen.getByText('新規')).toBeInTheDocument();
      expect(screen.getByText('山田太郎')).toBeInTheDocument();
      expect(screen.getByText('2026-01-10')).toBeInTheDocument();
    });

    it('テーブルのヘッダーが正しく表示される', () => {
      render(<TodoList />, { wrapper: defaultWrapper });

      expect(screen.getByText('題名')).toBeInTheDocument();
      expect(screen.getByText('状態')).toBeInTheDocument();
      expect(screen.getByText('担当者')).toBeInTheDocument();
      expect(screen.getByText('期限')).toBeInTheDocument();
      expect(screen.getByText('操作')).toBeInTheDocument();
    });

    it('編集ボタンと削除ボタンが表示される', () => {
      render(<TodoList />, { wrapper: defaultWrapper });

      const editButton = screen.getByRole('link', { name: '編集' });
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveAttribute('href', '/edit/1');

      const deleteButton = screen.getByRole('link', { name: '削除' });
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveAttribute('href', '/delete/1');
    });

    it('TODOがない場合、メッセージが表示される', () => {
      const wrapper = createWrapper([]);
      render(<TodoList />, { wrapper });

      expect(screen.getByText('TODOがありません')).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });

  describe('状態の表示', () => {
    it('「新規」状態のTODOは青色で表示される', () => {
      const wrapper = createWrapper([
        { id: '1', title: 'テスト', description: '', status: '新規', assignee: '', dueDate: '' }
      ]);
      render(<TodoList />, { wrapper });

      const statusBadge = screen.getByText('新規');
      expect(statusBadge).toHaveClass('bg-blue-500');
    });

    it('「実施中」状態のTODOは黄色で表示される', () => {
      const wrapper = createWrapper([
        { id: '1', title: 'テスト', description: '', status: '実施中', assignee: '', dueDate: '' }
      ]);
      render(<TodoList />, { wrapper });

      const statusBadge = screen.getByText('実施中');
      expect(statusBadge).toHaveClass('bg-yellow-500');
    });

    it('「完了」状態のTODOは緑色で表示される', () => {
      const wrapper = createWrapper([
        { id: '1', title: 'テスト', description: '', status: '完了', assignee: '', dueDate: '' }
      ]);
      render(<TodoList />, { wrapper });

      const statusBadge = screen.getByText('完了');
      expect(statusBadge).toHaveClass('bg-green-500');
    });

    it('「不要」状態のTODOは灰色で表示される', () => {
      const wrapper = createWrapper([
        { id: '1', title: 'テスト', description: '', status: '不要', assignee: '', dueDate: '' }
      ]);
      render(<TodoList />, { wrapper });

      const statusBadge = screen.getByText('不要');
      expect(statusBadge).toHaveClass('bg-gray-500');
    });
  });

  describe('複数TODOの表示', () => {
    it('複数のTODOが表示される', () => {
      const wrapper = createWrapper([
        { id: '1', title: 'TODO 1', description: '', status: '新規', assignee: '担当者1', dueDate: '2026-01-10' },
        { id: '2', title: 'TODO 2', description: '', status: '実施中', assignee: '担当者2', dueDate: '2026-01-20' },
        { id: '3', title: 'TODO 3', description: '', status: '完了', assignee: '担当者3', dueDate: '2026-01-30' },
      ]);
      render(<TodoList />, { wrapper });

      expect(screen.getByText('TODO 1')).toBeInTheDocument();
      expect(screen.getByText('TODO 2')).toBeInTheDocument();
      expect(screen.getByText('TODO 3')).toBeInTheDocument();
      expect(screen.getByText('担当者1')).toBeInTheDocument();
      expect(screen.getByText('担当者2')).toBeInTheDocument();
      expect(screen.getByText('担当者3')).toBeInTheDocument();
    });
  });
});
