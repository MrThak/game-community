import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://thaktalker.vercel.app' // Fallback URL

    // Get all games
    const { data: games } = await supabase
        .from('games')
        .select('id, updated_at')

    const gameUrls = (games || []).map((game) => ({
        url: `${baseUrl}/games/${game.id}`,
        lastModified: new Date(game.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...gameUrls,
    ]
}
