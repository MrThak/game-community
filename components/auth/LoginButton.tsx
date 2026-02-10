'use client'

import { supabase } from '@/lib/supabase'
import { LogIn } from 'lucide-react'

export default function LoginButton() {
    const handleLogin = async (provider: 'google' | 'apple') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error) {
            console.error('Error logging in:', error)
            alert('Login failed. Please check your configuration.')
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={() => handleLogin('google')}
                className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-full transition-all hover:shadow-md hover:scale-105"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                <span>เข้าสู่ระบบด้วย Google</span>
            </button>


        </div>
    )
}
