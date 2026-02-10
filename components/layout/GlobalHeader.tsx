'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { LogOut, User as UserIcon, Menu, Settings } from 'lucide-react'
import LoginButton from '../auth/LoginButton'
import UserAvatar from '../common/UserAvatar'

export default function GlobalHeader() {
    const [user, setUser] = useState<User | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

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

    return (
        <header className="sticky top-0 z-50 w-full bg-slate-950/90 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60 text-slate-100 shadow-sm shadow-black/20">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo Area */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="font-bold text-xl text-white">G</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight hidden sm:block">GameHub</span>
                    </Link>
                </div>

                {/* Right Side: Auth */}
                <div className="flex items-center gap-4">
                    <a
                        href="https://www.buymeacoffee.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-bold rounded-full transition-all text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <span>☕</span>
                        <span>Donate</span>
                    </a>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-200">
                                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Member</span>
                            </div>

                            <UserAvatar
                                avatarUrl={user.user_metadata?.avatar_url}
                                alt={user.user_metadata?.full_name || 'User'}
                                size="md"
                                className="border-2 border-gray-800"
                            />

                            {(user.email === 'thaksin819@gmail.com') && (
                                <Link
                                    href="/admin"
                                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                    title="Admin Dashboard"
                                >
                                    <Settings className="w-5 h-5" />
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <LoginButton />
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
