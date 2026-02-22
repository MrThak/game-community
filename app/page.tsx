'use client'

import { supabase } from '@/lib/supabase'
import { Game } from '@/types/game'
import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'
import AdSenseUnit from '@/components/ads/AdSenseUnit'
import { useState, useEffect } from 'react'

export default function Home() {
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    const fetchGames = async () => {
      const { data } = await supabase
        .from('games')
        .select('*')
        .order('name', { ascending: true })
      if (data) setGames(data as Game[])
    }
    fetchGames()
  }, [])

  return (
    <div className="w-full min-h-screen flex flex-col pt-8">
      {/* Hero Section */}
      <div className="mb-8 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-4 animate-fade-in drop-shadow-lg">
          Thak Talker
        </h1>
      </div>

      <div className="flex flex-col xl:flex-row justify-between flex-1">

        {/* Left Sidebar: Ads */}
        <aside className="hidden xl:flex w-[300px] shrink-0 p-4 flex-col gap-4 transition-all duration-300">
          <div className="rounded-xl p-4 min-h-[600px] flex flex-col items-center justify-center text-center sticky top-24 w-full bg-[#050b14]/80 neon-border backdrop-blur-sm">
            <AdSenseUnit
              client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEFT || ''}
              style={{ display: 'block', width: '160px', height: '600px' }}
              label="AdSpace (Left)"
              className="w-full h-full flex items-center justify-center"
            />
          </div>
        </aside>

        {/* Main Content: Game Grid */}
        <div className="flex-1 px-4 py-4 mx-auto w-full transition-all duration-300 max-w-[1920px]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-blue-500/20">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 neon-text">
              <Gamepad2 className="w-6 h-6 text-blue-400" />
              รายชื่อเกม ({games?.length || 0})
            </h2>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
            {games?.map((game: Game) => {
              const typedGame = game;
              const isComingSoon = typedGame.status === 'coming_soon';

              const cardContent = (
                <>
                  <div className={`aspect-square w-full bg-slate-900/50 relative overflow-hidden rounded-[1.5rem] neon-border transition-all duration-300 ${isComingSoon ? 'grayscale' : 'group-hover:shadow-blue-500/50'}`}>
                    {isComingSoon && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <span className="px-3 py-1 bg-yellow-500/90 text-yellow-950 text-xs font-bold rounded-full shadow-lg transform -rotate-12 border border-yellow-400">
                          COMING SOON
                        </span>
                      </div>
                    )}
                    {typedGame.icon_url === '-' || !typedGame.icon_url ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <Gamepad2 className="w-10 h-10 text-slate-600" />
                      </div>
                    ) : (
                      <img
                        src={typedGame.icon_url}
                        alt={typedGame.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${!isComingSoon ? 'group-hover:scale-110' : ''}`}
                      />
                    )}
                  </div>

                  <div className="text-center px-1 w-full">
                    <h3 className={`font-bold text-sm transition-colors truncate ${isComingSoon ? 'text-slate-500' : 'text-slate-300 group-hover:text-blue-400'}`}>
                      {typedGame.name}
                    </h3>
                  </div>
                </>
              );

              if (isComingSoon) {
                return (
                  <div
                    key={typedGame.id}
                    className="group flex flex-col items-center gap-3 transition-all duration-300 opacity-70 cursor-not-allowed"
                  >
                    {cardContent}
                  </div>
                )
              }

              return (
                <Link
                  key={typedGame.id}
                  href={`/games/${typedGame.id}`}
                  className="group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1"
                >
                  {cardContent}
                </Link>
              )

            })}

            {(!games || games.length === 0) && (
              <div className="col-span-full text-center py-20 bg-slate-900/30 rounded-3xl border border-blue-500/30 dashed neon-border">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 mb-4 animate-bounce">
                  <Gamepad2 className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-medium text-slate-300 mb-2">กำลังโหลดเกม...</h3>
                <p className="text-slate-500">รอสักครู่</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: AdSense & Widgets */}
        <aside className="hidden lg:flex w-[300px] shrink-0 p-4 flex-col gap-6 transition-all duration-300">
          {/* Ad Placeholder */}
          <div className="rounded-xl p-4 min-h-[300px] flex flex-col items-center justify-center text-center sticky top-24 w-full bg-[#050b14]/80 neon-border backdrop-blur-sm">
            <AdSenseUnit
              client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}
              slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT || ''}
              style={{ display: 'block', width: '300px', height: '250px' }}
              label="AdSpace (Right)"
              className="w-full h-full flex items-center justify-center"
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
