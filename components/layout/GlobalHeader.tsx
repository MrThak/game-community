'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { LogOut, User as UserIcon, Menu, Settings } from 'lucide-react'
import LoginButton from '../auth/LoginButton'
import UserAvatar from '../common/UserAvatar'
import { useAdmin } from '@/hooks/useAdmin'
import PaymentModal from '../common/PaymentModal'

export default function GlobalHeader() {
    const [user, setUser] = useState<User | null>(null)
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const { isAdmin } = useAdmin()

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
        <>
            <header className="sticky top-0 z-50 w-full bg-slate-950 text-slate-100 neon-border border-b-0 border-x-0 border-t-0 !border-b !border-b-blue-500/50 mb-8">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo Area */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="font-bold text-xl text-white">T</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight hidden sm:block">Thak Talker</span>
                        </Link>
                    </div>

                    {/* Right Side: Auth */}
                    <div className="flex items-center gap-4">
                        {/* ปุ่มสนับสนุนเว็บ (New Solution) */}
                        <button
                            id="btn-donate-site-new"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setIsPaymentModalOpen(true)
                            }}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-950 hover:from-yellow-300 hover:to-orange-300 font-black rounded-full transition-all text-xs sm:text-sm shadow-[0_0_15px_rgba(250,204,21,0.4)] hover:shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:-translate-y-0.5 active:scale-95"
                        >
                            <span className="text-base sm:text-lg">☕</span>
                            <span className="whitespace-nowrap tracking-tight">สนับสนุนเว็บ</span>
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className="text-sm font-medium text-gray-200 group-hover:text-blue-400 transition-colors">
                                            {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                        </span>
                                        <span className="text-xs text-blue-400 uppercase tracking-wider font-bold">
                                            {isAdmin ? 'ผู้ดูแลระบบ' : 'สมาชิก'}
                                        </span>
                                    </div>

                                    <UserAvatar
                                        avatarUrl={user.user_metadata?.avatar_url}
                                        alt={user.user_metadata?.full_name || 'User'}
                                        size="md"
                                        className="border-2 border-gray-800 group-hover:border-blue-500 transition-colors"
                                    />
                                </Link>

                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                        title="แผงควบคุมแอดมิน"
                                    >
                                        <Settings className="w-5 h-5" />
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="ออกจากระบบ"
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
            </header >

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
            />
        </>
    )
}
