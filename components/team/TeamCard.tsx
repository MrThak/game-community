import { Users, Shield, Sword, Crown } from 'lucide-react'
import Link from 'next/link'

export interface Team {
    id: string
    name: string
    description?: string
    mode: 'Arena' | 'GuildWar' | 'Adventure' | 'Other'
    author_name?: string
    user_id: string
    created_at: string
    total_power?: number
    formation: {
        front: string[] // Character IDs or Image URLs (simplified for display)
        back: string[]
    }
    pet_id?: string
    pet_image_url?: string
}

export default function TeamCard({ team }: { team: Team }) {
    // ... helper ...
    const getModeColor = (mode: string) => {
        switch (mode) {
            case 'Arena': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
            case 'GuildWar': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
            default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800'
        }
    }

    return (
        <Link href={`/teams/${team.id}`} className="block group">
            <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
                    <div>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border mb-2 ${getModeColor(team.mode)}`}>
                            {team.mode}
                        </span>
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors truncate pr-2">
                            {team.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Users className="w-3 h-3" />
                            <span>{team.author_name || 'Anonymous'}</span>
                        </div>
                    </div>

                    {/* Pet Image (Quick View) */}
                    {team.pet_image_url && (
                        <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                            <img src={team.pet_image_url} alt="Pet" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Power / Score (Optional) */}
                    {team.total_power && (
                        <div className="text-right">
                            <div className="text-[10px] text-gray-400 uppercase">Power</div>
                            <div className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                {team.total_power.toLocaleString()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Mini Formation Preview */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex gap-4">
                        {/* Back Row */}
                        <div className="flex-1 flex flex-col items-center justify-center gap-1 border-r border-dashed border-gray-300 dark:border-gray-700 pr-2">
                            <span className="text-[10px] text-gray-400 uppercase mb-1">Back</span>
                            <div className="flex flex-wrap justify-center gap-1">
                                {team.formation.back.map((char, i) => (
                                    <div key={i} className="w-6 h-8 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-300 dark:border-gray-600 relative">
                                        {/* Placeholder for char image logic - ideally passed enriched data */}
                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500">
                                            {char ? <img src={char} alt="" className="w-full h-full object-cover" /> : <Sword className="w-3 h-3" />}
                                        </div>
                                    </div>
                                ))}
                                {team.formation.back.length === 0 && <span className="text-xs text-gray-400">-</span>}
                            </div>
                        </div>

                        {/* Front Row */}
                        <div className="flex-1 flex flex-col items-center justify-center gap-1 pl-2">
                            <span className="text-[10px] text-gray-400 uppercase mb-1">Front</span>
                            <div className="flex flex-wrap justify-center gap-1">
                                {team.formation.front.map((char, i) => (
                                    <div key={i} className="w-6 h-8 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-300 dark:border-gray-600">
                                        <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-500">
                                            {char ? <img src={char} alt="" className="w-full h-full object-cover" /> : <Shield className="w-3 h-3" />}
                                        </div>
                                    </div>
                                ))}
                                {team.formation.front.length === 0 && <span className="text-xs text-gray-400">-</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
