'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/supabase-provider'

export default function DatabaseSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { user } = useSupabase()

  const runSetup = async () => {
    setIsLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
      } else {
        setError(data.error || 'Setup failed')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Setup error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Database Setup
      </h3>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          This will create the necessary database tables for your finance blog:
        </p>
        
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
          <li><strong>categories</strong> - Blog post categories</li>
          <li><strong>posts</strong> - Blog posts with full content</li>
          <li>Database indexes for optimal performance</li>
          <li>Automatic timestamp triggers</li>
          <li>Default finance-related categories</li>
        </ul>
        
        <div className="flex items-center gap-4">
          <button
            onClick={runSetup}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Setting up...' : 'Run Database Setup'}
          </button>
          
          {isLoading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Creating tables...
            </div>
          )}
        </div>
        
        {message && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{message}</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
