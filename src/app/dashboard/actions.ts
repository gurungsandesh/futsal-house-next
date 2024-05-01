// "use server"

import { createClient } from '@/utils/supabase/client'
// import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'


export async function logout(){
    const supabase = createClient()
    await supabase.auth.signOut()
}