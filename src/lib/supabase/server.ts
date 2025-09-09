import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return a mock client if environment variables are missing (for build time)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found, using mock server client')
    const mockQuery = {
      select: function() { return this },
      insert: function() { return this },
      update: function() { return this },
      delete: function() { return this },
      eq: function() { return this },
      order: function() { return this },
      limit: function() { return this },
      single: function() { return this },
      then: function(resolve: (value: { data: unknown[]; error: null }) => void) {
        resolve({ data: [], error: null })
      }
    }
    
    return {
      from: () => mockQuery,
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      },
    } as ReturnType<typeof createServerClient>
  }

  try {
    // Dynamic import to avoid build issues
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()

    return createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            try {
              return cookieStore.getAll()
            } catch {
              return []
            }
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
  } catch {
    // If cookies can't be accessed, create a basic client
    return createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() { return [] },
          setAll() { /* no-op */ },
        },
      }
    )
  }
}

export async function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Return a mock client if environment variables are missing (for build time)
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Supabase service environment variables not found, using mock service client')
    const mockQuery = {
      select: function() { return this },
      insert: function() { return this },
      update: function() { return this },
      delete: function() { return this },
      eq: function() { return this },
      order: function() { return this },
      limit: function() { return this },
      single: function() { return this },
      then: function(resolve: (value: { data: unknown[]; error: null }) => void) {
        resolve({ data: [], error: null })
      }
    }
    
    return {
      from: () => mockQuery,
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      },
    } as ReturnType<typeof createServerClient>
  }

  return createServerClient(
    supabaseUrl,
    serviceRoleKey,
    {
      cookies: {
        getAll() { return [] },
        setAll() { /* no-op */ },
      },
    }
  )
}
