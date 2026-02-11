import Link from 'next/link'
import { PawPrint, Edit, Trash2, Star } from 'lucide-react'
import { Pet } from '@/types/pet'

interface PetCardProps {
    pet: Pet
    isAdmin?: boolean
    onDelete?: (id: string) => void
}

export default function PetCard({ pet, isAdmin, onDelete }: PetCardProps) {
    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (confirm('คุณแน่ใจหรือไม่ว่าจะลบสัตว์เลี้ยงนี้?')) {
            onDelete?.(pet.id)
        }
    }

    return (
        <div className="relative group block">
            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Image Aspect Ratio Container */}
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                    {pet.image_url ? (
                        <img
                            src={pet.image_url}
                            alt={pet.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                            <PawPrint className="w-12 h-12 opacity-20" />
                        </div>
                    )}

                    {/* Rarity Badge */}
                    {pet.rarity && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-lg">
                            {pet.rarity}
                        </div>
                    )}
                </div>

                {/* Info Content */}
                <div className="p-3">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{pet.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{pet.description || 'สัตว์เลี้ยงคู่ใจ'}</p>
                </div>
            </div>

            {/* Admin Controls Overlay */}
            {isAdmin && (
                <div className="absolute top-2 left-2 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/games/${pet.game_id}/pets/${pet.id}/edit`}>
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
