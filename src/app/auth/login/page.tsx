import { getUser } from '@/lib/supabase/user'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoginForm from '@/components/auth/login-form'

export default async function LoginPage() {
  // If user is already authenticated, redirect to admin
  const user = await getUser()
  
  if (user) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-block text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Finance Blog
          </Link>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Admin Portal
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            
            <div className="text-center mt-6">
              <Link 
                href="/" 
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                ← Back to homepage
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Need access? Contact the administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
