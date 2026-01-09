import { StorageStrategy } from './types';
import { LocalStorageStrategy } from './localStorageStrategy';
import { MemoryStrategy } from './memoryStrategy';

export function createStorage(): StorageStrategy {
  const type = import.meta.env.VITE_STORAGE_TYPE || 'localStorage';

  switch (type) {
    case 'memory':
      return new MemoryStrategy();
    case 'localStorage':
    default:
      return new LocalStorageStrategy();
  }
}

export type { StorageStrategy } from './types';
