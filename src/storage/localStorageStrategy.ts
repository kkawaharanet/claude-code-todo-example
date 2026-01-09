import { Todo } from '../types';
import { StorageStrategy } from './types';
import { getDefaultTodos } from './defaultTodos';

const STORAGE_KEY = 'todos';

export class LocalStorageStrategy implements StorageStrategy {
  load(): Todo[] {
    try {
      const storedTodos = localStorage.getItem(STORAGE_KEY);
      if (storedTodos) {
        return JSON.parse(storedTodos);
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
    }
    return getDefaultTodos();
  }

  save(todos: Todo[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }
}
