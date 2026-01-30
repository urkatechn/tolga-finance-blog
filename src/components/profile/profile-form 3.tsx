'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { updateCurrentUserProfile } from './actions'
import { toast } from 'sonner'

export function ProfileForm({ initialName }: { initialName: string }) {
    const [fullName, setFullName] = useState(initialName)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        const { success, error } = await updateCurrentUserProfile({ full_name: fullName })

        if (success) {
            toast.success('Your profile name has been updated.')
        } else {
            toast.error('Failed to update profile.')
        }
        setIsSaving(false)
    }

    return (
        <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="h-11"
                />
            </div>
            <Button type="submit" className="w-full h-11" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update My Name'}
            </Button>
        </form>
    )
}
