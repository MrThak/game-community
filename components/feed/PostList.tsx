'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Post } from '@/types/post'
import { MessageSquare, Trash2 } from 'lucide-react'
import UserAvatar from '../common/UserAvatar'

export default function PostList({ gameId }: { gameId: string }) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)

    const fetchPosts = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('game_id', gameId)
                .order('created_at', { ascending: false })

            if (error) throw error
            setPosts(data as Post[])
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setLoading(false)
        }
    }, [gameId])

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setCurrentUser(session?.user ?? null)
        })
        fetchPosts()
    }, [fetchPosts])

    const handleDelete = async (postId: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบโพสต์นี้? หากลบแล้วจะไม่สามารถกู้คืนได้')) return

        try {
            // 1. Find the post to get its content and images
            const postToDelete = posts.find(p => p.id === postId)
            if (!postToDelete) return

            const imagesToDelete: string[] = []

            // 2. Extract images from legacy image_url field
            if (postToDelete.image_url && postToDelete.image_url.includes('post-images')) {
                const path = postToDelete.image_url.split('/post-images/')[1]
                if (path) imagesToDelete.push(path)
            }

            // 3. Extract images from Rich Text Content
            if (postToDelete.content) {
                const parser = new DOMParser()
                const doc = parser.parseFromString(postToDelete.content, 'text/html')
                const imgs = doc.getElementsByTagName('img')

                for (let i = 0; i < imgs.length; i++) {
                    const src = imgs[i].src
                    if (src.includes('/post-images/')) {
                        // Extract path after 'post-images/' which might include folders
                        // URL example: .../storage/v1/object/public/post-images/filename.jpg
                        const path = src.split('/post-images/')[1]
                        if (path) {
                            // Decode URI component in case of special chars
                            imagesToDelete.push(decodeURIComponent(path))
                        }
                    }
                }
            }

            // 4. Delete images from Storage (if any)
            if (imagesToDelete.length > 0) {
                const { error: storageError } = await supabase.storage
                    .from('post-images')
                    .remove(imagesToDelete)

                if (storageError) {
                    console.error('Error deleting images:', storageError)
                    // Continue to delete post even if image deletion fails, 
                    // or stopping here? Usually better to try delete post anyway to clean up DB
                }
            }

            // 5. Delete post from Database
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId)
                .eq('user_id', currentUser?.id) // Ensure ownership

            if (error) throw error

            // 6. Refresh List
            setPosts(prev => prev.filter(p => p.id !== postId))
            // fetchPosts() // Optional: refetch or just filter local state
        } catch (error) {
            console.error('Error deleting post:', error)
            alert('ลบโพสต์ไม่สำเร็จ')
        }
    }

    return (
        <div className="space-y-4">
            {loading ? (
                <div className="text-center py-8 text-gray-500">กำลังโหลดโพสต์...</div>
            ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                    <MessageSquare className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">ยังไม่มีโพสต์ เป็นคนแรกที่เริ่มพูดคุย!</p>
                </div>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 relative group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <UserAvatar
                                    size="md"
                                // Note: We don't have avatar_url in posts table yet.
                                // Future: Add avatar_url column to posts table during insert
                                />
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{post.username || 'User'}</div>
                                    <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString('th-TH')}</div>
                                </div>
                            </div>

                            {currentUser?.id === post.user_id && (
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                    title="ลบโพสต์"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {post.title && (
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                        )}

                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4 leading-relaxed">{post.content}</p>

                        {post.image_url && (
                            <div className="mb-4 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                                <img src={post.image_url} alt="Post attachment" className="w-full max-h-96 object-cover" />
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    )
}
