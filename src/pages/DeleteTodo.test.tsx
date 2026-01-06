import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TodoProvider } from '../TodoContext';
import DeleteTodo from './DeleteTodo';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('DeleteTodo', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  const renderWithRouter = (todoId: string) => {
    return render(
      <MemoryRouter initialEntries={[`/delete/${todoId}`]}>
        <TodoProvider>
          <Routes>
            <Route path="/delete/:id" element={<DeleteTodo />} />
          </Routes>
        </TodoProvider>
      </MemoryRouter>
    );
  };

  describe('初期表示', () => {
    it('タイトルが表示される', async () => {
      localStorage.setItem('todos', JSON.stringify([
        { id: '1', title: 'テストTODO', description: '説明', status: '新規', assignee: '担当者', dueDate: '2026-01-10' }
      ]));

      renderWithRouter('1');

      await waitFor(() => {
        expect(screen.getByText('TODO 削除確認')).toBeInTheDocument();
      });
    });

    it('削除確認メッセージが表示される', async () => {
      localStorage.setItem('todos', JSON.stringify([
        { id: '1', title: 'テストTODO', description: '', status: '新規', assignee: '', dueDate: '' }
      ]));

      renderWithRouter('1');

      await waitFor(() => {
        expect(screen.getByText('以下のTODOを削除してもよろしいですか?')).toBeInTheDocument();
      });
    });

    it('TODOの詳細情報が表示される', async () => {
      localStorage.setItem('todos', JSON.stringify([
        {
          id: '1',
          title: '削除対象TODO',
          description: 'これは削除されます',
          status: '実施中',
          assignee: '山田太郎',
          dueDate: '2026-02-01'
        }
      ]));

      renderWithRouter('1');

      await waitFor(() => {
        expect(screen.getByText('削除対象TODO')).toBeInTheDocument();
        expect(screen.getByText('これは削除されます')).toBeInTheDocument();
        expect(screen.getByText('実施中')).toBeInTheDocument();
        expect(screen.getByText('山田太郎')).toBeInTheDocument();
        expect(screen.getByText('2026-02-01')).toBeInTheDocument();
      });
    });

    it('説明が空の場合、「(なし)」と表示される', async () => {
      localStorage.setItem('todos', JSON.stringify([
        { id: '1', title: 'テスト', description: '', status: '新規', assignee: '', dueDate: '' }
      ]));

      renderWithRouter('1');

      await waitFor(() => {
        const descriptions = screen.getAllByText('(なし)');
        expect(descriptions.length).toBeGreaterThan(0);
      });
    });

    it('担当者が空の場合、「(なし)」と表示される', async () => {
      localStorage.setItem('todos', JSON.stringify([
        { id: '1', title: 'テスト', description: 'あり', status: '新規', assignee: '', dueDate: '2026-01-10' }
      ]));

      renderWithRouter('1');

      await waitFor(() => {
        const noneTexts = screen.getAllByText('(なし)');
        expect(noneTexts.length).toBeGreaterThan(0);
      });
    });

    it('期限が空の場合、「(なし)」と表示される', async () => {
      localStorage.setItem('todos', JSON.stringify([
        { id: '1', title: 'テスト', description: 'あり', status: '新規', assignee: '担当者', dueDate: '' }
      ]));

      renderWithRouter('1');

      await waitFor(() => {
        const noneTexts = screen.getAllByText('(なし)');
        expect(noneTexts.length).toBeGreaterThan(0);
      });
    });

    it('削除ボタンとキャンセルボタンが表示される', async () => {
      localStorage.setItem('todos', JSON.stringify([
        { id: '1', title: 'テスト', description: '', status: '新規', assignee: '', dueDate: '' }
      ]));

      renderWithRouter('1');

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
      });
    });

    it('存在しないIDの場合、ホームにリダイレクトされる', async () => {
      localStorage.setItem('todos', JSON.stringify([]));

      renderWithRouter('999');

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('TODOが見つからない間は「読み込み中...」と表示される', () => {
      localStorage.setItem('todos', JSON.stringify([
        { id: '1', title: 'テスト', description: '', status: '新規', assignee: '', dueDate: '' }
      ]));

      renderWithRouter('999');

      expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    });
  });

  describe('削除操作', () => {
    it('削除ボタンをクリックするとTODOが削除されてホームに戻る', async () => {
      const user = userEvent.setup();

      localStorage.setItem('todos', JSON.stringify([
        { id: '1', title: '削除対象', description: '', status: '新規', assignee: '', dueDate: '' },
        { id: '2', title: '残るTODO', description: '', status: '新規', assignee: '', dueDate: '' }
      ]));

      renderWithRouter('1');

      await waitFor(() => {
        expect(screen.getByText('削除対象')).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: '削除' });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      const todos = JSON.parse(localStorage.getItem('todos') || '[]');
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe('残るTODO');
    });

    it('キャンセルボタンをクリックするとホームに戻る', async () => {
      const user = userEvent.setup();

      localStorage.setItem('todos', JSON.stringify([
        { id: '1', title: 'テスト', description: '', status: '新規', assignee: '', dueDate: '' }
      ]));

      renderWithRouter('1');

      await waitFor(() => {
        expect(screen.getByText('テスト')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
      await user.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith('/');

      // TODOは削除されていないことを確認
      const todos = JSON.parse(localStorage.getItem('todos') || '[]');
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe('テスト');
    });
  });

  describe('複数TODOの削除', () => {
    it('複数のTODOがある場合、指定したTODOのみ削除される', async () => {
      const user = userEvent.setup();

      localStorage.setItem('todos', JSON.stringify([
        { id: '1', title: 'TODO 1', description: '', status: '新規', assignee: '', dueDate: '' },
        { id: '2', title: 'TODO 2', description: '', status: '新規', assignee: '', dueDate: '' },
        { id: '3', title: 'TODO 3', description: '', status: '新規', assignee: '', dueDate: '' }
      ]));

      renderWithRouter('2');

      await waitFor(() => {
        expect(screen.getByText('TODO 2')).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: '削除' });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });

      const todos = JSON.parse(localStorage.getItem('todos') || '[]');
      expect(todos).toHaveLength(2);
      expect(todos[0].title).toBe('TODO 1');
      expect(todos[1].title).toBe('TODO 3');
    });
  });
});
