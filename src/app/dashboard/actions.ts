import { createClient } from '@/utils/supabase/client'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export async function logout(router: AppRouterInstance){
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
}