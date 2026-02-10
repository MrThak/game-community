'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import LoginButton from '../auth/LoginButton'
import { LogOut, User as UserIcon } from 'lucide-react'

export default function UserProfileSection() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    if (!user) {
        return (
            <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">สมาชิก</p>
                <LoginButton />
            </div>
        )
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.user_metadata?.avatar_url ? '' : 'bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800'}`}>
                {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                    <span className="text-blue-600 dark:text-blue-300 font-bold text-lg">
                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0].toUpperCase() || <UserIcon className="w-6 h-6" />}
                    </span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <button
                onClick={handleLogout}
                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="ออกจากระบบ"
            >
                <LogOut className="w-5 h-5" />
            </button>
        </div>
    )
}
