'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Game } from '@/types/game'
import GameManager from '@/components/admin/GameManager'
import { Trash2 } from 'lucide-react'

export default function AdminPage() {
    const [games, setGames] = useState<Game[]>([])

    const fetchGames = useCallback(async () => {
        const { data } = await supabase.from('games').select('*').order('created_at', { ascending: false })
        if (data) setGames(data as Game[])
    }, [])

    useEffect(() => {
        fetchGames()
    }, [fetchGames])

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this game? This will also delete all posts and comments for this game.')) return

        try {
            const { error } = await supabase.from('games').delete().eq('id', id)
            if (error) throw error
            fetchGames()
        } catch (error) {
            console.error('Error deleting game:', error)
            alert('Failed to delete game.')
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <GameManager onGameAdded={fetchGames} />

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold">Existing Games ({games.length})</h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {games.map((game) => (
                        <div key={game.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                                    {game.icon_url === '-' || !game.icon_url ? (
                                        <span className="text-xs text-gray-500">No Img</span>
                                    ) : (
                                        <img src={game.icon_url} alt={game.name} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{game.name}</h3>
                                    <p className="text-xs text-gray-500">ID: {game.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={async () => {
                                        const newStatus = game.status === 'coming_soon' ? 'active' : 'coming_soon'
                                        const { error } = await supabase.from('games').update({ status: newStatus }).eq('id', game.id)
                                        if (!error) fetchGames()
                                    }}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${game.status === 'coming_soon'
                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                        }`}
                                >
                                    {game.status === 'coming_soon' ? 'Coming Soon' : 'Active'}
                                </button>
                                <button
                                    onClick={() => handleDelete(game.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete Game"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>                        </div>
                    ))}
                    {games.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No games found. Add one above!</div>
                    )}
                </div>
            </div>
        </div>
    )
}
