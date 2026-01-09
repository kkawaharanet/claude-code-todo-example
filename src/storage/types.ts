import { Todo } from '../types';

export interface StorageStrategy {
  load(): Todo[];
  save(todos: Todo[]): void;
}
