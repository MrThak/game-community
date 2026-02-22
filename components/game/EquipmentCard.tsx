import Link from 'next/link'
import { Sword, Shield, Star, Edit, Trash2, Hexagon } from 'lucide-react'
import { Equipment } from '@/types/equipment'

interface EquipmentCardProps {
    equipment: Equipment
    isAdmin?: boolean
    onDelete?: (id: string) => void
}

export default function EquipmentCard({ equipment, isAdmin, onDelete }: EquipmentCardProps) {
    // Helper to get type icon
    const getTypeIcon = (type?: string) => {
        switch (type?.toLowerCase()) {
            case 'weapon':
            case 'อาวุธ':
                return <Sword className="w-4 h-4" />
            case 'armor':
            case 'ชุดเกราะ':
                return <Shield className="w-4 h-4" />
            case 'accessory':
            case 'เครื่องประดับ':
                return <Star className="w-4 h-4" />
            default: return <Hexagon className="w-4 h-4" />
        }
    }

    const getRarityColor = (rarity: string) => {
        if (rarity.includes('ตำนาน') || rarity.includes('Legendary')) return 'bg-orange-500/10 text-orange-500 border-orange-500/30'
        if (rarity.includes('หายาก') || rarity.includes('Rare')) return 'bg-purple-500/10 text-purple-500 border-purple-500/30'
        if (rarity.includes('ระดับสูง') || rarity.includes('High')) return 'bg-blue-500/10 text-blue-500 border-blue-500/30'
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30' // Normal
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent link navigation
        e.stopPropagation()
        if (confirm('คุณแน่ใจหรือไม่ว่าจะลบอุปกรณ์นี้?')) {
            onDelete?.(equipment.id)
        }
    }

    return (
        <div className="relative group block h-full">
            <Link href={`/games/${equipment.game_id}/equipment/${equipment.id}`} className="block h-full">
                <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col cursor-pointer">
                    {/* Image Aspect Ratio Container */}
                    <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                        {equipment.image_url ? (
                            <img
                                src={equipment.image_url}
                                alt={equipment.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                                <Sword className="w-12 h-12 opacity-20" />
                            </div>
                        )}

                        {/* Rarity Badge */}
                        <div className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold rounded border backdrop-blur-sm ${getRarityColor(equipment.rarity)}`}>
                            {equipment.rarity.split(' ')[0]} {/* Show only Thai part if formatted as 'ตำนาน (Legendary)' */}
                        </div>
                    </div>

                    {/* Info Content */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white truncate" title={equipment.name}>{equipment.name}</h3>
                            {equipment.name_en && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{equipment.name_en}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            {equipment.type && (
                                <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                                    {getTypeIcon(equipment.type)}
                                    <span>{equipment.type}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Admin Controls Overlay */}
            {isAdmin && (
                <div className="absolute top-2 left-2 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/games/${equipment.game_id}/equipment/${equipment.id}/edit`}>
                        <button className="p-1.5 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-blue-600 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                            <Edit className="w-4 h-4" />
                        </button>
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="p-1.5 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-red-600 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
