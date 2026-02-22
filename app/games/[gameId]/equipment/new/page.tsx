import EquipmentForm from '@/components/game/EquipmentForm'

export default async function NewEquipmentPage({
    params
}: {
    params: Promise<{ gameId: string }>
}) {
    const { gameId } = await params

    return (
        <div className="min-h-screen py-8">
            <EquipmentForm gameId={gameId} />
        </div>
    )
}
