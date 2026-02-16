'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import CharacterCard from './CharacterCard'
import { Character } from '@/types/character'
import { Search, Loader2, Plus, DatabaseBackup } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'
import Link from 'next/link'

// Mock Data for "Auto-Seed" feature
const SEVEN_KNIGHTS_DATA = [
    { name: 'Rudy', role: 'Tank' },
    { name: 'Eileene', role: 'DPS' },
    { name: 'Rachel', role: 'DPS' },
    { name: 'Dellons', role: 'DPS' },
    { name: 'Jave', role: 'Tank' },
    { name: 'Spike', role: 'DPS' },
    { name: 'Kris', role: 'DPS' },
    { name: 'Teo', role: 'DPS' },
    { name: 'Karma', role: 'Magic' },
    { name: 'Kyle', role: 'DPS' },
    { name: 'Yeonhee', role: 'Magic' },
    { name: 'Ace', role: 'DPS' },
    { name: 'Sun Wukong', role: 'Tank' },
    { name: 'Lu Bu', role: 'DPS' },
    { name: 'Rin', role: 'Magic' }
]

export default function CharacterList({ gameId, tableName }: { gameId: string, tableName: string }) {
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSeeding, setIsSeeding] = useState(false)
    const { isAdmin } = useAdmin()

    useEffect(() => {
        if (tableName) fetchCharacters()
    }, [gameId, tableName])

    const fetchCharacters = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('game_id', gameId)
            // .order('element', { ascending: true }) // Element might not exist in all games, maybe remove sort or check schema. Keeping it simple for now or catch error.
            // Safe bet: just select * and sort by created_at or name if element is missing. Table-per-game means we know structure, but CharacterList is shared.
            // Let's remove specific order field that might not exist or keep it if we assume standard structure.
            // User requested specific columns for 7Knights which didn't strictly say 'element' was removed, but listed a subset. 
            // In the implementation plan, "element" was removed from 7Knights list. So sorting by element will fail!
            // I should change sort to 'name' or 'created_at'.
            .order('name', { ascending: true })

        if (error) {
            console.error('Error fetching characters:', error)
        } else {
            setCharacters(data || [])
        }
        setLoading(false)
    }

    const handleAutoSeed = async () => {
        if (!confirm('ยืนยันที่จะนำเข้าข้อมูลตัวละครเริ่มต้น (Seven Knights)?')) return

        setIsSeeding(true)
        try {
            // Prepare data with game_id
            const mockData = SEVEN_KNIGHTS_DATA.map(char => ({
                ...char,
                game_id: gameId,
                image_url: `https://ui-avatars.com/api/?name=${char.name}&background=random&size=256` // Placeholder
            }))

            const { error } = await supabase.from(tableName).insert(mockData)

            if (error) throw error

            alert('นำเข้าข้อมูลเรียบร้อย!')
            fetchCharacters() // Refresh list
        } catch (error: any) {
            console.error('Seeding failed:', error)
            alert(`เกิดข้อผิดพลาด: ${error.message}`)
        } finally {
            setIsSeeding(false)
        }
    }

    const filteredCharacters = characters.filter(char =>
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.role?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDeleteCharacter = async (id: string) => {
        try {
            const { error } = await supabase.from(tableName).delete().eq('id', id)
            if (error) throw error
            setCharacters(characters.filter(c => c.id !== id))
        } catch (error: any) {
            console.error('Delete failed:', error)
            alert(`ลบไม่สำเร็จ: ${error.message}`)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header / Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="relative w-full sm:w-64">
                    <input
                        type="text"
                        placeholder="Search Character..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                </div>

                {/* Admin / Contribution Controls */}
                <div className="flex gap-2">
                    {/* Admin Access Only */}
                    {isAdmin && (
                        <>
                            {/* Only show Seed button if list is empty (Helper for user) */}
                            {characters.length === 0 && (
                                <button
                                    onClick={handleAutoSeed}
                                    disabled={isSeeding}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                    {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <DatabaseBackup className="w-4 h-4" />}
                                    Auto Import (7K)
                                </button>
                            )}

                            <Link href={`/games/${gameId}/characters/new`}>
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                                    <Plus className="w-4 h-4" />
                                    Add Character
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading characters...</div>
            ) : filteredCharacters.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                    <p className="text-gray-500 mb-4">No characters found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredCharacters.map(char => (
                        <CharacterCard
                            key={char.id}
                            character={char}
                            isAdmin={isAdmin}
                            onDelete={handleDeleteCharacter}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
