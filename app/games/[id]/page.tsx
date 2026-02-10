import { supabase } from '@/lib/supabase'
import { Game } from '@/types/game'
import GameCommunity from '@/components/game/GameCommunity'
import { notFound } from 'next/navigation'

// Force dynamic rendering to fetch fresh data
export const dynamic = 'force-dynamic'

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const { data: game, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !game) {
        notFound()
    }

    const typedGame = game as Game

    return (
        <div className="container mx-auto px-4 py-8">
            <GameCommunity game={typedGame} />
        </div>
    )
}
