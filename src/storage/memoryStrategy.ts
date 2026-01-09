import { Todo } from '../types';
import { StorageStrategy } from './types';
import { getDefaultTodos } from './defaultTodos';

export class MemoryStrategy implements StorageStrategy {
  load(): Todo[] {
    return getDefaultTodos();
  }

  save(_todos: Todo[]): void {
    // メモリストレージでは永続化しない
  }
}
