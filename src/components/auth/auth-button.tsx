'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/supabase-provider'

export default function AuthButton() {
  const { supabase, user } = useSupabase()
  const [loading, setLoading] = useState(false)

  const handleSignIn = () => {
    // Redirect to login page
    window.location.href = '/auth/login'
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">Welcome, {user.email}!</span>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Signing in...' : 'Sign In'}
    </button>
  )
}
