'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'

type SupabaseContext = {
  supabase: ReturnType<typeof createClient>
  user: User | null
  isInitialized: boolean
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    // Get initial session with retry mechanism
    const initializeSession = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) {
            console.warn(`Session initialization error (attempt ${i + 1}):`, error)
            if (i === retries - 1) {
              setUser(null)
              setIsInitialized(true)
            }
          } else {
            setUser(session?.user ?? null)
            setIsInitialized(true)
            break
          }
        } catch (err) {
          console.warn(`Failed to get session (attempt ${i + 1}):`, err)
          if (i === retries - 1) {
            setUser(null)
            setIsInitialized(true)
          }
          // Wait before retry
          if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }
    }
    
    initializeSession()

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <Context.Provider value={{ supabase, user, isInitialized }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }

  return context
}
