'use client'

import { useState } from 'react'
import { Task, UpdateTaskInput } from '@/types'
import { TaskService } from '@/lib/tasks'

interface TaskItemProps {
  task: Task
  onTaskUpdated: () => void
  onTaskDeleted: () => void
}

export default function TaskItem({ task, onTaskUpdated, onTaskDeleted }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<UpdateTaskInput>({
    title: task.title,
    description: task.description || '',
    due_date: task.due_date || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggleComplete = async () => {
    try {
      await TaskService.toggleTaskCompletion(task.id)
      onTaskUpdated()
    } catch (err) {
      console.error('Error toggling task completion:', err)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({
      title: task.title,
      description: task.description || '',
      due_date: task.due_date || ''
    })
    setError(null)
  }

  const handleSave = async () => {
    if (!editData.title?.trim()) {
      setError('Task title is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await TaskService.updateTask(task.id, editData)
      setIsEditing(false)
      onTaskUpdated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError(null)
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await TaskService.deleteTask(task.id)
        onTaskDeleted()
      } catch (err) {
        console.error('Error deleting task:', err)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  // Check if task is overdue
  const isOverdue = task.due_date && !task.is_completed && (() => {
    // Get today's date in local timezone (YYYY-MM-DD format)
    const today = new Date()
    const todayString = today.toLocaleDateString('en-CA') // Returns YYYY-MM-DD format
    
    // Compare date strings directly to avoid timezone issues
    const isOverdue = task.due_date < todayString
    
    // Debug logging
    if (task.due_date) {
      console.log('Task overdue check:', {
        taskTitle: task.title,
        dueDate: task.due_date,
        todayString: todayString,
        isOverdue: isOverdue,
        isCompleted: task.is_completed,
        comparison: `${task.due_date} < ${todayString} = ${isOverdue}`
      })
    }
    
    return isOverdue
  })()

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={editData.title || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 text-gray-900 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={editData.description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 text-gray-900 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              name="due_date"
              value={editData.due_date || ''}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              step="1"
              className="w-full px-4 py-3 text-gray-900 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all duration-200 cursor-pointer"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 rounded-xl shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-4 transition-all duration-200 hover:shadow-xl ${
      task.is_completed ? 'opacity-75' : ''
    } ${isOverdue ? 'border-red-300 dark:border-red-600 bg-red-50/50 dark:bg-red-900/10' : ''}`}>
      <div className="flex items-start space-x-3 sm:space-x-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={task.is_completed}
            onChange={handleToggleComplete}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2 transition-all duration-200"
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className={`text-base sm:text-lg font-semibold mb-2 ${
                task.is_completed 
                  ? 'text-gray-500 dark:text-gray-400 line-through' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 ${
                  task.is_completed ? 'line-through' : ''
                }`}>
                  {task.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                {task.due_date && (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={`${
                      isOverdue 
                        ? 'text-red-600 dark:text-red-400 font-medium' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {isOverdue ? '⚠️ Overdue: ' : 'Due: '}
                      {task.due_date}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-500 dark:text-gray-400">
                    Created {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2 self-end sm:self-start">
              <button
                onClick={handleEdit}
                className="p-2 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                title="Edit task"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button
                onClick={handleDelete}
                className="p-2 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                title="Delete task"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
