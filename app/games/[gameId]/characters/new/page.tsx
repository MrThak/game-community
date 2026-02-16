import CharacterForm from '@/components/game/CharacterForm'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function NewCharacterPage({ params }: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await params

    const { data: game } = await supabase
        .from('games')
        .select('metadata')
        .eq('id', gameId)
        .single()

    const tableName = game?.metadata?.tables?.characters || 'characters'

    return <CharacterForm gameId={gameId} tableName={tableName} />
}
