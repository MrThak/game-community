'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import EquipmentCard from './EquipmentCard'
import { Equipment } from '@/types/equipment'
import { Search, Loader2, Plus, Filter } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'
import Link from 'next/link'

export default function EquipmentList({ gameId, tableName = 'equipment' }: { gameId: string, tableName?: string }) {
    const [equipments, setEquipments] = useState<Equipment[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState<string>('all')
    const { isAdmin } = useAdmin()

    useEffect(() => {
        if (tableName) fetchEquipments()
    }, [gameId, tableName])

    const fetchEquipments = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('game_id', gameId)
            .order('name', { ascending: true })

        if (error) {
            console.error('Error fetching equipments:', error)
        } else {
            setEquipments(data || [])
        }
        setLoading(false)
    }

    const filteredEquipments = equipments.filter(equip => {
        const matchesSearch = equip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (equip.name_en && equip.name_en.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesType = typeFilter === 'all' || equip.type === typeFilter

        return matchesSearch && matchesType
    })

    const handleDeleteEquipment = async (id: string) => {
        try {
            const { error } = await supabase.from(tableName).delete().eq('id', id)
            if (error) throw error
            setEquipments(equipments.filter(e => e.id !== id))
        } catch (error: any) {
            console.error('Delete failed:', error)
            alert(`ลบไม่สำเร็จ: ${error.message}`)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header / Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
                    <div className="relative w-full sm:max-w-xs">
                        <input
                            type="text"
                            placeholder="ค้นหาอุปกรณ์..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    </div>

                    <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg p-1 bg-gray-50 dark:bg-gray-800 overflow-x-auto no-scrollbar">
                        <Filter className="w-4 h-4 text-gray-400 ml-2" />
                        <button
                            onClick={() => setTypeFilter('all')}
                            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${typeFilter === 'all' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            ทั้งหมด
                        </button>
                        <button
                            onClick={() => setTypeFilter('อาวุธ')}
                            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${typeFilter === 'อาวุธ' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            อาวุธ
                        </button>
                        <button
                            onClick={() => setTypeFilter('ชุดเกราะ')}
                            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${typeFilter === 'ชุดเกราะ' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            ชุดเกราะ
                        </button>
                        <button
                            onClick={() => setTypeFilter('เครื่องประดับ')}
                            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${typeFilter === 'เครื่องประดับ' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            เครื่องประดับ
                        </button>
                    </div>
                </div>

                {/* Admin Controls */}
                <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                    {isAdmin && (
                        <Link href={`/games/${gameId}/equipment/new`}>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                                <Plus className="w-4 h-4" />
                                เพิ่มอุปกรณ์
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
                    กำลังโหลดอุปกรณ์...
                </div>
            ) : filteredEquipments.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-800">
                    <p className="text-gray-500 mb-4">ไม่พบข้อมูลอุปกรณ์</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredEquipments.map(equip => (
                        <EquipmentCard
                            key={equip.id}
                            equipment={equip}
                            isAdmin={isAdmin}
                            onDelete={handleDeleteEquipment}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
