'use client'

import { createClient } from '@/lib/supabase/client'

export async function getUserProfiles() {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching user profiles:', error)
        return []
    }

    return data
}

export async function updateUserProfile(userId: string, updates: { member_level?: string, title?: string, role?: string }) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

    if (error) {
        console.error('Error updating user profile:', error)
        return { success: false, error }
    }

    return { success: true, data }
}
