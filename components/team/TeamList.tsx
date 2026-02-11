'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import TeamCard, { Team } from './TeamCard'
import { Plus, Search, Loader2, Swords, Shield } from 'lucide-react'
import TeamBuilder from './TeamBuilder'

export default function TeamList({ gameId }: { gameId: string }) {
    const [teams, setTeams] = useState<Team[]>([])
    const [loading, setLoading] = useState(true)
    const [filterMode, setFilterMode] = useState<'All' | 'Arena' | 'GuildWar'>('All')
    const [isCreating, setIsCreating] = useState(false)

    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchTeams()
    }, [gameId])

    const fetchTeams = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('teams')
            .select('*')
            .eq('game_id', gameId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching teams:', error)
        } else {
            setTeams(data || [])
        }
        setLoading(false)
    }

    const filteredTeams = teams.filter(team => {
        // Filter by Mode
        if (filterMode !== 'All' && team.mode !== filterMode) return false

        // Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            return (
                team.name.toLowerCase().includes(query) ||
                (team.author_name && team.author_name.toLowerCase().includes(query))
            )
        }

        return true
    })

    if (isCreating) {
        return (
            <div className="animate-fade-in">
                <button
                    onClick={() => setIsCreating(false)}
                    className="mb-4 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 flex items-center gap-1"
                >
                    ← Back to Team List
                </button>
                <TeamBuilder gameId={gameId} onTeamCreated={() => { setIsCreating(false); fetchTeams(); }} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Filter Buttons */}
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => setFilterMode('All')}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterMode === 'All' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            ทั้งหมด
                        </button>
                        <button
                            onClick={() => setFilterMode('Arena')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterMode === 'Arena' ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            <Swords className="w-3 h-3" />
                            Arena
                        </button>
                        <button
                            onClick={() => setFilterMode('GuildWar')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterMode === 'GuildWar' ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            <Shield className="w-3 h-3" />
                            Guild War
                        </button>
                    </div>

                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-bold shadow-md transition-all hover:scale-105"
                    >
                        <Plus className="w-4 h-4" />
                        จัดทีมใหม่
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <input
                        placeholder="ค้นหาชื่อทีม หรือชื่อผู้จัดทีม..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    กำลังโหลดข้อมูลทีม...
                </div>
            ) : filteredTeams.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                    <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Swords className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">ยังไม่มีทีมในหมวดนี้</h3>
                    <p className="text-gray-500 mb-6">มาแบ่งปันเทคนิคการจัดทีมของคุณกันเถอะ!</p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                        สร้างทีมแรกเลย!
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map(team => (
                        <TeamCard key={team.id} team={team} />
                    ))}
                </div>
            )}
        </div>
    )
}
