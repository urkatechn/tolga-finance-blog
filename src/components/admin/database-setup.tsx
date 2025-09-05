'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/supabase-provider'

export default function DatabaseVerify() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [needsMigration, setNeedsMigration] = useState(false)
  const { user } = useSupabase()

  const runVerify = async () => {
    setIsLoading(true)
    setMessage('')
    setError('')
    setNeedsMigration(false)

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
        setError(data.error || 'Verification failed')
        if (data.details?.needsMigration) {
          setNeedsMigration(true)
        }
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Verification error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Database Verification
      </h3>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          This will verify your database setup and initialize default data:
        </p>
        
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-4">
          <li><strong>Verify tables exist</strong> - categories and posts tables</li>
          <li><strong>Check database structure</strong> - indexes and triggers</li>
          <li><strong>Initialize default data</strong> - finance-related categories</li>
        </ul>
        
        {needsMigration && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">
              Migration Required
            </h4>
            <p className="text-sm text-yellow-700 mb-2">
              Please run the <code className="bg-yellow-100 px-1 rounded">supabase-migration.sql</code> file 
              in your Supabase SQL Editor first to create the required tables.
            </p>
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-yellow-700 underline hover:text-yellow-800"
            >
              Open Supabase Dashboard →
            </a>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <button
            onClick={runVerify}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify Database'}
          </button>
          
          {isLoading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
              Verifying database...
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
