import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Character } from '@/types/character'
import { Link, Loader2, Save, ArrowLeft, Image as ImageIcon, Zap, Sword, Star, Shield, Type } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'

interface CharacterFormProps {
    gameId: string
    characterId?: string // If present, it's edit mode
}

export default function CharacterForm({ gameId, characterId }: CharacterFormProps) {
    const router = useRouter()
    const { isAdmin, loading: adminLoading } = useAdmin()

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(!!characterId)

    const [formData, setFormData] = useState<Partial<Character>>({
        name: '',
        game_id: gameId,
        element: 'Fire',
        rarity: 'Legendary',
        role: 'DPS',
        image_url: '',
        description: '',
        normal_attack: '',
        skill_1: '',
        skill_2: '',
        passive: '',
        recommended_set: '',
    })

    // Fetch existing data for edit
    useEffect(() => {
        if (!characterId) return

        const fetchCharacter = async () => {
            const { data, error } = await supabase
                .from('characters')
                .select('*')
                .eq('id', characterId)
                .single()

            if (error) {
                console.error('Error fetching character:', error)
                alert('ไม่สามารถดึงข้อมูลตัวละครได้')
                router.push(`/games/${gameId}`)
            } else {
                setFormData(data)
            }
            setFetching(false)
        }

        fetchCharacter()
    }, [characterId, gameId, router])

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
            if (characterId) {
                // Update
                const { error } = await supabase
                    .from('characters')
                    .update(formData)
                    .eq('id', characterId)

                if (error) throw error
                alert('อัปเดตตัวละครเรียบร้อย!')
            } else {
                // Create
                const { error } = await supabase
                    .from('characters')
                    .insert([{ ...formData, game_id: gameId }])

                if (error) throw error
                alert('สร้างตัวละครเรียบร้อย!')
            }

            // Redirect back to game page or character list section
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
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-500" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {characterId ? 'แก้ไขตัวละคร' : 'เพิ่มตัวละครใหม่'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-8">
                {/* Section 1: Basic Info */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white pb-2 border-b dark:border-gray-800">
                        <Type className="w-5 h-5 text-blue-500" />
                        ข้อมูลพื้นฐาน
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ชื่อตัวละคร</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                                placeholder="เช่น Rudy, Eileene"
                            />
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
                                    <div className="w-10 h-10 rounded-lg border dark:border-gray-800 overflow-hidden flex-shrink-0">
                                        <img src={formData.image_url} alt="mini preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ธาตุ</label>
                            <select
                                value={formData.element}
                                onChange={e => setFormData({ ...formData, element: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                            >
                                <option value="Fire">Fire (ไฟ)</option>
                                <option value="Water">Water (น้ำ)</option>
                                <option value="Earth">Earth (ดิน)</option>
                                <option value="Wind">Wind (ลม)</option>
                                <option value="Dark">Dark (มืด)</option>
                                <option value="Light">Light (แสง)</option>
                                <option value="Magic">Magic (เวทย์)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ระดับ (Rarity)</label>
                            <select
                                value={formData.rarity}
                                onChange={e => setFormData({ ...formData, rarity: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                            >
                                <option value="Legendary">Legendary</option>
                                <option value="Epic">Epic</option>
                                <option value="Rare">Rare</option>
                                <option value="Common">Common</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ตำแหน่ง (Role)</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                            >
                                <option value="Tank">Tank</option>
                                <option value="DPS">DPS</option>
                                <option value="Support">Support</option>
                                <option value="Magic">Magic</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">รายละเอียดตัวละคร</label>
                        <textarea
                            value={formData.description || ''}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent min-h-[100px]"
                            placeholder="คำอธิบายสั้นๆ เกี่ยวกับตัวละคร..."
                        />
                    </div>
                </div>

                {/* Section 2: Skills */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white pb-2 border-b dark:border-gray-800">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        รายละเอียดสกิล
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <Sword className="w-4 h-4" /> โจมตีปกติ
                            </label>
                            <textarea
                                value={formData.normal_attack || ''}
                                onChange={e => setFormData({ ...formData, normal_attack: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent h-24"
                                placeholder="รายละเอียดการโจมตีปกติ..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-blue-500" /> สกิล 1
                            </label>
                            <textarea
                                value={formData.skill_1 || ''}
                                onChange={e => setFormData({ ...formData, skill_1: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent h-24"
                                placeholder="รายละเอียดสกิล 1..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-purple-500" /> สกิล 2
                            </label>
                            <textarea
                                value={formData.skill_2 || ''}
                                onChange={e => setFormData({ ...formData, skill_2: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent h-24"
                                placeholder="รายละเอียดสกิล 2..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500" /> แพสซีฟ
                            </label>
                            <textarea
                                value={formData.passive || ''}
                                onChange={e => setFormData({ ...formData, passive: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent h-24"
                                placeholder="รายละเอียดสกิลติดตัว..."
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Recommendation */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white pb-2 border-b dark:border-gray-800">
                        <Shield className="w-5 h-5 text-green-500" />
                        อุปกรณ์แนะนำ
                    </h3>
                    <div>
                        <textarea
                            value={formData.recommended_set || ''}
                            onChange={e => setFormData({ ...formData, recommended_set: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent min-h-[100px]"
                            placeholder="เช่น เซตโจมตี, เซตป้องกัน หรือรายละเอียดอุปกรณ์ที่ควรใส่..."
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-70 transition-all hover:-translate-y-0.5"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {characterId ? 'บันทึกการแก้ไขตัวละคร' : 'สร้างและเผยแพร่ตัวละคร'}
                    </button>
                </div>
            </form>
        </div>
    )
}

