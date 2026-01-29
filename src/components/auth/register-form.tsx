'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { SocialAuth } from './social-auth'

export default function RegisterForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) {
                console.error('Supabase auth error:', error)
                setError(error.message || 'Registration failed')
                return
            }

            if (data.user) {
                setSuccess(true)
                // If email confirmation is disabled, we might already have a session
                if (data.session) {
                    router.push('/')
                    router.refresh()
                }
            }
        } catch (err) {
            console.error('Registration error:', err)
            setError('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <Alert className="bg-green-50 border-green-200 text-green-800">
                    <AlertDescription>
                        Registration successful! Please check your email for a confirmation link.
                    </AlertDescription>
                </Alert>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/login">Go to Login</Link>
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        disabled={isLoading}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign In
                </Link>
            </div>

            <SocialAuth />
        </form>
    )
}
