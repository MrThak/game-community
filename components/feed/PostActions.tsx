'use client'

import { useState } from 'react'
import { Heart, MessageSquare, Share2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Post } from '@/types/post'

interface PostActionsProps {
    post: Post
    currentUserId?: string
    onCommentClick: () => void
}

export default function PostActions({ post, currentUserId, onCommentClick }: PostActionsProps) {
    const [liked, setLiked] = useState(post.user_has_liked || false)
    const [likesCount, setLikesCount] = useState(post.likes_count || 0)
    const [isLiking, setIsLiking] = useState(false)

    const handleLike = async () => {
        if (!currentUserId) {
            alert('กรุณาเข้าสู่ระบบก่อนกดถูกใจ')
            return
        }
        if (isLiking) return

        // Optimistic Update
        const newLiked = !liked
        setLiked(newLiked)
        setLikesCount(prev => newLiked ? prev + 1 : prev - 1)
        setIsLiking(true)

        try {
            if (newLiked) {
                const { error } = await supabase
                    .from('likes')
                    .insert({ post_id: post.id, user_id: currentUserId })
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .eq('post_id', post.id)
                    .eq('user_id', currentUserId)
                if (error) throw error
            }
        } catch (error) {
            console.error('Error toggling like:', error)
            // Revert on error
            setLiked(!newLiked)
            setLikesCount(prev => !newLiked ? prev + 1 : prev - 1)
        } finally {
            setIsLiking(false)
        }
    }

    const handleShare = async () => {
        const url = `${window.location.origin}/games/${post.game_id}?post=${post.id}`
        try {
            await navigator.clipboard.writeText(url)
            alert('คัดลอกลิงก์เรียบร้อยแล้ว!')
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
            <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-2 text-sm transition-colors ${liked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
                    }`}
            >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span>{likesCount > 0 ? likesCount : 'ถูกใจ'}</span>
            </button>

            <button
                onClick={onCommentClick}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors"
            >
                <MessageSquare className="w-5 h-5" />
                <span>ความคิดเห็น</span>
            </button>

            <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-500 transition-colors"
            >
                <Share2 className="w-5 h-5" />
                <span>แชร์</span>
            </button>
        </div>
    )
}
