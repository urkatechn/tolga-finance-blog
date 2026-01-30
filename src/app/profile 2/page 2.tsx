import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/profile-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Database, AlertTriangle } from 'lucide-react'

export const metadata = {
    title: 'My Profile | Tolga Tanagardigil',
    description: 'Manage your personal finance profile and settings.',
}

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch or create profile record
    const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Graceful handling if the user profiles table isn't created yet or other DB errors
    const isDbReady = !profileError || profileError.code !== 'PGRST116' && profileError.code !== '42P01'

    return (
        <main className="bg-unified min-h-[calc(100-h-16)] py-12 md:py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Account Profile</h1>
                        <p className="text-slate-500 mt-2 text-lg">Manage your personal details and membership status.</p>
                    </div>

                    {!isDbReady ? (
                        <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle className="font-bold">System Configuration Required</AlertTitle>
                            <AlertDescription className="text-sm">
                                The profile system is not fully initialized in the database. Please contact the administrator to run the setup script.
                            </AlertDescription>
                        </Alert>
                    ) : !profile ? (
                        <Alert className="bg-blue-50 border-blue-100 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800/40 dark:text-blue-400">
                            <Database className="h-4 w-4" />
                            <AlertTitle className="font-bold">Profile Record Not Found</AlertTitle>
                            <AlertDescription className="text-sm">
                                Your profile was not automatically created. This usually happens if the database triggers weren't active when you signed up.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <ProfileForm
                            initialProfile={profile}
                            userEmail={user.email || ''}
                        />
                    )}

                    <div className="mt-12 p-6 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold">Privacy & Security</h3>
                            <p className="text-slate-400 text-sm">Your data is stored securely in our private encrypted cloud.</p>
                        </div>
                        <div className="flex gap-3">
                            <Badge variant="outline" className="border-slate-700 text-slate-300">Auth v2.1</Badge>
                            <Badge variant="outline" className="border-slate-700 text-slate-300">RLS Active</Badge>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
