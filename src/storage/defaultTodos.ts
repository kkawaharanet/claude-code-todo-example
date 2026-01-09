import { Todo } from '../types';

export function getDefaultTodos(): Todo[] {
  return [
    {
      id: '1',
      title: 'サンプルTODO',
      description: 'これはサンプルのTODOです',
      status: '新規',
      assignee: '山田太郎',
      dueDate: '2026-01-10',
    },
  ];
}
