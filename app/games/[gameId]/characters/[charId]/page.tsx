import { supabase } from '@/lib/supabase'
import { Character } from '@/types/character'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sword, Shield, Zap, Star, Heart, Award } from 'lucide-react'
import EditCharacterButton from '@/components/game/EditCharacterButton'

export const dynamic = 'force-dynamic'

export default async function CharacterDetailPage({ params }: { params: Promise<{ gameId: string, charId: string }> }) {
    const { gameId, charId } = await params

    // 1. Get Game Config for Table Name
    const { data: game } = await supabase
        .from('games')
        .select('metadata')
        .eq('id', gameId)
        .single()

    const tableName = game?.metadata?.tables?.characters || 'characters'

    // 2. Get Character
    const { data: char, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', charId)
        .single()

    if (error || !char) {
        notFound()
    }

    const character = char as Character

    const skillIcons = {
        normal: <Sword className="w-5 h-5 text-gray-400" />,
        skill1: <Zap className="w-5 h-5 text-blue-500" />,
        skill2: <Zap className="w-5 h-5 text-purple-500" />,
        passive: <Star className="w-5 h-5 text-yellow-500" />
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Back Link */}
                {/* Back Link */}
                <Link
                    href={`/games/${gameId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0a0a] hover:bg-black text-gray-300 hover:text-white transition-all border border-white/10 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/20 group mb-8"
                >
                    <div className="p-1 rounded-full bg-white/5 group-hover:bg-blue-600/20 text-gray-400 group-hover:text-blue-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">กลับไปหน้ารวม</span>
                </Link>

                {/* Admin Controls */}
                <div className="flex justify-end mb-4">
                    <EditCharacterButton gameId={gameId} characterId={charId} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Character Image & Basic Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl relative aspect-[3/4]">
                            {character.image_url ? (
                                <img
                                    src={character.image_url}
                                    alt={character.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                    <User className="w-20 h-20 text-gray-300" />
                                </div>
                            )}

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <h1 className="text-3xl font-bold mb-1">{character.name}</h1>
                                <div className="flex items-center gap-2">
                                    {character.name_en && (
                                        <span className="text-white/70 text-sm">{character.name_en}</span>
                                    )}
                                    {character.name_en && character.role && (
                                        <span className="text-white/30">•</span>
                                    )}
                                    <span className="text-gray-300 text-sm">{character.role}</span>
                                </div>
                            </div>
                        </div>

                        {/* Element Card - Removed as per request */}
                    </div>

                    {/* Right: Skills & Recommendations */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Summary / Description */}
                        {character.description && (
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">เกริ่นนำตัวละคร</h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {character.description}
                                </p>
                            </div>
                        )}

                        {/* Skills Section */}
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Zap className="w-6 h-6 text-blue-500" />
                                ข้อมูลสกิล
                            </h2>

                            <div className="grid gap-6">
                                {/* Normal Attack */}
                                <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                                    <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                        {skillIcons.normal}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 uppercase tracking-wider">โจมตีปกติ</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{character.normal_attack || 'ยังไม่มีข้อมูล'}</p>
                                    </div>
                                </div>

                                {/* Active Skills */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex gap-4 p-4 rounded-xl bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20">
                                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                            {skillIcons.skill1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-blue-600 dark:text-blue-400 text-sm mb-1 uppercase tracking-wider">สกิล 1</h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{character.skill_1 || 'ยังไม่มีข้อมูล'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 p-4 rounded-xl bg-purple-50/30 dark:bg-purple-900/10 border border-purple-100/50 dark:border-purple-900/20">
                                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                            {skillIcons.skill2}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-purple-600 dark:text-purple-400 text-sm mb-1 uppercase tracking-wider">สกิล 2</h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{character.skill_2 || 'ยังไม่มีข้อมูล'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Passive */}
                                <div className="flex gap-4 p-4 rounded-xl bg-yellow-50/30 dark:bg-yellow-900/10 border border-yellow-100/50 dark:border-yellow-900/20">
                                    <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                                        {skillIcons.passive}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-yellow-600 dark:text-yellow-400 text-sm mb-1 uppercase tracking-wider">แพสซีฟ</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{character.passive || 'ยังไม่มีข้อมูล'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Shield className="w-6 h-6" />
                                    อุปกรณ์แนะนำ
                                </h2>
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                        {character.recommended_set || 'ทีมงานกำลังรวบรวมข้อมูลเซตแนะนำสำหรับตัวละครนี้'}
                                    </p>
                                </div>
                            </div>
                            {/* Decorative Icon */}
                            <Star className="absolute -bottom-8 -right-8 w-40 h-40 text-white/5 rotate-12" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function User(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
