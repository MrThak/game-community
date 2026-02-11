import PetForm from '@/components/game/PetForm'

export default async function NewPetPage({ params }: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await params
    return <PetForm gameId={gameId} />
}
