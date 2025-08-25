'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, TaskFilter } from '@/types'
import Link from 'next/link'
import CreateTaskForm from '@/components/tasks/CreateTaskForm'
import TaskList from '@/components/tasks/TaskList'
import TaskSearch from '@/components/tasks/TaskSearch'
import TaskSort, { SortOption, SortDirection } from '@/components/tasks/TaskSort'
import ThemeToggle from '@/components/ui/ThemeToggle'
import Logo from '@/components/ui/Logo'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email!,
            created_at: currentUser.created_at
          })
        }
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 font-medium">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Logo size="lg" className="mx-auto mb-8" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to TaskFlow</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Please sign in to access your personal task management workspace.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-full shadow-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Header */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Logo size="md" />
            </div>
            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Signed in</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome back, {user.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Stay organized and boost your productivity with your personal task management system
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {showCreateForm ? 'Cancel' : 'Create New Task'}
                </button>
                {showCreateForm && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                    ✨ Quick task creation mode
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Task Form */}
        {showCreateForm && (
          <div className="mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Task</h3>
              <CreateTaskForm onTaskCreated={handleTaskCreated} />
            </div>
          </div>
        )}

        {/* Search and Sort Controls */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1 max-w-md">
                <TaskSearch onSearch={handleSearch} placeholder="Search tasks by title or description..." />
              </div>
              <div className="flex-shrink-0">
                <TaskSort
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-2">
            <nav className="flex space-x-2">
              {(['all', 'pending', 'completed'] as TaskFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium text-sm capitalize transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {filter === 'all' && '📋 All Tasks'}
                  {filter === 'pending' && '⏳ Pending'}
                  {filter === 'completed' && '✅ Completed'}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
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
