'use client'

import { useState } from 'react'
import { Game } from '@/types/game'
import PostList from '@/components/feed/PostList'
import PostForm from '@/components/feed/PostForm'
import CharacterList from './CharacterList'
import TeamList from '../team/TeamList'
import { LayoutDashboard, PenSquare, Info, Gamepad2, Users, PawPrint } from 'lucide-react'
import PetList from './PetList'

export default function GameCommunity({ game }: { game: Game }) {
    const [activeTab, setActiveTab] = useState<'feed' | 'create' | 'characters' | 'teams' | 'pets'>('feed')

    // Extract table names from metadata
    const tables = game.metadata?.tables || {}
    const characterTableName = tables.characters || ''
    const petTableName = tables.pets || ''
    const teamTableName = tables.teams || ''

    // Feature Flags based on metadata (or fallback)
    const hasCharacters = !!characterTableName
    const hasPets = !!petTableName
    const hasTeams = !!teamTableName

    // Compatibility with old "hiddenFeaturesGames" logic (optional, but let's migrate to metadata-driven)
    // If metadata is empty, fallback? No, let's assume we must populate metadata for new system.
    // For old games in DB without metadata, they might break.
    // But since we just created "games" table with defaults, and migrated, we rely on metadata.

    // Customize labels for specific games
    const isCardGame = game.name === 'Master Duel'
    const characterLabel = isCardGame ? 'การ์ด (Cards)' : 'ตัวละคร (Characters)'
    const characterHeader = isCardGame ? 'ฐานข้อมูลการ์ด' : 'ฐานข้อมูลตัวละคร'

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Sidebar (Left Column) */}
            <div className="md:col-span-1 space-y-6">
                {/* ... existing card ... */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4 flex items-center justify-center overflow-hidden shadow-inner">
                        {game.icon_url === '-' || !game.icon_url ? (
                            <Gamepad2 className="w-10 h-10 text-gray-400" />
                        ) : (
                            <img src={game.icon_url} alt={game.name} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{game.name}</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Community</p>
                </div>

                {/* Navigation Menu */}
                <nav className="bg-white dark:bg-gray-900 rounded-xl p-2 shadow-sm border border-gray-200 dark:border-gray-800 space-y-1">
                    <button
                        onClick={() => setActiveTab('feed')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'feed'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        หน้าหลัก (Feed)
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'create'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                    >
                        <PenSquare className="w-5 h-5" />
                        เขียนโพสต์ (Post)
                    </button>

                    {hasCharacters && (
                        <button
                            onClick={() => setActiveTab('characters')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'characters'
                                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <Info className="w-5 h-5" />
                            {characterLabel}
                        </button>
                    )}

                    {hasPets && (
                        <button
                            onClick={() => setActiveTab('pets')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'pets'
                                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <PawPrint className="w-5 h-5" />
                            สัตว์เลี้ยง (Pets)
                        </button>
                    )}

                    {hasTeams && (
                        <button
                            onClick={() => setActiveTab('teams')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'teams'
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            <Users className="w-5 h-5" />
                            จัดทีม (Teams)
                        </button>
                    )}
                </nav>
            </div>

            {/* Main Content (Right Column) */}
            <div className="md:col-span-3">
                {activeTab === 'feed' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">อัปเดตล่าสุด</h2>
                            <button
                                onClick={() => setActiveTab('create')}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                + เขียนโพสต์ใหม่
                            </button>
                        </div>
                        <PostList gameId={game.id} />
                    </div>
                )}

                {activeTab === 'create' && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">เขียนโพสต์ใหม่</h2>
                        <PostForm gameId={game.id} onPostCreated={() => {
                            // Keep user on create tab, just clear form (handled inside PostForm)
                            // Maybe trigger a toast here if we had one
                        }} />
                    </div>
                )}

                {activeTab === 'characters' && hasCharacters && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{characterHeader}</h2>
                        <CharacterList gameId={game.id} tableName={characterTableName} />
                    </div>
                )}

                {activeTab === 'pets' && hasPets && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">ฐานข้อมูลสัตว์เลี้ยง</h2>
                        <PetList gameId={game.id} tableName={petTableName} />
                    </div>
                )}

                {activeTab === 'teams' && hasTeams && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">ระบบจัดทีม (Team Builder)</h2>
                        <TeamList
                            gameId={game.id}
                            tableName={teamTableName}
                            characterTableName={characterTableName}
                            petTableName={petTableName}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
