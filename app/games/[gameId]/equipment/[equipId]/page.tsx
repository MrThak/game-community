import { supabase } from '@/lib/supabase'
import { Equipment } from '@/types/equipment'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sword, Shield, Star, Hexagon, Info, Crosshair } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'

export const dynamic = 'force-dynamic'

export default async function EquipmentDetailPage({ params }: { params: Promise<{ gameId: string, equipId: string }> }) {
    const { gameId, equipId } = await params

    // 1. Get Game Config for Table Name
    const { data: game } = await supabase
        .from('games')
        .select('metadata')
        .eq('id', gameId)
        .single()

    const tableName = game?.metadata?.tables?.equipment || 'equipment'

    // 2. Get Equipment
    const { data: equip, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', equipId)
        .single()

    if (error || !equip) {
        notFound()
    }

    const equipment = equip as Equipment

    const getRarityColor = (rarity: string) => {
        if (rarity.includes('ตำนาน') || rarity.includes('Legendary')) return 'from-orange-500 to-yellow-500 shadow-orange-500/50'
        if (rarity.includes('หายาก') || rarity.includes('Rare')) return 'from-purple-500 to-indigo-500 shadow-purple-500/50'
        if (rarity.includes('ระดับสูง') || rarity.includes('High')) return 'from-blue-500 to-cyan-500 shadow-blue-500/50'
        return 'from-gray-400 to-gray-500 shadow-gray-500/50' // Normal
    }

    const getRarityTextBadge = (rarity: string) => {
        if (rarity.includes('ตำนาน') || rarity.includes('Legendary')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
        if (rarity.includes('หายาก') || rarity.includes('Rare')) return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        if (rarity.includes('ระดับสูง') || rarity.includes('High')) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30' // Normal
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Back Link */}
                <Link
                    href={`/games/${gameId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0a0a] hover:bg-black text-gray-300 hover:text-white transition-all border border-white/10 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/20 group mb-8"
                >
                    <div className="p-1 rounded-full bg-white/5 group-hover:bg-blue-600/20 text-gray-400 group-hover:text-blue-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-sm">กลับไปหน้ารวม</span>
                </Link>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Image & Basic Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className={`bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border-2 border-transparent shadow-xl relative aspect-square group p-1 bg-gradient-to-br ${getRarityColor(equipment.rarity)}`}>
                            <div className="w-full h-full bg-gray-900 rounded-[1.3rem] overflow-hidden relative">
                                {equipment.image_url ? (
                                    <img
                                        src={equipment.image_url}
                                        alt={equipment.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                        <Shield className="w-20 h-20 text-gray-600" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>

                        {/* Title Box */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{equipment.name}</h1>
                            {equipment.name_en && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{equipment.name_en}</p>
                            )}
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider border border-gray-200 dark:border-gray-700">
                                    {equipment.type}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getRarityTextBadge(equipment.rarity)}`}>
                                    {equipment.rarity}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Details & Stats */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Description */}
                        {equipment.description && (
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-blue-500" />
                                    รายละเอียดอุปกรณ์
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {equipment.description}
                                </p>
                            </div>
                        )}

                        {/* Stats Panel */}
                        {equipment.stats && Object.keys(equipment.stats).length > 0 && (
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Crosshair className="w-5 h-5 text-red-500" />
                                    ค่าพลัง (Stats)
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {Object.entries(equipment.stats).map(([statName, statValue]) => (
                                        <div key={statName} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mb-1">{statName}</span>
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{String(statValue)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Special Effect */}
                        {equipment.special_effect && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-8 rounded-3xl border border-yellow-200 dark:border-yellow-800/30 shadow-sm relative overflow-hidden">
                                <Star className="absolute -top-4 -right-4 w-24 h-24 text-yellow-500/10" />
                                <div className="relative z-10">
                                    <h2 className="text-lg font-bold text-yellow-800 dark:text-yellow-400 mb-4 flex items-center gap-2">
                                        <Star className="w-5 h-5" />
                                        ความสามารถพิเศษ (Effect)
                                    </h2>
                                    <p className="text-yellow-900 dark:text-yellow-200/90 leading-relaxed whitespace-pre-wrap font-medium">
                                        {equipment.special_effect}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* How to Obtain */}
                        {equipment.how_to_obtain && (
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Hexagon className="w-5 h-5 text-green-500" />
                                    ช่องทางการได้รับ
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {equipment.how_to_obtain}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
