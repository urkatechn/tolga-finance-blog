import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'

export const getUser = cache(async () => {
  const supabase = await createClient()
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error:', error)
    return null
  }
})
