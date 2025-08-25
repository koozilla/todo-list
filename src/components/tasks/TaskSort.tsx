'use client'

export type SortOption = 'created_at' | 'due_date' | 'title' | 'is_completed'
export type SortDirection = 'asc' | 'desc'

interface TaskSortProps {
  sortBy: SortOption
  sortDirection: SortDirection
  onSortChange: (sortBy: SortOption, direction: SortDirection) => void
}

export default function TaskSort({ sortBy, sortDirection, onSortChange }: TaskSortProps) {
  const sortOptions = [
    { value: 'created_at', label: 'Created Date' },
    { value: 'due_date', label: 'Due Date' },
    { value: 'title', label: 'Title' },
    { value: 'is_completed', label: 'Status' }
  ]

  const handleSortChange = (newSortBy: SortOption) => {
    // If clicking the same field, toggle direction. Otherwise, default to desc for dates, asc for text
    if (newSortBy === sortBy) {
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc'
      onSortChange(newSortBy, newDirection)
    } else {
      // Default direction based on field type
      const newDirection = ['created_at', 'due_date'].includes(newSortBy) ? 'desc' : 'asc'
      onSortChange(newSortBy, newDirection)
    }
  }

  const getSortIcon = (option: SortOption) => {
    if (sortBy !== option) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }

    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      <div className="flex space-x-1">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSortChange(option.value as SortOption)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              sortBy === option.value
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-1">
              <span>{option.label}</span>
              {getSortIcon(option.value as SortOption)}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
