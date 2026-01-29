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
        .update({
            full_name: formData.full_name,
            title: formData.title,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

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

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
            avatar_url: publicUrl,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (updateError) {
        console.error('Error updating profile with avatar:', updateError)
        return { success: false, error: updateError.message }
    }

    revalidatePath('/profile')
    return { success: true, url: publicUrl }
}
