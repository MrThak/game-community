import Link from 'next/link'
import { Sword, Shield, Heart, Zap, Star, Edit, Trash2 } from 'lucide-react'
import { Character } from '@/types/character'

interface CharacterCardProps {
    character: Character
    isAdmin?: boolean
    onDelete?: (id: string) => void
}

export default function CharacterCard({ character, isAdmin, onDelete }: CharacterCardProps) {
    // Helper to get element color
    const getElementColor = (element?: string) => {
        switch (element?.toLowerCase()) {
            case 'fire': return 'bg-red-500'
            case 'water': return 'bg-blue-500'
            case 'earth': return 'bg-green-500'
            case 'wind': return 'bg-teal-500'
            case 'dark': return 'bg-purple-900'
            case 'light': return 'bg-yellow-400'
            default: return 'bg-gray-500'
        }
    }

    // Helper to get role icon
    const getRoleIcon = (role?: string) => {
        switch (role?.toLowerCase()) {
            case 'tank': return <Shield className="w-3 h-3" />
            case 'dps': return <Sword className="w-3 h-3" />
            case 'support': return <Heart className="w-3 h-3" />
            case 'magic': return <Zap className="w-3 h-3" />
            default: return <Star className="w-3 h-3" />
        }
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent link navigation
        e.stopPropagation()
        if (confirm('คุณแน่ใจหรือไม่ว่าจะลบตัวละครนี้?')) {
            onDelete?.(character.id)
        }
    }

    return (
        <div className="relative group block">
            <Link href={`/games/${character.game_id}/characters/${character.id}`} className="block">
                <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Image Aspect Ratio Container */}
                    <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                        {character.image_url ? (
                            <img
                                src={character.image_url}
                                alt={character.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                                <Sword className="w-12 h-12 opacity-20" />
                            </div>
                        )}

                        {/* Element Badge */}
                        {character.element && (
                            <div className={`absolute top-2 right-2 ${getElementColor(character.element)} text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-lg`}>
                                {character.element}
                            </div>
                        )}
                    </div>

                    {/* Info Content */}
                    <div className="p-3">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{character.name}</h3>

                        <div className="flex items-center gap-2 mt-2">
                            {character.rarity && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                    {character.rarity}
                                </span>
                            )}
                            {character.role && (
                                <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                                    {getRoleIcon(character.role)}
                                    <span>{character.role}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Admin Controls Overlay */}
            {isAdmin && (
                <div className="absolute top-2 left-2 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/games/${character.game_id}/characters/${character.id}/edit`}>
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
