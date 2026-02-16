import Link from 'next/link'
import { Sword, Shield, Heart, Zap, Star, Edit, Trash2 } from 'lucide-react'
import { Character } from '@/types/character'

interface CharacterCardProps {
    character: Character
    isAdmin?: boolean
    onDelete?: (id: string) => void
}

export default function CharacterCard({ character, isAdmin, onDelete }: CharacterCardProps) {
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

                    </div>

                    {/* Info Content */}
                    <div className="p-3">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{character.name}</h3>

                        <div className="flex items-center gap-2 mt-2">


                            {character.role && (
                                <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                                    {getRoleIcon(character.role)}
                                    <span>{character.role}</span>
                                </div>
                            )}

                            {character.recommended_stages && character.recommended_stages.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {character.recommended_stages.slice(0, 3).map((stage, i) => (
                                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                            {stage}
                                        </span>
                                    ))}
                                    {character.recommended_stages.length > 3 && (
                                        <span className="text-[9px] text-gray-400">+{character.recommended_stages.length - 3}</span>
                                    )}
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
