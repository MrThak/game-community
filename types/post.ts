export interface Post {
    id: string
    created_at: string
    content: string
    game_id: string
    user_id: string
    username?: string
    title?: string
    image_url?: string
    likes_count?: number
    user_has_liked?: boolean
}
