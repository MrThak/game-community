import PetForm from '@/components/game/PetForm'

export default async function EditPetPage({ params }: { params: Promise<{ gameId: string, charId: string }> }) {
    const { gameId, charId } = await params // Using charId as param name matching route folder structure if needed or [petId]
    return <PetForm gameId={gameId} petId={charId} />
}
