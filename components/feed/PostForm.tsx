'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RichTextEditor from '../common/RichTextEditor'
import UserAvatar from '../common/UserAvatar'

export default function PostForm({ gameId, onPostCreated }: { gameId: string, onPostCreated: () => void }) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || !title.trim() || !user) return

        setIsSubmitting(true)
        try {
            const username = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous'

            const { error } = await supabase
                .from('posts')
                .insert([{
                    title,
                    content,
                    image_url: imageUrl.trim() || null,
                    game_id: gameId,
                    user_id: user.id,
                    username: username
                }])

            if (error) throw error

            setTitle('')
            setContent('')
            setImageUrl('')
            onPostCreated()
        } catch (error) {
            console.error('Error creating post:', error)
            alert('Failed to post. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!user) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 mb-6 text-center">
                <p className="text-gray-500 mb-4">เข้าสู่ระบบเพื่อเริ่มพูดคุยกับชุมชน</p>
                <div className="max-w-xs mx-auto">
                    <p className="text-sm text-blue-500">กรุณาเข้าสู่ระบบที่เมนูทางด้านซ้าย</p>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 mb-6">
            <div className="flex items-center gap-3 mb-3">
                <UserAvatar
                    avatarUrl={user.user_metadata?.avatar_url}
                    alt={user.user_metadata?.full_name || 'User'}
                    size="sm"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="หัวข้อเรื่อง *"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    required
                />

                <RichTextEditor content={content} onChange={setContent} />

                {/* Hidden Image URL input since we use RichText now, but keeping state for compatibility or specific cover image if needed. 
                    Actually user wanted word-like, so images are inside content. 
                    We can keep 'imageUrl' as 'Cover Image' optionally, or remove it. 
                    Let's keep it as optional cover image for now as per schema. 
                */}
                <div className="relative pt-2">
                    <label className="text-xs text-gray-500 mb-1 block">รูปปก (Cover Image) - ถ้ามี</label>
                    <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="ลิงก์รูปภาพปก https://..."
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                    />
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim() || !title.trim()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow"
                >
                    {isSubmitting ? 'กำลังโพสต์...' : 'โพสต์เรื่องราว'}
                </button>
            </div>
        </form>
    )
}
