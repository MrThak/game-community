import PetForm from '@/components/game/PetForm'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function NewPetPage({ params }: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await params

    const { data: game } = await supabase
        .from('games')
        .select('metadata')
        .eq('id', gameId)
        .single()

    const tableName = game?.metadata?.tables?.pets || 'pets'

    return <PetForm gameId={gameId} tableName={tableName} />
}
