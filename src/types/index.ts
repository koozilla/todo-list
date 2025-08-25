export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  due_date?: string
  is_completed: boolean
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  due_date?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  due_date?: string
  is_completed?: boolean
}

export interface User {
  id: string
  email: string
  created_at: string
}

export type TaskFilter = 'all' | 'pending' | 'completed'
