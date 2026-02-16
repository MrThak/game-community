'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MessageSquare, Send, User, Trash2, Loader2 } from 'lucide-react'

interface Comment {
    id: string
    team_id: string
    user_id: string
    username: string
    content: string
    created_at: string
}

export default function CommentSection({ teamId }: { teamId: string }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)

    useEffect(() => {
        const fetchComments = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setCurrentUserId(session?.user?.id || null)

            const { data, error } = await supabase
                .from('seven_knights_team_comments')
                .select('*')
                .eq('team_id', teamId)
                .order('created_at', { ascending: true })

            if (!error) setComments(data || [])
            setLoading(false)
        }

        fetchComments()
    }, [teamId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return alert('กรุณาเข้าสู่ระบบเพื่อคอมเมนต์')

        setIsSubmitting(true)
        try {
            const { data, error } = await supabase
                .from('seven_knights_team_comments')
                .insert([{
                    team_id: teamId,
                    user_id: session.user.id,
                    username: session.user.user_metadata?.full_name || 'Anonymous',
                    content: newComment
                }])
                .select()

            if (error) throw error

            if (data) setComments([...comments, data[0]])
            setNewComment('')
        } catch (error: any) {
            console.error('Comment failed:', error)
            alert(`ไม่สามารถคอมเมนต์ได้: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const deleteComment = async (commentId: string) => {
        if (!confirm('ลบคอมเมนต์นี้?')) return

        try {
            const { error } = await supabase
                .from('seven_knights_team_comments')
                .delete()
                .eq('id', commentId)

            if (error) throw error
            setComments(comments.filter(c => c.id !== commentId))
        } catch (error: any) {
            alert('ไม่สามารถลบได้: ' + error.message)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-500" />
                ความคิดเห็น ({comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="เขียนความคิดเห็นของคุณที่นี่..."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] resize-none"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>

            {/* Comment List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">ยังไม่มีความคิดเห็น มาเป็นคนแรกที่คอมเมนต์กัน!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600">
                                <User className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900 dark:text-white">{comment.username}</span>
                                        <span className="text-[10px] text-gray-400">
                                            {new Date(comment.created_at).toLocaleString('th-TH')}
                                        </span>
                                    </div>
                                    {currentUserId === comment.user_id && (
                                        <button
                                            onClick={() => deleteComment(comment.id)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
