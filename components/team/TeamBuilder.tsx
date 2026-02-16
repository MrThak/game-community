'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Character } from '@/types/character'
import { Search, Save, X, ChevronUp, ChevronDown, UserPlus, Trash2, Loader2 } from 'lucide-react'
import { getGameConfig } from '@/lib/gameConfig'
import { Pet } from '@/types/pet'

export default function TeamBuilder({ gameId, tableName, characterTableName, petTableName, onTeamCreated }: { gameId: string, tableName: string, characterTableName: string, petTableName: string, onTeamCreated: () => void }) {
    // State
    const [name, setName] = useState('')
    const [mode, setMode] = useState<'Arena' | 'GuildWar'>('Arena')
    const [characters, setCharacters] = useState<Character[]>([])
    const [pets, setPets] = useState<Pet[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [petId, setPetId] = useState<string | null>(null)
    const [tab, setTab] = useState<'heroes' | 'pets'>('heroes')

    // Formation State
    const [frontRow, setFrontRow] = useState<Character[]>([])
    const [backRow, setBackRow] = useState<Character[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Limits
    const MAX_FRONT = 5 // Changed from 4 to 5
    const MAX_BACK = 5  // Changed from 4 to 5
    const MAX_TOTAL = mode === 'Arena' ? 5 : 3

    useEffect(() => {
        const fetchData = async () => {
            if (!characterTableName || !petTableName) return
            const [charRes, petRes] = await Promise.all([
                supabase.from(characterTableName).select('*').eq('game_id', gameId).order('name', { ascending: true }),
                supabase.from(petTableName).select('*').eq('game_id', gameId).order('name', { ascending: true })
            ])
            setCharacters(charRes.data || [])
            setPets(petRes.data || [])
        }
        fetchData()
    }, [gameId, characterTableName, petTableName])

    // Handlers
    const addToFormation = (char: Character, row: 'front' | 'back') => {
        // Validation
        const currentTotal = frontRow.length + backRow.length
        if (currentTotal >= MAX_TOTAL) {
            alert(`โหมด ${mode} ใส่ได้สูงสุด ${MAX_TOTAL} ตัวละครครับ`)
            return
        }
        if (frontRow.find(c => c.id === char.id) || backRow.find(c => c.id === char.id)) {
            alert('ตัวละครนี้อยู่ในทีมแล้วครับ')
            return
        }

        if (row === 'front') {
            if (frontRow.length >= MAX_FRONT) return alert('แถวหน้าเต็มแล้ว (5 ตัว)')
            setFrontRow([...frontRow, char])
        } else {
            if (backRow.length >= MAX_BACK) return alert('แถวหลังเต็มแล้ว (5 ตัว)')
            setBackRow([...backRow, char])
        }
    }

    const removeFromFormation = (charId: string, row: 'front' | 'back') => {
        if (row === 'front') {
            setFrontRow(frontRow.filter(c => c.id !== charId))
        } else {
            setBackRow(backRow.filter(c => c.id !== charId))
        }
    }

    const saveTeam = async () => {
        if (!name.trim()) return alert('กรุณาตั้งชื่อทีม')
        if ((frontRow.length + backRow.length) === 0) return alert('กรุณาเลือกตัวละครอย่างน้อย 1 ตัว')

        setIsSubmitting(true)
        try {
            // Wait... we need user_id. 
            // Quick fix: fetch user session
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return alert('กรุณาเข้าสู่ระบบก่อน')

            const { error: insertError } = await supabase.from(tableName).insert([{
                name,
                mode,
                game_id: gameId,
                user_id: session.user.id,
                username: session.user.user_metadata?.full_name || 'Anonymous',
                formation: {
                    front: frontRow.map(c => c.image_url || ''), // Store Images for simple display
                    back: backRow.map(c => c.image_url || '')
                    // Storing Image URLs directly in JSON for this demo to make TeamCard rendering easier without joins
                },
                pet_id: petId,
                pet_image_url: selectedPet?.image_url
            }])

            if (insertError) throw insertError

            alert('บันทึกทีมสำเร็จ!')
            onTeamCreated()
        } catch (error: any) {
            console.error('Save failed:', error)
            alert(`บันทึกไม่สำเร็จ: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredChars = characters.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const filteredPets = pets.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const selectedPet = pets.find(p => p.id === petId)

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Save className="w-5 h-5 text-blue-500" /> สร้างทีมใหม่
                    </h2>
                    <p className="text-sm text-gray-500">เลือกตัวละครเข้าทีม จัดวางตำแหน่งหน้า-หลัง</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onTeamCreated}
                        className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={saveTeam}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        บันทึกทีม
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row h-[800px]">
                {/* Left: Formation Board */}
                <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 p-6 overflow-y-auto">
                    {/* Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชื่อทีม</label>
                            <input
                                value={name} onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="เช่น ทีมลงดัน 15-10"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">โหมด</label>
                            <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-1">
                                <button
                                    onClick={() => setMode('Arena')}
                                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'Arena' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Arena (5)
                                </button>
                                <button
                                    onClick={() => setMode('GuildWar')}
                                    className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${mode === 'GuildWar' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Guild War (3)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Formation Visualization */}
                    <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl p-6 shadow-inner mb-6 relative min-h-[400px]">
                        <div className="absolute top-2 right-4 text-xs font-mono text-slate-400">FORMATION VIEW</div>

                        <div className="flex h-full gap-4 md:gap-8">
                            {/* Back Row */}
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 border-r-2 border-dashed border-slate-300 dark:border-slate-700 pr-4">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center w-full mb-2">Back Row</h3>
                                <div className="grid grid-rows-5 gap-3 h-full">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const char = backRow[i]
                                        return (
                                            <div key={i} className="w-16 h-20 md:w-20 md:h-24 bg-slate-100 dark:bg-slate-700 rounded border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center relative group">
                                                {char ? (
                                                    <>
                                                        <img src={char.image_url} alt="" className="w-full h-full object-cover rounded" />
                                                        <button
                                                            onClick={() => removeFromFormation(char.id, 'back')}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                        <div className="absolute inset-0 bg-blue-500/10 pointer-events-none rounded" />
                                                    </>
                                                ) : (
                                                    <span className="text-slate-300 text-2xl font-bold">+</span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Front Row */}
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 pl-4 border-l-2 border-dashed border-slate-300 dark:border-slate-700">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center w-full mb-2">Front Row</h3>
                                <div className="grid grid-rows-5 gap-3 h-full">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const char = frontRow[i]
                                        return (
                                            <div key={i} className="w-16 h-20 md:w-20 md:h-24 bg-slate-100 dark:bg-slate-700 rounded border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center relative group">
                                                {char ? (
                                                    <>
                                                        <img src={char.image_url} alt="" className="w-full h-full object-cover rounded" />
                                                        <button
                                                            onClick={() => removeFromFormation(char.id, 'front')}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                        <div className="absolute inset-0 bg-red-500/10 pointer-events-none rounded" />
                                                    </>
                                                ) : (
                                                    <span className="text-slate-300 text-2xl font-bold">+</span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pet Selector (Display Only/Quick View) */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                            {selectedPet ? (
                                <img src={selectedPet.image_url} alt={selectedPet.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs text-gray-400">Pet</span>
                            )}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{selectedPet ? selectedPet.name : 'เลือกสัตว์เลี้ยง'}</h4>
                            <p className="text-xs text-gray-500">{selectedPet ? 'สัตว์เลี้ยงคู่ใจ' : 'เลือกจากรายการด้านขวา'}</p>
                        </div>
                    </div>
                </div>

                {/* Right: Selection Panel */}
                <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setTab('heroes')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${tab === 'heroes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            อัศวิน (Heroes)
                        </button>
                        <button
                            onClick={() => setTab('pets')}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${tab === 'pets' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            สัตว์เลี้ยง (Pets)
                        </button>
                    </div>

                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative">
                            <input
                                placeholder="ค้นหา..."
                                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {tab === 'heroes' ? (
                            filteredChars.map(char => (
                                <div key={char.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg group transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                                        <img src={char.image_url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{char.name}</h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className={`w-2 h-2 rounded-full ${char.element ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                                            {char.role}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => addToFormation(char, 'front')}
                                            className="px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-xs font-bold"
                                        >
                                            หน้า
                                        </button>
                                        <button
                                            onClick={() => addToFormation(char, 'back')}
                                            className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 text-xs font-bold"
                                        >
                                            หลัง
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            filteredPets.map(pet => (
                                <div key={pet.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg group transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600 cursor-pointer" onClick={() => setPetId(pet.id)}>
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                                        <img src={pet.image_url} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{pet.name}</h4>
                                    </div>
                                    {petId === pet.id && (
                                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">Selected</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
