'use client'

import { useEffect, useState } from 'react'
import { TaskFilter } from '@/types'
import Link from 'next/link'
import CreateTaskForm from '@/components/tasks/CreateTaskForm'
import TaskList from '@/components/tasks/TaskList'
import TaskSearch from '@/components/tasks/TaskSearch'
import TaskSort, { SortOption, SortDirection } from '@/components/tasks/TaskSort'
import ThemeToggle from '@/components/ui/ThemeToggle'
import Logo from '@/components/ui/Logo'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('pending')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  // No need for manual auth check - AuthContext handles this

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.user-menu')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // handleSignOut is now provided by AuthContext

  const handleTaskCreated = () => {
    setShowCreateForm(false)
    // Force a refresh by changing the filter temporarily
    setActiveFilter('pending')
    setTimeout(() => setActiveFilter('all'), 100)
  }

  const handleTasksChange = () => {
    // This will trigger a refresh of the task list
    console.log('Tasks changed, should refresh')
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSortChange = (newSortBy: SortOption, newDirection: SortDirection) => {
    setSortBy(newSortBy)
    setSortDirection(newDirection)
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
    if (showSearch) {
      setSearchQuery('') // Clear search when hiding
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Logo size="lg" className="mx-auto mb-8" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Not Authenticated</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Please sign in to access your dashboard.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Safety check for user properties
  const userEmail = user?.email || 'User'
  const userInitial = userEmail.charAt(0).toUpperCase()
  const userName = userEmail.split('@')[0] || 'User'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Gmail-Style Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left side - Logo */}
            <div className="flex items-center flex-1 min-w-0">
              <Logo size="sm" />
            </div>

            {/* Right side - Actions and User */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Search Button - Icon only on mobile */}
              <button
                onClick={toggleSearch}
                className="inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                title={showSearch ? 'Hide Search' : 'Search'}
              >
                <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">
                  {showSearch ? 'Hide Search' : 'Search'}
                </span>
              </button>

              {/* Create Task Button - Icon only on mobile */}
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                title={showCreateForm ? 'Cancel' : 'New Task'}
              >
                <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">
                  {showCreateForm ? 'Cancel' : 'New Task'}
                </span>
              </button>

              {/* Theme Toggle - Hidden on mobile */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* User Menu */}
              <div className="relative user-menu">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {userInitial}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userName}
                  </span>
                  <svg className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userEmail}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Signed in</p>
                    </div>
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Search Bar (shown when search mode is active) */}
        {showSearch && (
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
              <TaskSearch onSearch={handleSearch} placeholder="Search tasks..." />
            </div>
          </div>
        )}

        {/* Create Task Form */}
        {showCreateForm && (
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Task</h3>
              <CreateTaskForm onTaskCreated={handleTaskCreated} />
            </div>
          </div>
        )}

        {/* Controls Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {/* Filter Tabs - Always visible */}
            <div className="flex space-x-1 overflow-x-auto">
              {(['pending', 'completed', 'all'] as TaskFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap ${
                    activeFilter === filter
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {filter === 'pending' && 'Active'}
                  {filter === 'completed' && 'Completed'}
                  {filter === 'all' && 'All Tasks'}
                </button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex-shrink-0">
              <TaskSort
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <TaskList
            filter={activeFilter}
            searchQuery={searchQuery}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onTasksChange={handleTasksChange}
          />
        </div>
      </main>
    </div>
  )
}
