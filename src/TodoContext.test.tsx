import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { TodoProvider, useTodos } from './TodoContext';
import { ReactNode } from 'react';

describe('TodoContext', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <TodoProvider>{children}</TodoProvider>
  );

  describe('useTodos', () => {
    it('TodoProvider外で使用するとエラーをスローする', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useTodos());
      }).toThrow('useTodos must be used within a TodoProvider');

      consoleSpy.mockRestore();
    });

    it('TodoProvider内で使用すると正常に動作する', () => {
      const { result } = renderHook(() => useTodos(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.todos).toBeDefined();
      expect(result.current.addTodo).toBeDefined();
      expect(result.current.updateTodo).toBeDefined();
      expect(result.current.deleteTodo).toBeDefined();
      expect(result.current.getTodoById).toBeDefined();
    });
  });

  describe('TodoProvider', () => {
    it('初期状態: デフォルトTODOを表示する', () => {
      const { result } = renderHook(() => useTodos(), { wrapper });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0]).toEqual({
        id: '1',
        title: 'サンプルTODO',
        description: 'これはサンプルのTODOです',
        status: '新規',
        assignee: '山田太郎',
        dueDate: '2026-01-10',
      });
    });

    it('addTodo: 新しいTODOを追加できる', () => {
      const { result } = renderHook(() => useTodos(), { wrapper });

      const newTodo = {
        title: '新しいTODO',
        description: '説明',
        status: '新規' as const,
        assignee: '担当者',
        dueDate: '2026-03-01',
      };

      act(() => {
        result.current.addTodo(newTodo);
      });

      expect(result.current.todos).toHaveLength(2);
      expect(result.current.todos[1]).toMatchObject(newTodo);
      expect(result.current.todos[1].id).toBeDefined();
    });

    it('updateTodo: 既存のTODOを更新できる', () => {
      const { result } = renderHook(() => useTodos(), { wrapper });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.updateTodo(todoId, { title: '更新されたタイトル', status: '完了' });
      });

      expect(result.current.todos[0].title).toBe('更新されたタイトル');
      expect(result.current.todos[0].status).toBe('完了');
    });

    it('updateTodo: 存在しないIDの場合は何も変更しない', () => {
      const { result } = renderHook(() => useTodos(), { wrapper });

      const initialLength = result.current.todos.length;

      act(() => {
        result.current.updateTodo('non-existent-id', { title: '更新' });
      });

      expect(result.current.todos).toHaveLength(initialLength);
      expect(result.current.todos[0].title).toBe('サンプルTODO');
    });

    it('deleteTodo: TODOを削除できる', () => {
      const { result } = renderHook(() => useTodos(), { wrapper });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.deleteTodo(todoId);
      });

      expect(result.current.todos).toHaveLength(0);
    });

    it('deleteTodo: 存在しないIDの場合は何も削除しない', () => {
      const { result } = renderHook(() => useTodos(), { wrapper });

      const initialLength = result.current.todos.length;

      act(() => {
        result.current.deleteTodo('non-existent-id');
      });

      expect(result.current.todos).toHaveLength(initialLength);
    });

    it('getTodoById: 指定したIDのTODOを取得できる', () => {
      const { result } = renderHook(() => useTodos(), { wrapper });

      const todoId = result.current.todos[0].id;
      const todo = result.current.getTodoById(todoId);

      expect(todo).toBeDefined();
      expect(todo?.id).toBe(todoId);
    });

    it('getTodoById: 存在しないIDの場合はundefinedを返す', () => {
      const { result } = renderHook(() => useTodos(), { wrapper });

      const todo = result.current.getTodoById('non-existent-id');

      expect(todo).toBeUndefined();
    });
  });
});
