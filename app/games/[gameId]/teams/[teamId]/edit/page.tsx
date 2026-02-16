import { supabase } from '@/lib/supabase'
import { notFound, redirect } from 'next/navigation'
import GamePageLayout from '@/components/layout/GamePageLayout'
import TeamBuilder from '@/components/team/TeamBuilder'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EditTeamPage({ params }: { params: Promise<{ gameId: string, teamId: string }> }) {
    const { gameId, teamId } = await params

    // 1. Fetch Game Metadata for table names
    const { data: game } = await supabase.from('games').select('*').eq('id', gameId).single()
    if (!game) return notFound()

    const tables = game.metadata?.tables || {}
    const teamTableName = tables.teams || 'seven_knights_teams'
    const charTableName = tables.characters || ''
    const petTableName = tables.pets || ''

    // 2. Fetch Team Data
    const { data: team, error } = await supabase
        .from(teamTableName)
        .select('*')
        .eq('id', teamId)
        .single()

    if (error || !team) return notFound()

    // 3. Check Ownership
    const { data: { session } } = await supabase.auth.getSession()
    if (!session || session.user.id !== team.user_id) {
        redirect(`/games/${gameId}/teams/${teamId}`)
    }

    return (
        <GamePageLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link
                        href={`/games/${gameId}/teams/${teamId}`}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        ยกเลิกการแก้ไข
                    </Link>
                </div>

                {/* TeamBuilder in Edit Mode */}
                <TeamBuilder
                    gameId={gameId}
                    tableName={teamTableName}
                    characterTableName={charTableName}
                    petTableName={petTableName}
                    onTeamCreated={() => { }} // Not used in Edit Mode (we'll handle redirect in component)
                    initialData={team}
                />
            </div>
        </GamePageLayout>
    )
}
