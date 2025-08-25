import { supabase } from './supabase'
import { Task, CreateTaskInput, UpdateTaskInput, TaskFilter } from '@/types'

export class TaskService {
  // Create a new task
  static async createTask(taskData: CreateTaskInput): Promise<Task | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating task:', error)
      return null
    }
  }

  // Get all tasks for the current user
  static async getTasks(filter: TaskFilter = 'all'): Promise<Task[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      console.log('Getting tasks for user:', user.id, 'with filter:', filter)

      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      // Apply filters
      if (filter === 'pending') {
        query = query.eq('is_completed', false)
      } else if (filter === 'completed') {
        query = query.eq('is_completed', true)
      }

      const { data, error } = await query

      console.log('Supabase response:', { data, error })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return []
    }
  }

  // Get a single task by ID
  static async getTask(id: string): Promise<Task | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching task:', error)
      return null
    }
  }

  // Update a task
  static async updateTask(id: string, updates: UpdateTaskInput): Promise<Task | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating task:', error)
      return null
    }
  }

  // Delete a task
  static async deleteTask(id: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting task:', error)
      return false
    }
  }

  // Toggle task completion status
  static async toggleTaskCompletion(id: string): Promise<Task | null> {
    try {
      const task = await this.getTask(id)
      if (!task) return null

      return await this.updateTask(id, {
        is_completed: !task.is_completed
      })
    } catch (error) {
      console.error('Error toggling task completion:', error)
      return null
    }
  }
}
