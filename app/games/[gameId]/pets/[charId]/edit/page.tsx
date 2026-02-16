import PetForm from '@/components/game/PetForm'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function EditPetPage({ params }: { params: Promise<{ gameId: string, charId: string }> }) {
    const { gameId, charId } = await params

    const { data: game } = await supabase
        .from('games')
        .select('metadata')
        .eq('id', gameId)
        .single()

    const tableName = game?.metadata?.tables?.pets || 'pets'

    return <PetForm gameId={gameId} petId={charId} tableName={tableName} />
}
