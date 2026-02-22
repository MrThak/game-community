'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Equipment } from '@/types/equipment'
import { Loader2, Save, ArrowLeft, Image as ImageIcon, Shield, Sword, Type } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'

interface EquipmentFormProps {
    gameId: string
    equipmentId?: string // If present, it's edit mode
    tableName?: string
}

export default function EquipmentForm({ gameId, equipmentId, tableName = 'equipment' }: EquipmentFormProps) {
    const router = useRouter()
    const { isAdmin, loading: adminLoading } = useAdmin()

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(!!equipmentId)

    const [formData, setFormData] = useState<Partial<Equipment>>({
        name: '',
        name_en: '',
        game_id: gameId,
        type: 'อาวุธ', // Weapon, Armor, Accessory
        rarity: 'ทั่วไป (Normal)',
        image_url: '',
        description: '',
        stats: {},
        special_effect: '',
        how_to_obtain: '',
    })

    // Temp stats state for editing JSON
    const [statKey, setStatKey] = useState('')
    const [statValue, setStatValue] = useState('')

    useEffect(() => {
        if (!equipmentId) return

        const fetchEquipment = async () => {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .eq('id', equipmentId)
                .single()

            if (error) {
                console.error('Error fetching equipment:', error)
                alert('ไม่สามารถดึงข้อมูลอุปกรณ์ได้')
                router.push(`/games/${gameId}`)
            } else {
                setFormData(data)
            }
            setFetching(false)
        }

        fetchEquipment()
    }, [equipmentId, gameId, router, tableName])

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
            if (equipmentId) {
                const { error } = await supabase
                    .from(tableName)
                    .update(formData)
                    .eq('id', equipmentId)

                if (error) throw error
                alert('อัปเดตอุปกรณ์เรียบร้อย!')
            } else {
                const { error } = await supabase
                    .from(tableName)
                    .insert([{ ...formData, game_id: gameId }])

                if (error) throw error
                alert('สร้างอุปกรณ์เรียบร้อย!')
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

    const handleAddStat = () => {
        if (!statKey.trim() || !statValue.trim()) return;

        let parsedValue: string | number = statValue;
        if (!isNaN(Number(statValue))) {
            parsedValue = Number(statValue);
        }

        setFormData({
            ...formData,
            stats: {
                ...(formData.stats || {}),
                [statKey.trim()]: parsedValue
            }
        });
        setStatKey('');
        setStatValue('');
    }

    const handleRemoveStat = (keyToRemove: string) => {
        const currentStats = { ...formData.stats };
        delete currentStats[keyToRemove];
        setFormData({ ...formData, stats: currentStats });
    }

    if (fetching || adminLoading) {
        return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></div>
    }

    if (!isAdmin) return null

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0a0a] hover:bg-black text-gray-300 hover:text-white transition-all border border-white/10 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/20 group"
                >
                    <div className="p-1 rounded-full bg-white/5 group-hover:bg-blue-600/20 text-gray-400 group-hover:text-blue-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">ย้อนกลับ</span>
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {equipmentId ? 'แก้ไขอุปกรณ์' : 'เพิ่มอุปกรณ์ใหม่'}
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
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ชื่ออุปกรณ์</label>
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                                placeholder="เช่น ดาบผู้กล้า"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ชื่อภาษาอังกฤษ (English Name)</label>
                            <input
                                value={formData.name_en || ''}
                                onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                                placeholder="e.g. Hero's Sword"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ประเภทอุปกรณ์ (Type)</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                            >
                                <option value="อาวุธ">อาวุธ (Weapon)</option>
                                <option value="ชุดเกราะ">ชุดเกราะ (Armor)</option>
                                <option value="เครื่องประดับ">เครื่องประดับ (Accessory)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ระดับความหายาก (Rarity)</label>
                            <select
                                value={formData.rarity}
                                onChange={e => setFormData({ ...formData, rarity: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                            >
                                <option value="ตำนาน (Legendary)">ตำนาน (Legendary)</option>
                                <option value="หายาก (Rare)">หายาก (Rare)</option>
                                <option value="ระดับสูง (High)">ระดับสูง (High)</option>
                                <option value="ทั่วไป (Normal)">ทั่วไป (Normal)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
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
                                                const fileExt = file.name.split('.').pop()
                                                const fileName = `${gameId}/${Date.now()}_equip.${fileExt}`
                                                const { error: uploadError } = await supabase.storage
                                                    .from('game_assets')
                                                    .upload(fileName, file)

                                                if (uploadError) throw uploadError

                                                const { data: { publicUrl } } = supabase.storage
                                                    .from('game_assets')
                                                    .getPublicUrl(fileName)

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

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">รายละเอียดอุปกรณ์</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent min-h-[100px]"
                                placeholder="คำอธิบายสั้นๆ เกี่ยวกับอุปกรณ์ชิ้นนี้..."
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Stats & Effects */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white pb-2 border-b dark:border-gray-800">
                        <Sword className="w-5 h-5 text-red-500" />
                        ค่าพลังและเอฟเฟกต์
                    </h3>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ความสามารถพิเศษ (Special Effect / Passive)</label>
                        <textarea
                            value={formData.special_effect || ''}
                            onChange={e => setFormData({ ...formData, special_effect: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent min-h-[80px]"
                            placeholder="ตัวอย่าง: เพิ่มอัตราคริติคอล 10% หรือ เมื่อโจมตีมีโอกาสติดสถานะมึนงง..."
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ค่าสเตตัส (Stats Attributes)</label>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                            {Object.entries(formData.stats || {}).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{key}</span>
                                        <div className="font-bold text-gray-900 dark:text-white">{String(value)}</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveStat(key)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Custom Stat */}
                        <div className="flex gap-2 items-center mt-2 w-full sm:w-2/3">
                            <input
                                type="text"
                                value={statKey}
                                onChange={e => setStatKey(e.target.value)}
                                placeholder="Key (เช่น HP, ATK, DEF)"
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-transparent"
                            />
                            <input
                                type="text"
                                value={statValue}
                                onChange={e => setStatValue(e.target.value)}
                                placeholder="Value (เช่น 1000, 50)"
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-transparent"
                            />
                            <button
                                type="button"
                                onClick={handleAddStat}
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                            >
                                เพิ่ม Stat
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">สามารถใส่ค่าเป็นตัวเลขหรือข้อความก็ได้</p>
                    </div>
                </div>

                {/* Section 3: Acquisition */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white pb-2 border-b dark:border-gray-800">
                        <Shield className="w-5 h-5 text-green-500" />
                        ช่องทางการได้รับ
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">วิธีได้รับอุปกรณ์ชิ้นนี้ (How to Obtain)</label>
                        <input
                            type="text"
                            value={formData.how_to_obtain || ''}
                            onChange={e => setFormData({ ...formData, how_to_obtain: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-transparent"
                            placeholder="ตัวอย่าง: ดรอปจากดันเจี้ยนมังกรด่าน 10, กาชาปอง..."
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
                        {equipmentId ? 'บันทึกการแก้ไขอุปกรณ์' : 'สร้างและเผยแพร่อุปกรณ์'}
                    </button>
                </div>
            </form >
        </div >
    )
}
