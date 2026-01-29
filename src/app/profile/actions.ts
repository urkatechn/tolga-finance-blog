'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }

    return data
}

export async function updateProfile(formData: { full_name: string; title: string }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('user_profiles')
        .upsert({
            id: user.id,
            full_name: formData.full_name,
            title: formData.title,
            email: user.email,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })

    if (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    const file = formData.get('avatar') as File
    if (!file) return { success: false, error: 'No file provided' }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload to avatars bucket
    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

    if (uploadError) {
        console.error('Error uploading avatar:', uploadError)
        return { success: false, error: uploadError.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

    // Use upsert to ensure profile exists
    const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
            id: user.id,
            avatar_url: publicUrl,
            email: user.email,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })

    if (updateError) {
        console.error('Error updating profile with avatar:', updateError)
        return { success: false, error: updateError.message }
    }

    revalidatePath('/profile')
    return { success: true, url: publicUrl }
}

export async function getSubscriptionStatus() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data, error } = await supabase
        .from('subscribers')
        .select('is_subscribed')
        .eq('email', user.email)
        .maybeSingle()

    if (error) {
        console.error('Error fetching subscription status:', error)
        return false
    }

    return data?.is_subscribed || false
}

export async function toggleSubscription(isSubscribed: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    const email = user.email!
    const now = new Date().toISOString()

    // Check if subscriber exists
    const { data: existing } = await supabase
        .from('subscribers')
        .select('id')
        .eq('email', email)
        .maybeSingle()

    let error
    if (existing) {
        const { error: updateError } = await supabase
            .from('subscribers')
            .update({
                is_subscribed: isSubscribed,
                update_date_time: now
            })
            .eq('id', existing.id)
        error = updateError
    } else if (isSubscribed) {
        const { error: insertError } = await supabase
            .from('subscribers')
            .insert({
                email,
                is_subscribed: true,
                subscription_date_time: now,
                update_date_time: now
            })
        error = insertError
    }

    if (error) {
        console.error('Error toggling subscription:', error)
        return { success: false, error: 'Failed to update subscription' }
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function deactivateAccount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('user_profiles')
        .update({
            status: 'inactive',
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

    if (error) {
        console.error('Error deactivating account:', error)
        return { success: false, error: 'Failed to deactivate account' }
    }

    // Sign out user after deactivation
    await supabase.auth.signOut()

    revalidatePath('/')
    return { success: true }
}
