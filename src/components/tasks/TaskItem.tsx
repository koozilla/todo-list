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
  const [error, setError] = useState('')

  const handleToggleCompletion = async () => {
    setLoading(true)
    try {
      const updatedTask = await TaskService.toggleTaskCompletion(task.id)
      if (updatedTask) {
        onTaskUpdated()
      }
    } catch (err) {
      setError('Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!editData.title.trim()) return

    setLoading(true)
    setError('')

    try {
      const updatedTask = await TaskService.updateTask(task.id, editData)
      if (updatedTask) {
        setIsEditing(false)
        onTaskUpdated()
      } else {
        setError('Failed to update task')
      }
    } catch (err) {
      setError('Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return

    setLoading(true)
    try {
      const success = await TaskService.deleteTask(task.id)
      if (success) {
        onTaskDeleted()
      } else {
        setError('Failed to delete task')
      }
    } catch (err) {
      setError('Failed to delete task')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isOverdue = task.due_date && !task.is_completed && (() => {
    const dueDate = new Date(task.due_date)
    const today = new Date()
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    
    // Debug logging
    console.log('Task overdue check:', {
      taskTitle: task.title,
      dueDate: task.due_date,
      dueDateObj: dueDate,
      today: today,
      isOverdue: dueDate < today
    })
    
    return dueDate < today
  })()

  return (
    <div className={`rounded-lg shadow-sm border p-4 transition-all duration-200 ${
      task.is_completed 
        ? 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700' 
        : isOverdue 
          ? 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700' 
          : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
    }`}>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2 mb-3">
          {error}
        </div>
      )}

      <div className="flex items-start space-x-3">
        <button
          onClick={handleToggleCompletion}
          disabled={loading}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 ${
            task.is_completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-400'
          } transition-colors disabled:opacity-50`}
        >
          {task.is_completed && (
            <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                placeholder="Task title"
              />
              <textarea
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
                placeholder="Description (optional)"
              />
              <input
                type="date"
                value={editData.due_date}
                onChange={(e) => setEditData(prev => ({ ...prev, due_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  disabled={loading || !editData.title.trim()}
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className={`text-sm font-medium ${
                task.is_completed ? 'text-green-800 dark:text-green-300 line-through' : 'text-gray-900 dark:text-white'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`text-sm mt-1 ${
                  task.is_completed ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {task.description}
                </p>
              )}
              
              {task.due_date && (
                <p className={`text-xs mt-2 ${
                  isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Due: {formatDate(task.due_date)}
                  {isOverdue && ' (Overdue)'}
                </p>
              )}
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="text-gray-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
              title="Edit task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
