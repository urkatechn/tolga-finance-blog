'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateServices(services: any[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== 'info@tolgatanagardigil.com') {
        return { success: false, error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('settings')
        .update({ value: JSON.stringify(services) })
        .eq('key', 'services')

    if (error) {
        console.error('Error updating services:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/services')
    return { success: true }
}
