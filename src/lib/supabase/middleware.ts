import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse = NextResponse.next({
              request,
            })
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  let user = null
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    console.warn('Auth middleware error:', error)
    // Continue without user to allow graceful fallback
  }

  // Protect admin routes that require authentication
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  // Optional: Protect other routes that require authentication
  if (request.nextUrl.pathname.startsWith('/protected') && !user) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return supabaseResponse
}
