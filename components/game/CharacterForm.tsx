'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Character } from '@/types/character'
import { Link, Loader2, Save, ArrowLeft, Image as ImageIcon, Zap, Sword, Star, Shield, Type, Tag, X } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'

interface CharacterFormProps {
    gameId: string
    characterId?: string // If present, it's edit mode
    tableName?: string // Optional for backward compatibility, but should be required
}

export default function CharacterForm({ gameId, characterId, tableName = 'characters' }: CharacterFormProps) {
    const router = useRouter()
    const { isAdmin, loading: adminLoading } = useAdmin()

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(!!characterId)

    const [formData, setFormData] = useState<Partial<Character>>({
        name: '',
        game_id: gameId,
        role: 'โจมตี',
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
                .from(tableName)
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
    }, [characterId, gameId, router, tableName])

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
                    .from(tableName)
                    .update(formData)
                    .eq('id', characterId)

                if (error) throw error
                alert('อัปเดตตัวละครเรียบร้อย!')
            } else {
                // Create
                const { error } = await supabase
                    .from(tableName)
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
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return

                                            try {
                                                setLoading(true)
                                                // 1. Upload to Supabase Storage
                                                const fileExt = file.name.split('.').pop()
                                                const fileName = `${gameId}/${Date.now()}.${fileExt}`
                                                const { error: uploadError } = await supabase.storage
                                                    .from('game_assets')
                                                    .upload(fileName, file)

                                                if (uploadError) throw uploadError

                                                // 2. Get Public URL
                                                const { data: { publicUrl } } = supabase.storage
                                                    .from('game_assets')
                                                    .getPublicUrl(fileName)

                                                // 3. Update Form Data
                                                setFormData({ ...formData, image_url: publicUrl })
                                                alert('อัปโหลดรูปสำเร็จ!')
                                            } catch (error: any) {
                                                console.error('Upload failed:', error)
                                                alert(`อัปโหลดล้มเหลว: ${error.message}`)
                                            } finally {
                                                setLoading(false)
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2 border border-gray-200 dark:border-gray-700"
                                    >
                                        <ImageIcon className="w-5 h-5 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">อัปโหลด</span>
                                    </button>
                                </div>

                                {formData.image_url && (
                                    <div className="w-10 h-10 rounded-lg border dark:border-gray-800 overflow-hidden flex-shrink-0">
                                        <img src={formData.image_url} alt="mini preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">สาย (Class)</label>
                        <select
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                        >
                            <option value="โจมตี">โจมตี (Attack)</option>
                            <option value="เวท">เวท (Magic)</option>
                            <option value="ป้องกัน">ป้องกัน (Defense)</option>
                            <option value="สนับสนุน">สนับสนุน (Support)</option>
                            <option value="สมดุล">สมดุล (Balance)</option>
                        </select>
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
                        ข้อมูลแนะนำ
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ด่านที่แนะนำ (Recommended Stages)</label>

                        <div className="flex flex-wrap gap-2 mb-3">
                            {formData.recommended_stages?.map((stage, index) => (
                                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                    {stage}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newStages = formData.recommended_stages?.filter((_, i) => i !== index)
                                            setFormData({ ...formData, recommended_stages: newStages })
                                        }}
                                        className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="พิมพ์ชื่อด่านแล้วกด Enter..."
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        const val = e.currentTarget.value.trim()
                                        if (val && !formData.recommended_stages?.includes(val)) {
                                            setFormData({
                                                ...formData,
                                                recommended_stages: [...(formData.recommended_stages || []), val]
                                            })
                                            e.currentTarget.value = ''
                                        }
                                    }
                                }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">พิมพ์ชื่อด่านแล้วกด Enter เพื่อเพิ่ม Tag</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">อุปกรณ์แนะนำ</label>
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
            </form >
        </div >
    )
}

