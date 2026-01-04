export type TodoStatus = '新規' | '実施中' | '完了' | '不要';

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  assignee: string;
  dueDate: string;
}
