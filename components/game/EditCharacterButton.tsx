'use client'

import { useAdmin } from '@/hooks/useAdmin'
import { Edit } from 'lucide-react'
import Link from 'next/link'

interface EditCharacterButtonProps {
    gameId: string
    characterId: string
}

export default function EditCharacterButton({ gameId, characterId }: EditCharacterButtonProps) {
    const { isAdmin } = useAdmin()

    if (!isAdmin) return null

    return (
        <Link href={`/games/${gameId}/characters/${characterId}/edit`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors backdrop-blur-sm bg-opacity-90">
                <Edit className="w-4 h-4" />
                <span>แก้ไขข้อมูล</span>
            </button>
        </Link>
    )
}
