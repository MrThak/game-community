import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import GamePageLayout from '@/components/layout/GamePageLayout'
import Link from 'next/link'
import { ArrowLeft, User, Calendar } from 'lucide-react'
import CommentSection from '@/components/team/CommentSection'
import TeamActionButtons from '@/components/team/TeamActionButtons'

// Force dynamic to ensure we get fresh data
export const dynamic = 'force-dynamic'

export default async function TeamDetailPage({ params }: { params: Promise<{ gameId: string, teamId: string }> }) {
    const { gameId, teamId } = await params

    const { data: game } = await supabase.from('games').select('*').eq('id', gameId).single()
    if (!game) return notFound()

    const tables = game.metadata?.tables || {}
    const teamTableName = tables.teams || 'seven_knights_teams'

    const { data: team, error } = await supabase
        .from(teamTableName)
        .select('*')
        .eq('id', teamId)
        .single()

    if (error || !team) {
        return notFound()
    }

    const frontRow = (team.formation?.front as string[]) || []
    const backRow = (team.formation?.back as string[]) || []

    return (
        <GamePageLayout>
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header / Nav */}
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href={`/games/${gameId}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg border border-gray-700 hover:scale-105 active:scale-95 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">กลับไปหน้าจัดทีม</span>
                    </Link>

                    {/* Actions (Edit/Delete) - Client Side Ownership Check */}
                    <TeamActionButtons
                        teamId={teamId}
                        ownerId={team.user_id}
                        gameId={gameId}
                        tableName={teamTableName}
                    />
                </div>

                {/* Team Info Card */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-800 mb-8 overflow-hidden relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start relative z-10">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${team.mode === 'Arena'
                                        ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                        : 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
                                    }`}>
                                    {team.mode}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(team.created_at).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight uppercase italic">{team.name}</h1>
                            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 border-l-4 border-blue-500 pl-4 py-1">
                                <User className="w-5 h-5 text-blue-500/60" />
                                <span className="font-medium text-lg">โดย <span className="text-gray-900 dark:text-gray-200 font-bold">{team.username || 'Anonymous'}</span></span>
                            </div>
                        </div>

                        {/* Pet Display */}
                        {team.pet_image_url && (
                            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-inner group">
                                <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                                    <img src={team.pet_image_url} alt="Pet" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">สัตว์เลี้ยงประจำทีม</div>
                                    <div className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-600">PET ENABLED</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 my-8" />

                    {/* Formation Visualization - Tightened up */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-slate-100 dark:bg-slate-800/80 rounded-3xl p-4 md:p-10 shadow-inner relative border-2 border-slate-200 dark:border-slate-700/50">
                            <div className="absolute top-4 right-6 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded opacity-50">FORMATION GRID</div>

                            <div className="flex items-start justify-center gap-8 md:gap-16">
                                {/* Back Row */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex flex-col items-center gap-3">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="w-14 h-14 md:w-20 md:h-20 aspect-square bg-white dark:bg-gray-900 rounded-xl border-2 border-slate-300 dark:border-gray-700 shadow-sm flex items-center justify-center relative overflow-hidden group/slot">
                                                {backRow[i] ? (
                                                    <img src={backRow[i]} alt="" className="w-full h-full object-cover group-hover/slot:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">BACK ROW</h3>
                                </div>

                                {/* Divider */}
                                <div className="h-64 md:h-96 w-0.5 bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-600 to-transparent self-center opacity-50" />

                                {/* Front Row */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex flex-col items-center gap-3">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div key={i} className="w-14 h-14 md:w-20 md:h-20 aspect-square bg-white dark:bg-gray-900 rounded-xl border-2 border-slate-300 dark:border-gray-700 shadow-sm flex items-center justify-center relative overflow-hidden group/slot">
                                                {frontRow[i] ? (
                                                    <img src={frontRow[i]} alt="" className="w-full h-full object-cover group-hover/slot:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">FRONT ROW</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comment Section */}
                <CommentSection teamId={teamId} />
            </div>
        </GamePageLayout>
    )
}

{/* Comment Section */ }
<CommentSection teamId={teamId} /> 
            </div >
        </GamePageLayout >
    )
}
