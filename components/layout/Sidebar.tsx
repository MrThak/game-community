import { supabase } from '@/lib/supabase'
import { Game } from '@/types/game'
import { Gamepad2 } from 'lucide-react'
import Link from 'next/link'
import UserProfileSection from './UserProfileSection'

export default async function Sidebar() {
    const { data: games } = await supabase.from('games').select('*')

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 sticky top-0">
            <div className="mb-6">
                <h2 className="text-xl font-bold px-2 text-gray-900 dark:text-white">Game Community</h2>
            </div>

            <nav className="flex flex-col space-y-1">
                <div className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Games
                </div>
                {games?.map((game: unknown) => {
                    const typedGame = game as Game; // Temporary casting until we confirm generated types
                    return (
                        <Link
                            key={typedGame.id}
                            href={`/games/${typedGame.id}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                        >
                            {typedGame.icon_url === '-' || !typedGame.icon_url ? (
                                <Gamepad2 className="w-5 h-5 text-gray-500" />
                            ) : (
                                <img src={typedGame.icon_url} alt={typedGame.name} className="w-5 h-5 object-cover rounded" />
                            )}
                            <span className="font-medium text-sm">{typedGame.name}</span>
                        </Link>
                    )
                })}

                {(!games || games.length === 0) && (
                    <div className="px-2 text-sm text-gray-500">No games found</div>
                )}
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
                <UserProfileSection />
            </div>
        </aside>
    )
}


