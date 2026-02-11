'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdmin() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAdminStatus()
    }, [])

    const checkAdminStatus = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                setIsAdmin(false)
                setLoading(false)
                return
            }

            // Check if user exists in 'admins' table
            const { data, error } = await supabase
                .from('admins')
                .select('user_id')
                .eq('user_id', session.user.id)
                .single()

            if (data) {
                setIsAdmin(true)
            } else {
                // Fallback: Check hardcoded email for development/bootstrapping (Optional)
                // const email = session.user.email
                // if (email === 'your-admin@email.com') setIsAdmin(true)
                setIsAdmin(false)
            }
        } catch (error) {
            console.error('Error checking admin status:', error)
            setIsAdmin(false)
        } finally {
            setLoading(false)
        }
    }

    return { isAdmin, loading }
}
