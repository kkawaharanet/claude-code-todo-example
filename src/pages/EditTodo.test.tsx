import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TodoProvider } from '../TodoContext';
import EditTodo from './EditTodo';
import { Todo } from '../types';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createWrapper = (initialTodos?: Todo[]) => {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={['/edit/1']}>
      <TodoProvider initialTodos={initialTodos}>
        <Routes>
          <Route path="/edit/:id" element={children} />
        </Routes>
      </TodoProvider>
    </MemoryRouter>
  );
};

const renderWithRouter = (todoId: string, initialTodos?: Todo[]) => {
  return render(
    <MemoryRouter initialEntries={[`/edit/${todoId}`]}>
      <TodoProvider initialTodos={initialTodos}>
        <Routes>
          <Route path="/edit/:id" element={<EditTodo />} />
        </Routes>
      </TodoProvider>
    </MemoryRouter>
  );
};

describe('EditTodo', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('初期表示', () => {
    it('タイトルが表示される', () => {
      const initialTodos: Todo[] = [
        { id: '1', title: 'テストTODO', description: '説明', status: '新規', assignee: '担当者', dueDate: '2026-01-10' }
      ];

      renderWithRouter('1', initialTodos);

      expect(screen.getByText('TODO 編集')).toBeInTheDocument();
    });

    it('既存のTODOデータがフォームに表示される', async () => {
      const initialTodos: Todo[] = [
        {
          id: '1',
          title: '既存TODO',
          description: '既存の説明',
          status: '実施中',
          assignee: '山田太郎',
          dueDate: '2026-02-01'
        }
      ];

      renderWithRouter('1', initialTodos);

      await waitFor(() => {
        expect((screen.getByLabelText('題名 *') as HTMLInputElement).value).toBe('既存TODO');
        expect((screen.getByLabelText('説明') as HTMLTextAreaElement).value).toBe('既存の説明');
        expect((screen.getByLabelText('状態 *') as HTMLSelectElement).value).toBe('実施中');
        expect((screen.getByLabelText('担当者') as HTMLInputElement).value).toBe('山田太郎');
        expect((screen.getByLabelText('期限') as HTMLInputElement).value).toBe('2026-02-01');
      });
    });

    it('更新ボタンとキャンセルボタンが表示される', () => {
      const initialTodos: Todo[] = [
        { id: '1', title: 'テストTODO', description: '', status: '新規', assignee: '', dueDate: '' }
      ];

      renderWithRouter('1', initialTodos);

      expect(screen.getByRole('button', { name: '更新' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    });

    it('存在しないIDの場合、ホームにリダイレクトされる', async () => {
      renderWithRouter('999', []);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('フォームの操作', () => {
    const defaultTodo: Todo[] = [
      {
        id: '1',
        title: '既存TODO',
        description: '既存の説明',
        status: '新規',
        assignee: '山田太郎',
        dueDate: '2026-01-10'
      }
    ];

    it('題名を変更できる', async () => {
      const user = userEvent.setup();
      renderWithRouter('1', defaultTodo);

      await waitFor(() => {
        expect((screen.getByLabelText('題名 *') as HTMLInputElement).value).toBe('既存TODO');
      });

      const titleInput = screen.getByLabelText('題名 *');
      await user.clear(titleInput);
      await user.type(titleInput, '変更後のTODO');

      expect((titleInput as HTMLInputElement).value).toBe('変更後のTODO');
    });

    it('説明を変更できる', async () => {
      const user = userEvent.setup();
      renderWithRouter('1', defaultTodo);

      await waitFor(() => {
        expect((screen.getByLabelText('説明') as HTMLTextAreaElement).value).toBe('既存の説明');
      });

      const descriptionInput = screen.getByLabelText('説明');
      await user.clear(descriptionInput);
      await user.type(descriptionInput, '新しい説明');

      expect((descriptionInput as HTMLTextAreaElement).value).toBe('新しい説明');
    });

    it('状態を変更できる', async () => {
      const user = userEvent.setup();
      renderWithRouter('1', defaultTodo);

      await waitFor(() => {
        expect((screen.getByLabelText('状態 *') as HTMLSelectElement).value).toBe('新規');
      });

      const statusSelect = screen.getByLabelText('状態 *');
      await user.selectOptions(statusSelect, '完了');

      expect((statusSelect as HTMLSelectElement).value).toBe('完了');
    });

    it('担当者を変更できる', async () => {
      const user = userEvent.setup();
      renderWithRouter('1', defaultTodo);

      await waitFor(() => {
        expect((screen.getByLabelText('担当者') as HTMLInputElement).value).toBe('山田太郎');
      });

      const assigneeInput = screen.getByLabelText('担当者');
      await user.clear(assigneeInput);
      await user.type(assigneeInput, '佐藤次郎');

      expect((assigneeInput as HTMLInputElement).value).toBe('佐藤次郎');
    });

    it('期限を変更できる', async () => {
      const user = userEvent.setup();
      renderWithRouter('1', defaultTodo);

      await waitFor(() => {
        expect((screen.getByLabelText('期限') as HTMLInputElement).value).toBe('2026-01-10');
      });

      const dueDateInput = screen.getByLabelText('期限');
      await user.clear(dueDateInput);
      await user.type(dueDateInput, '2026-12-31');

      expect((dueDateInput as HTMLInputElement).value).toBe('2026-12-31');
    });

    it('更新ボタンをクリックするとTODOが更新されてホームに戻る', async () => {
      const user = userEvent.setup();
      renderWithRouter('1', defaultTodo);

      await waitFor(() => {
        expect((screen.getByLabelText('題名 *') as HTMLInputElement).value).toBe('既存TODO');
      });

      const titleInput = screen.getByLabelText('題名 *');
      await user.clear(titleInput);
      await user.type(titleInput, '更新されたTODO');

      const updateButton = screen.getByRole('button', { name: '更新' });
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('キャンセルボタンをクリックするとホームに戻る', async () => {
      const user = userEvent.setup();
      renderWithRouter('1', defaultTodo);

      await waitFor(() => {
        expect(screen.getByLabelText('題名 *')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
      await user.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('フォーム送信', () => {
    it('すべての項目を変更してTODOを更新できる', async () => {
      const user = userEvent.setup();

      const initialTodos: Todo[] = [
        {
          id: '1',
          title: '元のタイトル',
          description: '元の説明',
          status: '新規',
          assignee: '元の担当者',
          dueDate: '2026-01-01'
        }
      ];

      renderWithRouter('1', initialTodos);

      await waitFor(() => {
        expect((screen.getByLabelText('題名 *') as HTMLInputElement).value).toBe('元のタイトル');
      });

      await user.clear(screen.getByLabelText('題名 *'));
      await user.type(screen.getByLabelText('題名 *'), '新しいタイトル');
      await user.clear(screen.getByLabelText('説明'));
      await user.type(screen.getByLabelText('説明'), '新しい説明');
      await user.selectOptions(screen.getByLabelText('状態 *'), '完了');
      await user.clear(screen.getByLabelText('担当者'));
      await user.type(screen.getByLabelText('担当者'), '新しい担当者');
      await user.clear(screen.getByLabelText('期限'));
      await user.type(screen.getByLabelText('期限'), '2026-12-31');

      const updateButton = screen.getByRole('button', { name: '更新' });
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });
});
