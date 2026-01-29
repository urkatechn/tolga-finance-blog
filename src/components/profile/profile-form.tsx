'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { User, Mail, ShieldCheck, Trophy, Briefcase, Loader2, Save } from 'lucide-react'
import { updateOwnProfile } from '@/app/profile/actions'
import { toast } from 'sonner'

interface ProfileFormProps {
    user: {
        email: string
    }
    profile: {
        full_name: string | null
        title: string | null
        role: string
        member_level: string | null
    }
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
    const [fullName, setFullName] = useState(profile.full_name || '')
    const [title, setTitle] = useState(profile.title || '')
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const result = await updateOwnProfile({ full_name: fullName, title: title })

        if (result.success) {
            toast.success('Profile updated successfully')
        } else {
            toast.error('Failed to update profile: ' + result.error)
        }

        setIsLoading(false)
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="grid md:grid-cols-3 gap-8">
                {/* Left: Quick Info Card */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="shadow-lg border-blue-100/50 dark:border-slate-800">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 ring-8 ring-blue-50/50 dark:ring-blue-900/5">
                                <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle className="text-xl">{fullName || 'User Profile'}</CardTitle>
                            <CardDescription className="flex items-center justify-center gap-1">
                                <Mail className="h-3 w-3" /> {user.email}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <ShieldCheck className="h-4 w-4" /> Role
                                </div>
                                <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                    {profile.role}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <Trophy className="h-4 w-4" /> Level
                                </div>
                                <Badge variant="outline" className="bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                    {profile.member_level || 'Starter'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-lg">
                        <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                            <strong>Note:</strong> Your role and membership level are managed by the administrator. To request a level upgrade, please contact support.
                        </p>
                    </div>
                </div>

                {/* Right: Edit Form */}
                <Card className="md:col-span-2 shadow-xl border-slate-200/60 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details and professional title.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="fullName"
                                        className="pl-10 h-11"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Professional Title</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="title"
                                        className="pl-10 h-11"
                                        placeholder="e.g. Finance Associate, Accountant"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">
                                    This title will be displayed in your profile and comments.
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-8"
                                >
                                    {isLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
