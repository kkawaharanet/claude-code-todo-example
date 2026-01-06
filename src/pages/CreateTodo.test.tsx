import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { TodoProvider } from '../TodoContext';
import CreateTodo from './CreateTodo';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CreateTodo', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <TodoProvider>{children}</TodoProvider>
    </BrowserRouter>
  );

  describe('初期表示', () => {
    it('タイトルが表示される', () => {
      render(<CreateTodo />, { wrapper });

      expect(screen.getByText('TODO 作成')).toBeInTheDocument();
    });

    it('すべてのフォーム項目が表示される', () => {
      render(<CreateTodo />, { wrapper });

      expect(screen.getByLabelText('題名 *')).toBeInTheDocument();
      expect(screen.getByLabelText('説明')).toBeInTheDocument();
      expect(screen.getByLabelText('状態 *')).toBeInTheDocument();
      expect(screen.getByLabelText('担当者')).toBeInTheDocument();
      expect(screen.getByLabelText('期限')).toBeInTheDocument();
    });

    it('作成ボタンとキャンセルボタンが表示される', () => {
      render(<CreateTodo />, { wrapper });

      expect(screen.getByRole('button', { name: '作成' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    });

    it('状態の初期値は「新規」である', () => {
      render(<CreateTodo />, { wrapper });

      const statusSelect = screen.getByLabelText('状態 *') as HTMLSelectElement;
      expect(statusSelect.value).toBe('新規');
    });

    it('すべての状態オプションが表示される', () => {
      render(<CreateTodo />, { wrapper });

      expect(screen.getByRole('option', { name: '新規' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '実施中' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '完了' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: '不要' })).toBeInTheDocument();
    });
  });

  describe('フォームの操作', () => {
    it('題名を入力できる', async () => {
      const user = userEvent.setup();
      render(<CreateTodo />, { wrapper });

      const titleInput = screen.getByLabelText('題名 *') as HTMLInputElement;
      await user.type(titleInput, '新しいTODO');

      expect(titleInput.value).toBe('新しいTODO');
    });

    it('説明を入力できる', async () => {
      const user = userEvent.setup();
      render(<CreateTodo />, { wrapper });

      const descriptionInput = screen.getByLabelText('説明') as HTMLTextAreaElement;
      await user.type(descriptionInput, 'これは説明です');

      expect(descriptionInput.value).toBe('これは説明です');
    });

    it('状態を変更できる', async () => {
      const user = userEvent.setup();
      render(<CreateTodo />, { wrapper });

      const statusSelect = screen.getByLabelText('状態 *') as HTMLSelectElement;
      await user.selectOptions(statusSelect, '実施中');

      expect(statusSelect.value).toBe('実施中');
    });

    it('担当者を入力できる', async () => {
      const user = userEvent.setup();
      render(<CreateTodo />, { wrapper });

      const assigneeInput = screen.getByLabelText('担当者') as HTMLInputElement;
      await user.type(assigneeInput, '山田太郎');

      expect(assigneeInput.value).toBe('山田太郎');
    });

    it('期限を入力できる', async () => {
      const user = userEvent.setup();
      render(<CreateTodo />, { wrapper });

      const dueDateInput = screen.getByLabelText('期限') as HTMLInputElement;
      await user.type(dueDateInput, '2026-12-31');

      expect(dueDateInput.value).toBe('2026-12-31');
    });

    it('作成ボタンをクリックするとTODOが作成されてホームに戻る', async () => {
      const user = userEvent.setup();
      render(<CreateTodo />, { wrapper });

      const titleInput = screen.getByLabelText('題名 *');
      await user.type(titleInput, '新しいTODO');

      const createButton = screen.getByRole('button', { name: '作成' });
      await user.click(createButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      const todos = JSON.parse(localStorage.getItem('todos') || '[]');
      expect(todos.length).toBeGreaterThan(0);
      expect(todos[todos.length - 1].title).toBe('新しいTODO');
    });

    it('キャンセルボタンをクリックするとホームに戻る', async () => {
      const user = userEvent.setup();
      render(<CreateTodo />, { wrapper });

      const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
      await user.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('題名が空の場合、送信できない', async () => {
      const user = userEvent.setup();
      render(<CreateTodo />, { wrapper });

      const createButton = screen.getByRole('button', { name: '作成' });
      await user.click(createButton);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('フォーム送信', () => {
    it('すべての項目を入力してTODOを作成できる', async () => {
      const user = userEvent.setup();
      render(<CreateTodo />, { wrapper });

      await user.type(screen.getByLabelText('題名 *'), '新規タスク');
      await user.type(screen.getByLabelText('説明'), 'タスクの説明');
      await user.selectOptions(screen.getByLabelText('状態 *'), '実施中');
      await user.type(screen.getByLabelText('担当者'), '佐藤次郎');
      await user.type(screen.getByLabelText('期限'), '2026-06-15');

      const createButton = screen.getByRole('button', { name: '作成' });
      await user.click(createButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      const todos = JSON.parse(localStorage.getItem('todos') || '[]');
      const newTodo = todos[todos.length - 1];
      expect(newTodo.title).toBe('新規タスク');
      expect(newTodo.description).toBe('タスクの説明');
      expect(newTodo.status).toBe('実施中');
      expect(newTodo.assignee).toBe('佐藤次郎');
      expect(newTodo.dueDate).toBe('2026-06-15');
    });
  });
});
