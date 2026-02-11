'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Pet } from '@/types/pet'
import { Loader2, Save, ArrowLeft, Type, PawPrint, Star } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'

interface PetFormProps {
    gameId: string
    petId?: string // If present, it's edit mode
}

export default function PetForm({ gameId, petId }: PetFormProps) {
    const router = useRouter()
    const { isAdmin, loading: adminLoading } = useAdmin()

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(!!petId)

    const [formData, setFormData] = useState<Partial<Pet>>({
        name: '',
        game_id: gameId,
        rarity: 'Legendary',
        image_url: '',
        description: '',
    })

    // Fetch existing data for edit
    useEffect(() => {
        if (!petId) return

        const fetchPet = async () => {
            const { data, error } = await supabase
                .from('pets')
                .select('*')
                .eq('id', petId)
                .single()

            if (error) {
                console.error('Error fetching pet:', error)
                alert('ไม่สามารถดึงข้อมูลสัตว์เลี้ยงได้')
                router.push(`/games/${gameId}`)
            } else {
                setFormData(data)
            }
            setFetching(false)
        }

        fetchPet()
    }, [petId, gameId, router])

    // Redirect if not admin (client-side protection)
    useEffect(() => {
        if (!adminLoading && !isAdmin) {
            alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้')
            router.push(`/games/${gameId}`)
        }
    }, [isAdmin, adminLoading, router, gameId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (petId) {
                // Update
                const { error } = await supabase
                    .from('pets')
                    .update(formData)
                    .eq('id', petId)

                if (error) throw error
                alert('อัปเดตสัตว์เลี้ยงเรียบร้อย!')
            } else {
                // Create
                const { error } = await supabase
                    .from('pets')
                    .insert([{ ...formData, game_id: gameId }])

                if (error) throw error
                alert('สร้างสัตว์เลี้ยงเรียบร้อย!')
            }

            router.push(`/games/${gameId}`)
            router.refresh()
        } catch (error: any) {
            console.error('Save failed:', error)
            alert(`บันทึกไม่สำเร็จ: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    if (fetching || adminLoading) {
        return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></div>
    }

    if (!isAdmin) return null // Should have redirected

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-500" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {petId ? 'แก้ไขสัตว์เลี้ยง' : 'เพิ่มสัตว์เลี้ยงใหม่'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white pb-2 border-b dark:border-gray-800">
                        <Type className="w-5 h-5 text-blue-500" />
                        ข้อมูลพื้นฐาน
                    </h3>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ชื่อสัตว์เลี้ยง</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                                placeholder="เช่น Ifrit, Pooki"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ระดับ (Rarity)</label>
                            <select
                                value={formData.rarity}
                                onChange={e => setFormData({ ...formData, rarity: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                            >
                                <option value="Mythic">Mythic</option>
                                <option value="Legendary">Legendary</option>
                                <option value="Epic">Epic</option>
                                <option value="Rare">Rare</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL รูปภาพ</label>
                            <div className="flex gap-4">
                                <input
                                    value={formData.image_url || ''}
                                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                                    placeholder="https://..."
                                />
                                {formData.image_url && (
                                    <div className="w-12 h-12 rounded-lg border dark:border-gray-800 overflow-hidden flex-shrink-0">
                                        <img src={formData.image_url} alt="mini preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">รายละเอียดสกิล/ความสามารถ</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent min-h-[120px]"
                                placeholder="อธิบายความสามารถของสัตว์เลี้ยง..."
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 disabled:opacity-70 transition-all hover:-translate-y-0.5"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {petId ? 'บันทึกการแก้ไข' : 'สร้างสัตว์เลี้ยง'}
                    </button>
                </div>
            </form>
        </div>
    )
}
