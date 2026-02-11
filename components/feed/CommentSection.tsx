'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Comment } from '@/types/comment'
import { Send } from 'lucide-react'
import UserAvatar from '../common/UserAvatar'

interface CommentSectionProps {
    postId: string
    currentUser?: any
}

export default function CommentSection({ postId, currentUser }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [newComment, setNewComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchComments()
    }, [postId])

    const fetchComments = async () => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: true })

            if (error) throw error
            setComments(data as Comment[])
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !currentUser) return

        setSubmitting(true)
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert({
                    content: newComment,
                    post_id: postId,
                    user_id: currentUser.id,
                    username: currentUser.email?.split('@')[0] || 'User'
                })
                .select()
                .single()

            if (error) throw error

            setComments([...comments, data as Comment])
            setNewComment('')
        } catch (error) {
            console.error('Error posting comment:', error)
            alert('ไม่สามารถส่งความคิดเห็นได้')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="text-sm text-gray-400 py-2">กำลังโหลดความคิดเห็น...</div>

    return (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-4 mb-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                        <UserAvatar size="sm" name={comment.username} />
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.username}</span>
                                <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {currentUser ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <UserAvatar size="sm" />
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="แสดงความคิดเห็น..."
                            className="w-full px-4 py-2 pr-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={submitting}
                        />
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="absolute right-2 top-1.5 p-1 text-blue-500 hover:text-blue-600 disabled:text-gray-400"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center text-sm text-gray-500 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    เข้าสู่ระบบเพื่อแสดงความคิดเห็น
                </div>
            )}
        </div>
    )
}
