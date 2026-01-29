'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function SocialAuth() {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const supabase = createClient()

    const handleSocialLogin = async (provider: 'google' | 'azure') => {
        setIsLoading(provider)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })

            if (error) throw error
        } catch (error) {
            console.error(`${provider} login error:`, error)
            setIsLoading(null)
        }
    }

    return (
        <div className="space-y-4 w-full mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-700"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                        Or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    type="button"
                    disabled={!!isLoading}
                    onClick={() => handleSocialLogin('google')}
                    className="w-full h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                    {isLoading === 'google' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.69-2.3 1.05-3.71 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </>
                    )}
                </Button>

                <Button
                    variant="outline"
                    type="button"
                    disabled={!!isLoading}
                    onClick={() => handleSocialLogin('azure')}
                    className="w-full h-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                    {isLoading === 'azure' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 23 23">
                                <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                                <path fill="#f35325" d="M1 1h10v10H1z" />
                                <path fill="#81bc06" d="M12 1h10v10H12z" />
                                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                <path fill="#ffba08" d="M12 12h10v10H12z" />
                            </svg>
                            Microsoft
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
