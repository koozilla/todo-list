'use client'

import { useState, useEffect } from 'react'
import { Task, TaskFilter } from '@/types'
import { TaskService } from '@/lib/tasks'
import TaskItem from './TaskItem'

interface TaskListProps {
  filter: TaskFilter
  onTasksChange: () => void
}

export default function TaskList({ filter, onTasksChange }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTasks()
  }, [filter])

  const loadTasks = async () => {
    setLoading(true)
    setError('')
    
    try {
      const fetchedTasks = await TaskService.getTasks(filter)
      setTasks(fetchedTasks)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskUpdated = () => {
    loadTasks()
    onTasksChange()
  }

  const handleTaskDeleted = () => {
    loadTasks()
    onTasksChange()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-4 max-w-md mx-auto">
          <p className="font-medium">Error loading tasks</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={loadTasks}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (tasks.length === 0) {
    const getEmptyMessage = () => {
      switch (filter) {
        case 'completed':
          return 'No completed tasks yet. Keep working on your goals!'
        case 'pending':
          return 'No pending tasks. Great job staying on top of things!'
        default:
          return 'No tasks yet. Create your first task to get started!'
      }
    }

    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500">{getEmptyMessage()}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      ))}
    </div>
  )
}
