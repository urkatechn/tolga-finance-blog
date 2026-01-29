import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/profile-form'
import { getOwnProfile } from './actions'
import { ServerHeader, ServerFooter } from '@/components/server-layout'
import { getSettings } from '@/lib/settings'

export const metadata = {
    title: 'My Profile | Tolga Tanagardigil',
    description: 'Manage your personal information and membership level.',
}

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const profile = await getOwnProfile()
    const settings = await getSettings()

    return (
        <div className="flex flex-col min-h-screen bg-unified">
            <ServerHeader settings={settings} />

            <main className="flex-grow">
                <ProfileForm
                    user={{ email: user.email! }}
                    profile={profile || {
                        full_name: null,
                        title: null,
                        role: 'member',
                        member_level: 'Starter'
                    }}
                />
            </main>

            <ServerFooter settings={settings} />
        </div>
    )
}
