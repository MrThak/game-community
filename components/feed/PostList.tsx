'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Post } from '@/types/post'
import { Trash2 } from 'lucide-react'
import UserAvatar from '../common/UserAvatar'
import PostActions from './PostActions'
import CommentSection from './CommentSection'

export default function PostList({ gameId }: { gameId: string }) {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [openComments, setOpenComments] = useState<Set<string>>(new Set())

    const fetchPosts = useCallback(async () => {
        try {
            // Fetch posts with likes relationship
            const { data, error } = await supabase
                .from('posts')
                .select('*, likes(user_id)')
                .eq('game_id', gameId)
                .order('created_at', { ascending: false })

            if (error) throw error

            // Map data to include counts and user data
            const postsWithCounts = (data as any[]).map(post => {
                const postLikes = post.likes || []
                return {
                    ...post,
                    likes_count: postLikes.length,
                    user_has_liked: currentUser ? postLikes.some((like: any) => like.user_id === currentUser.id) : false
                }
            })

            setPosts(postsWithCounts)
        } catch (error) {
            console.error('Error fetching posts:', error)
            // If it's a 400/PGRST204 (relation not found), fetch without likes as fallback
            try {
                const { data, error: secondError } = await supabase
                    .from('posts')
                    .select('*')
                    .eq('game_id', gameId)
                    .order('created_at', { ascending: false })
                if (secondError) throw secondError
                setPosts(data as Post[])
            } catch (err) {
                console.error('Final fallback error:', err)
            }
        } finally {
            setLoading(false)
        }
    }, [gameId, currentUser])

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setCurrentUser(session?.user ?? null)
        })
    }, [])

    useEffect(() => {
        if (currentUser !== undefined) {
            fetchPosts()
        }
    }, [fetchPosts, currentUser])

    const toggleComments = (postId: string) => {
        const newSet = new Set(openComments)
        if (newSet.has(postId)) {
            newSet.delete(postId)
        } else {
            newSet.add(postId)
        }
        setOpenComments(newSet)
    }

    const handleDelete = async (postId: string) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบโพสต์นี้? หากลบแล้วจะไม่สามารถกู้คืนได้')) return

        try {
            const postToDelete = posts.find(p => p.id === postId)
            if (!postToDelete) return

            const imagesToDelete: string[] = []

            if (postToDelete.image_url && postToDelete.image_url.includes('post-images')) {
                const path = postToDelete.image_url.split('/post-images/')[1]
                if (path) imagesToDelete.push(path)
            }

            if (postToDelete.content) {
                const parser = new DOMParser()
                const doc = parser.parseFromString(postToDelete.content, 'text/html')
                const imgs = doc.getElementsByTagName('img')

                for (let i = 0; i < imgs.length; i++) {
                    const src = imgs[i].src
                    if (src.includes('/post-images/')) {
                        const path = src.split('/post-images/')[1]
                        if (path) {
                            imagesToDelete.push(decodeURIComponent(path))
                        }
                    }
                }
            }

            if (imagesToDelete.length > 0) {
                await supabase.storage.from('post-images').remove(imagesToDelete)
            }

            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId)
                .eq('user_id', currentUser?.id)

            if (error) throw error

            setPosts(prev => prev.filter(p => p.id !== postId))
        } catch (error) {
            console.error('Error deleting post:', error)
            alert('ลบโพสต์ไม่สำเร็จ')
        }
    }

    const [searchQuery, setSearchQuery] = useState('')
    const [dateFilter, setDateFilter] = useState<'all' | '7days'>('all')

    const filteredPosts = posts.filter(post => {
        const matchesSearch = (post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (post.username?.toLowerCase().includes(searchQuery.toLowerCase()) || false)

        let matchesDate = true
        if (dateFilter === '7days') {
            const postDate = new Date(post.created_at)
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
            matchesDate = postDate >= sevenDaysAgo
        }

        return matchesSearch && matchesDate
    })

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="ค้นหาโพสต์..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setDateFilter('all')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${dateFilter === 'all' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        ทั้งหมด
                    </button>
                    <button
                        onClick={() => setDateFilter('7days')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${dateFilter === '7days' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        7 วันล่าสุด
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-500">กำลังโหลดโพสต์...</div>
            ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                    <div className="text-gray-400 mb-2">ไม่พบโพสต์</div>
                    <p className="text-gray-500">
                        {posts.length === 0 ? 'ยังไม่มีโพสต์ เป็นคนแรกที่เริ่มพูดคุย!' : 'ไม่พบโพสต์ที่ค้นหา'}
                    </p>
                </div>
            ) : (
                filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 relative group animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <UserAvatar size="md" name={post.username} />
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{post.username || 'User'}</div>
                                    <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString('th-TH')}</div>
                                </div>
                            </div>

                            {currentUser?.id === post.user_id && (
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100"
                                    title="ลบโพสต์"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {post.title && (
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                        )}

                        <div
                            className="prose dark:prose-invert max-w-none mb-4 text-gray-700 dark:text-gray-300"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {post.image_url && !post.content.includes(post.image_url) && (
                            <div className="mb-4 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                                <img src={post.image_url} alt="Post attachment" className="w-full max-h-96 object-cover" />
                            </div>
                        )}

                        <div className="border-t border-gray-100 dark:border-gray-800 pt-2">
                            <PostActions
                                post={post}
                                currentUserId={currentUser?.id}
                                onCommentClick={() => toggleComments(post.id)}
                            />
                        </div>

                        {openComments.has(post.id) && (
                            <CommentSection
                                postId={post.id}
                                currentUser={currentUser}
                            />
                        )}
                    </div>
                ))
            )}
        </div>
    )
}
