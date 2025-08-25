'use client'

import { useState } from 'react'

export type SortOption = 'created_at' | 'due_date' | 'title' | 'status'
export type SortDirection = 'asc' | 'desc'

interface TaskSortProps {
  sortBy: SortOption
  sortDirection: SortDirection
  onSortChange: (sortBy: SortOption, direction: SortDirection) => void
}

export default function TaskSort({ sortBy, sortDirection, onSortChange }: TaskSortProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sortOptions = [
    { value: 'created_at', label: 'Created Date', icon: '📅' },
    { value: 'due_date', label: 'Due Date', icon: '⏰' },
    { value: 'title', label: 'Title', icon: '📝' },
    { value: 'status', label: 'Status', icon: '✅' }
  ] as const

  const handleSortChange = (option: SortOption) => {
    const newDirection = sortBy === option && sortDirection === 'asc' ? 'desc' : 'asc'
    onSortChange(option, newDirection)
    setIsOpen(false)
  }

  const currentSort = sortOptions.find(option => option.value === sortBy)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all duration-200"
      >
        <span className="mr-2">{currentSort?.icon}</span>
        Sort by: {currentSort?.label}
        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 z-10">
          <div className="py-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  sortBy === option.value ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="mr-2">{option.icon}</span>
                    {option.label}
                  </span>
                  {sortBy === option.value && (
                    <span className="text-blue-600 dark:text-blue-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
