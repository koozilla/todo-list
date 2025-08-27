import { createBrowserClient } from '@supabase/ssr'
import { Task, CreateTaskInput, UpdateTaskInput, TaskFilter } from '@/types'

// Create a browser client for proper cookie handling
const getBrowserClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export class TaskService {
  // Create a new task
  static async createTask(taskData: CreateTaskInput): Promise<Task | null> {
    try {
      const browserClient = getBrowserClient()
      const { data: { user } } = await browserClient.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Prepare data for insertion, handling empty date strings
      const insertData = {
        title: taskData.title,
        description: taskData.description || null,
        due_date: taskData.due_date && taskData.due_date.trim() !== '' ? taskData.due_date : null,
        user_id: user.id
      }

      const { data, error } = await browserClient
        .from('tasks')
        .insert(insertData)
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
      const browserClient = getBrowserClient()
      const { data: { user } } = await browserClient.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      console.log('Getting tasks for user:', user.id, 'with filter:', filter)

      let query = browserClient
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)

      // Apply filters
      if (filter === 'pending') {
        query = query.eq('is_completed', false)
      } else if (filter === 'completed') {
        query = query.eq('is_completed', true)
      }

      // Default sorting by created_at desc
      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      console.log('Supabase response:', { data, error })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return []
    }
  }

  // Get tasks with search, filter, and sort
  static async getTasksAdvanced(
    filter: TaskFilter = 'all',
    searchQuery: string = '',
    sortBy: string = 'created_at',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<Task[]> {
    try {
      const browserClient = getBrowserClient()
      const { data: { user } } = await browserClient.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      console.log('Getting tasks with advanced options:', { filter, searchQuery, sortBy, sortDirection })

      let query = browserClient
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)

      // Apply filters
      if (filter === 'pending') {
        query = query.eq('is_completed', false)
      } else if (filter === 'completed') {
        query = query.eq('is_completed', true)
      }

      // Apply search if query exists
      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortDirection === 'asc' })

      const { data, error } = await query

      console.log('Advanced query response:', { data, error })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tasks with advanced options:', error)
      return []
    }
  }

  // Get a single task by ID
  static async getTask(id: string): Promise<Task | null> {
    try {
      const browserClient = getBrowserClient()
      const { data: { user } } = await browserClient.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await browserClient
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
      const browserClient = getBrowserClient()
      const { data: { user } } = await browserClient.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Prepare update data, handling empty date strings
      const updateData: Record<string, any> = { ...updates }
      if (updateData.due_date !== undefined) {
        updateData.due_date = updateData.due_date && updateData.due_date.trim() !== '' ? updateData.due_date : null
      }
      if (updateData.description !== undefined) {
        updateData.description = updateData.description || null
      }

      const { data, error } = await browserClient
        .from('tasks')
        .update(updateData)
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
      const browserClient = getBrowserClient()
      const { data: { user } } = await browserClient.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await browserClient
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
