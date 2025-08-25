'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, TaskFilter } from '@/types'
import Link from 'next/link'
import CreateTaskForm from '@/components/tasks/CreateTaskForm'
import TaskList from '@/components/tasks/TaskList'
import TaskSearch from '@/components/tasks/TaskSearch'
import TaskSort, { SortOption, SortDirection } from '@/components/tasks/TaskSort'

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Authenticated</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Todo List App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
                <p className="mt-1 text-sm text-gray-600">Manage and organize your daily tasks</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {showCreateForm ? 'Cancel' : 'Add New Task'}
                </button>
              </div>
            </div>
          </div>

          {/* Create Task Form */}
          {showCreateForm && (
            <div className="mb-8">
              <CreateTaskForm onTaskCreated={handleTaskCreated} />
            </div>
          )}

          {/* Search and Sort Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {(['all', 'pending', 'completed'] as TaskFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      activeFilter === filter
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Task List */}
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
