import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import GamePageLayout from '@/components/layout/GamePageLayout'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, User, Shield, Swords, Calendar } from 'lucide-react'
import DeleteTeamButton from '@/components/team/DeleteTeamButton' // We will create this
import CommentSection from '@/components/team/CommentSection' // We will create this

// Force dynamic to ensure we get custom RLS checks or fresh data
export const dynamic = 'force-dynamic'

export default async function TeamDetailPage({ params }: { params: Promise<{ gameId: string, teamId: string }> }) {
    const { gameId, teamId } = await params

    // 1. Fetch Team Data
    // We need to know which table to query. "seven_knights_teams" is hardcoded for now or we fetch game metadata?
    // For now, let's assume seven_knights_teams based on the gameId context logic we've seen, 
    // OR we can fetch game metadata first.
    // To be safe and consistent with other pages, let's fetch game first.
    const { data: game } = await supabase.from('games').select('*').eq('id', gameId).single()
    if (!game) return notFound()
    
    const teamTableName = game.metadata?.tables?.teams || 'seven_knights_teams'

    const { data: team, error } = await supabase
        .from(teamTableName)
        .select('*')
        .eq('id', teamId)
        .single()

    if (error || !team) {
        console.error('Error fetching team:', error)
        return notFound()
    }

    // 2. Fetch User Session (to check ownership)
    const { data: { session } } = await supabase.auth.getSession()
    const currentUserId = session?.user?.id
    const isOwner = currentUserId && currentUserId === team.user_id

    // Helper for formation display
    // Team formation is stored as { front: string[], back: string[] } of image URLs (as per TeamBuilder)
    // We can verify this structure.
    const frontRow = (team.formation?.front as string[]) || []
    const backRow = (team.formation?.back as string[]) || []

    return (
        <GamePageLayout>
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header / Nav */}
                <div className="mb-6 flex items-center justify-between">
                    <Link 
                        href={`/games/${gameId}`}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        กลับไปหน้าจัดทีม
                    </Link>

                    {/* Actions (Edit/Delete) - Only for Owner */}
                    {isOwner && (
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/games/${gameId}/teams/${teamId}/edit`}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                แก้ไข
                            </Link>
                            <DeleteTeamButton 
                                teamId={teamId} 
                                tableName={teamTableName} 
                                redirectUrl={`/games/${gameId}`} 
                            />
                        </div>
                    )}
                </div>

                {/* Team Info Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 mb-8">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    team.mode === 'Arena' 
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                }`}>
                                    {team.mode}
                                </span>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(team.created_at).toLocaleDateString('th-TH')}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{team.name}</h1>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <User className="w-4 h-4" />
                                <span>โดย {team.username || 'Anonymous'}</span>
                            </div>
                        </div>
                        
                        {/* Pet Display */}
                        {team.pet_image_url && (
                            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                                <img src={team.pet_image_url} alt="Pet" className="w-16 h-16 rounded-lg object-cover" />
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">สัตว์เลี้ยง</div>
                                    <div className="font-bold text-gray-900 dark:text-white">Pet Enabled</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 my-6" />

                    {/* Formation Visualization */}
                    <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl p-6 shadow-inner relative min-h-[300px]">
                        <div className="absolute top-2 right-4 text-xs font-mono text-slate-400">FORMATION VIEW</div>
                        
                        <div className="flex h-full gap-4 md:gap-8 justify-center">
                            {/* Back Row */}
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 border-r-2 border-dashed border-slate-300 dark:border-slate-700 pr-4 max-w-xs">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center w-full mb-2">Back Row</h3>
                                <div className="grid grid-rows-5 gap-2 w-full">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="aspect-[4/5] bg-slate-100 dark:bg-slate-700 rounded border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center relative overflow-hidden">
                                            {backRow[i] ? (
                                                <img src={backRow[i]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-slate-300">+</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Front Row */}
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 pl-4 border-l-2 border-dashed border-slate-300 dark:border-slate-700 max-w-xs">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center w-full mb-2">Front Row</h3>
                                <div className="grid grid-rows-5 gap-2 w-full">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="aspect-[4/5] bg-slate-100 dark:bg-slate-700 rounded border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center relative overflow-hidden">
                                            {frontRow[i] ? (
                                                <img src={frontRow[i]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-slate-300">+</span>
                                            )}
                                        </div>
                                    ))}
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
