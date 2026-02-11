import CharacterForm from '@/components/game/CharacterForm'

export default async function NewCharacterPage({ params }: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await params
    return <CharacterForm gameId={gameId} />
}
