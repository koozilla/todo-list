'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface TaskSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export default function TaskSearch({ onSearch, placeholder = "Search tasks...", className = "" }: TaskSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, onSearch])

  const handleClear = () => {
    setSearchQuery('')
    onSearch('')
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-gray-600"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            title="Clear search"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
