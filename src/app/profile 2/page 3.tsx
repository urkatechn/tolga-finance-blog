import { getCurrentUserProfile } from './actions'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Trophy, Briefcase, Mail, ShieldCheck } from 'lucide-react'
import { Breadcrumbs } from '@/components/blog/breadcrumbs'

export default async function ProfilePage() {
    const profile = await getCurrentUserProfile()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Profile', href: '/profile', active: true },
    ]

    return (
        <div className="bg-unified pb-20">
            <div className="container mx-auto px-4 py-8">
                <Breadcrumbs items={breadcrumbs} />

                <div className="max-w-4xl mx-auto mt-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Sidebar / Stats */}
                        <div className="space-y-6">
                            <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
                                <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                                    <div className="bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/20">
                                        <User className="h-10 w-10 text-white" />
                                    </div>
                                </div>
                                <CardContent className="pt-6 text-center">
                                    <h2 className="text-xl font-bold">{profile?.full_name || 'Member'}</h2>
                                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                        <Mail className="h-3 w-3" />
                                        {user.email}
                                    </p>

                                    <div className="mt-6 flex flex-col gap-3">
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Trophy className="h-4 w-4 text-amber-500" />
                                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Level</span>
                                            </div>
                                            <Badge variant="secondary" className="font-bold">
                                                {profile?.member_level || 'Starter'}
                                            </Badge>
                                        </div>

                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-blue-500" />
                                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</span>
                                            </div>
                                            <span className="text-sm font-medium">
                                                {profile?.title || 'Member'}
                                            </span>
                                        </div>

                                        {user.email === 'info@tolgatanagardigil.com' && (
                                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">System Role</span>
                                                </div>
                                                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Admin</Badge>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="border-slate-200 dark:border-slate-800">
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                    <CardDescription>
                                        Update your personal information below. Your professional level and title are managed by the administrator.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ProfileForm initialName={profile?.full_name || ''} />
                                </CardContent>
                            </Card>

                            <Card className="border-slate-200 dark:border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-lg">Membership Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                                            <Trophy className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{profile?.member_level || 'Starter'} Membership</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Your membership status reflects your contributions and engagement with the Tolga Tanagardigil platform.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
