'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Pet } from '@/types/pet'
import PetCard from './PetCard'
import { Search, Plus, Loader2, PawPrint } from 'lucide-react'
import Link from 'next/link'
import { useAdmin } from '@/hooks/useAdmin'

export default function PetList({ gameId }: { gameId: string }) {
    const { isAdmin } = useAdmin()
    const [pets, setPets] = useState<Pet[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    const fetchPets = useCallback(async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('pets')
                .select('*')
                .eq('game_id', gameId)
                .order('created_at', { ascending: false })

            if (error) throw error
            setPets(data || [])
        } catch (error) {
            console.error('Error fetching pets:', error)
        } finally {
            setLoading(false)
        }
    }, [gameId])

    useEffect(() => {
        fetchPets()
    }, [fetchPets])

    const handleDeletePet = async (id: string) => {
        try {
            const { error } = await supabase
                .from('pets')
                .delete()
                .eq('id', id)

            if (error) throw error
            setPets(pets.filter(p => p.id !== id))
        } catch (error: any) {
            alert(`ลบไม่สำเร็จ: ${error.message}`)
        }
    }

    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="ค้นหาสัตว์เลี้ยง..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {isAdmin && (
                    <Link href={`/games/${gameId}/pets/new`}>
                        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md shadow-orange-500/20">
                            <Plus className="w-4 h-4" />
                            เพิ่มสัตว์เลี้ยง
                        </button>
                    </Link>
                )}
            </div>

            {/* Grid */}
            {filteredPets.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredPets.map(pet => (
                        <PetCard
                            key={pet.id}
                            pet={pet}
                            isAdmin={isAdmin}
                            onDelete={handleDeletePet}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <PawPrint className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">ยังไม่มีข้อมูลสัตว์เลี้ยงในเกมนี้</p>
                </div>
            )}
        </div>
    )
}
