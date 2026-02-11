import CharacterForm from '@/components/game/CharacterForm'

export default async function EditCharacterPage({ params }: { params: Promise<{ gameId: string, charId: string }> }) {
    const { gameId, charId } = await params
    return <CharacterForm gameId={gameId} characterId={charId} />
}
