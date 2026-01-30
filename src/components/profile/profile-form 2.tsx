'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    User,
    Briefcase,
    Trophy,
    Mail,
    Loader2,
    ShieldCheck,
    Save
} from 'lucide-react'
import { updateMyProfile } from '@/app/profile/actions'
import { toast } from 'sonner'

interface ProfileFormProps {
    initialProfile: {
        id: string
        full_name: string | null
        role: string
        member_level: string | null
        title: string | null
        created_at: string
    }
    userEmail: string
}

export function ProfileForm({ initialProfile, userEmail }: ProfileFormProps) {
    const [fullName, setFullName] = useState(initialProfile.full_name || '')
    const [title, setTitle] = useState(initialProfile.title || '')
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        const { success, error } = await updateMyProfile({
            full_name: fullName,
            title: title,
        })

        if (success) {
            toast.success('Profile updated successfully!')
        } else {
            toast.error('Failed to update profile. Make sure you have initialized the database.')
            console.error(error)
        }
        setIsSaving(false)
    }

    return (
        <div className="grid gap-8 md:grid-cols-3">
            {/* Sidebar Info */}
            <div className="md:col-span-1 space-y-6">
                <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                    <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-900 border-b border-slate-700" />
                    <CardHeader className="relative -mt-16 text-center">
                        <div className="mx-auto h-24 w-24 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-lg">
                            <User className="h-12 w-12 text-slate-400" />
                        </div>
                        <div className="mt-4">
                            <CardTitle className="text-2xl font-black">{fullName || 'Anonymous'}</CardTitle>
                            <CardDescription className="flex items-center justify-center gap-1 mt-1">
                                <Briefcase className="h-3 w-3" />
                                {title || 'Professional Title Not Set'}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-medium text-slate-500">Member Status</span>
                            <Badge className={
                                initialProfile.member_level === 'Gold' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-200' :
                                    initialProfile.member_level === 'Silver' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                        'bg-orange-50 text-orange-600 border-orange-100'
                            }>
                                <Trophy className="h-3 w-3 mr-1" />
                                {initialProfile.member_level || 'Starter'}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                            <span className="text-sm font-medium text-slate-500">Account Type</span>
                            {initialProfile.role === 'admin' ? (
                                <Badge className="bg-blue-50 text-blue-600 border-blue-100 uppercase text-[10px] tracking-widest px-2">
                                    <ShieldCheck className="h-3 w-3 mr-1" />
                                    Administrator
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="uppercase text-[10px] tracking-widest px-2">Member</Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Form */}
            <div className="md:col-span-2">
                <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                        <CardDescription>Update your profile details to personalize your experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        <div className="grid gap-3">
                            <Label htmlFor="email" className="text-slate-500">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    value={userEmail}
                                    disabled
                                    className="pl-10 bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed opacity-70"
                                />
                            </div>
                            <p className="text-[10px] text-slate-400 px-1">Email cannot be changed.</p>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="name"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="title">Professional Title</Label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="title"
                                    placeholder="e.g. Finance Specialist, Entrepreneur"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 py-4">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="ml-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 hover:dark:bg-slate-100 px-6"
                        >
                            {isSaving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
