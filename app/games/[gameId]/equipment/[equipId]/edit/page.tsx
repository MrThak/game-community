import EquipmentForm from '@/components/game/EquipmentForm'

export default async function EditEquipmentPage({
    params
}: {
    params: Promise<{ gameId: string; equipId: string }>
}) {
    const { gameId, equipId } = await params

    return (
        <div className="min-h-screen py-8">
            <EquipmentForm gameId={gameId} equipmentId={equipId} />
        </div>
    )
}
