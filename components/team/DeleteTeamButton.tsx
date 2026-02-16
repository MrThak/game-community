'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeleteTeamButton({ teamId, tableName, redirectUrl }: { teamId: string, tableName: string, redirectUrl: string }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบทีมนี้? การกระทำนี้ไม่สามารถย้อนกลับได้')) return

        setIsDeleting(true)
        try {
            const { error } = await supabase
                .from(tableName)
                .delete()
                .eq('id', teamId)

            if (error) throw error

            alert('ลบทีมสำเร็จแล้ว')
            router.push(redirectUrl)
            router.refresh()
        } catch (error: any) {
            console.error('Delete failed:', error)
            alert(`ไม่สามารถลบทีมได้: ${error.message}`)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            ลบทีม
        </button>
    )
}
