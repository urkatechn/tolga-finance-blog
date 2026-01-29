'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
    User,
    Upload,
    Loader2,
    CheckCircle2,
    Camera,
    Briefcase,
    Trophy,
    Mail
} from 'lucide-react'
import { toast } from 'sonner'
import { getProfile, updateProfile, uploadAvatar } from './actions'
import Image from 'next/image'

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form State
    const [fullName, setFullName] = useState('')
    const [title, setTitle] = useState('')

    const fetchProfile = async () => {
        setIsLoading(true)
        const data = await getProfile()
        if (data) {
            setProfile(data)
            setFullName(data.full_name || '')
            setTitle(data.title || '')
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        const result = await updateProfile({ full_name: fullName, title: title })

        if (result.success) {
            toast.success('Information updated successfully')
            fetchProfile()
        } else {
            toast.error(result.error || 'Failed to update information')
        }
        setIsSaving(false)
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be less than 2MB')
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append('avatar', file)

        const result = await uploadAvatar(formData)

        if (result.success) {
            toast.success('Avatar updated successfully')
            fetchProfile()
        } else {
            toast.error(result.error || 'Failed to upload avatar')
        }
        setIsUploading(false)
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <div className="bg-unified min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-2">My Profile</h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage your personal information and how you appear on the site.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Public Identity Card */}
                    <Card className="md:col-span-1 shadow-xl border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md bg-white/40 dark:bg-slate-900/40">
                        <CardHeader className="text-center pb-2">
                            <div className="relative mx-auto w-32 h-32 mb-4">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    {profile?.avatar_url ? (
                                        <Image
                                            src={profile.avatar_url}
                                            alt={profile?.full_name || 'Profile'}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User className="w-16 h-16 text-slate-400" />
                                    )}
                                </div>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute bottom-0 right-0 rounded-full shadow-md hover:scale-110 transition-transform"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <CardTitle className="text-xl font-bold">{profile?.full_name || 'Anonymous'}</CardTitle>
                            <CardDescription className="flex items-center justify-center gap-1 mt-1">
                                <Briefcase className="w-3 h-3" />
                                {profile?.title || 'No Title Set'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <Trophy className={`h-4 w-4 ${profile?.member_level === 'Gold' ? 'text-yellow-500' :
                                            profile?.member_level === 'Silver' ? 'text-slate-400' : 'text-orange-500'
                                        }`} />
                                    <span className="text-sm font-medium">Member Level</span>
                                </div>
                                <Badge className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                                    {profile?.member_level || 'Starter'}
                                </Badge>
                            </div>
                            <p className="text-xs text-center text-slate-500 font-mono">
                                Member since {new Date(profile?.created_at).toLocaleDateString()}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Edit Profile Form */}
                    <Card className="md:col-span-2 shadow-xl border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>Update your public-facing information.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateInfo} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Display Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="pl-10"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Professional Title</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="pl-10"
                                            placeholder="e.g. Financial Advisor, CEO"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 ml-1">This title will be displayed next to your name in various sections of the site.</p>
                                </div>

                                <div className="pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-sm font-mono opacity-60">Verified Member</span>
                                    </div>
                                    <Button type="submit" disabled={isSaving} className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 px-8">
                                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
