'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'

export function LogoutButton({ className, variant = "ghost" }: { className?: string, variant?: "ghost" | "outline" | "default" | "destructive" }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await supabase.auth.signOut()
            router.refresh()
            router.push('/')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant={variant}
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
            className={className}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <>
                    <LogOut className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Logout</span>
                </>
            )}
        </Button>
    )
}
