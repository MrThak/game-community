'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Edit } from 'lucide-react'
import DeleteTeamButton from './DeleteTeamButton'

export default function TeamActionButtons({
    teamId,
    ownerId,
    gameId,
    tableName
}: {
    teamId: string,
    ownerId: string,
    gameId: string,
    tableName: string
}) {
    const [isOwner, setIsOwner] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkOwnership = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            console.log('Session User ID:', session?.user?.id)
            console.log('Team Owner ID:', ownerId)

            if (session?.user?.id === ownerId) {
                console.log('Ownership verified! Showing buttons.')
                setIsOwner(true)
            } else {
                console.log('Ownership mismatch or no session.')
            }
            setLoading(false)
        }
        checkOwnership()
    }, [ownerId])

    if (loading || !isOwner) return null

    return (
        <div className="flex items-center gap-3 animate-fade-in">
            <Link
                href={`/games/${gameId}/teams/${teamId}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors shadow-sm"
            >
                <Edit className="w-4 h-4" />
                แก้ไข
            </Link>
            <DeleteTeamButton
                teamId={teamId}
                tableName={tableName}
                redirectUrl={`/games/${gameId}`}
            />
        </div>
    )
}
