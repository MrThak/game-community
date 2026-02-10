import { supabase } from '@/lib/supabase'
import { Game } from '@/types/game'
import Link from 'next/link'
import { Gamepad2 } from 'lucide-react'
import AdSenseUnit from '@/components/ads/AdSenseUnit'

export const revalidate = 0; // Ensure fresh data on every request

export default async function Home() {
  const { data: games } = await supabase
    .from('games')
    .select('*')
    .order('name', { ascending: true }) // Sort alphabetically

  return (
    <div className="w-full min-h-screen flex flex-col pt-8">
      {/* Hero Section */}
      <div className="mb-8 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 mb-4 animate-fade-in drop-shadow-lg">
          Thak Talker
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          ศูนย์รวมชุมชนคนรักเกม พูดคุย แลกเปลี่ยน และทำกิจกรรมร่วมกัน
        </p>
      </div>

      <div className="flex flex-col xl:flex-row justify-between flex-1">

        {/* Left Sidebar: Ads */}
        <aside className="hidden xl:flex w-[300px] shrink-0 p-4 flex-col gap-4">
          <div className="rounded-xl p-4 h-[600px] flex flex-col items-center justify-center text-center sticky top-24 w-full">
            <AdSenseUnit
              client="ca-pub-XXXXXXXXXXXXXXXX" // TODO: Replace with your Client ID
              slot="1234567890"               // TODO: Replace with your Slot ID (Left Sidebar)
              style={{ display: 'block', width: '160px', height: '600px' }}
              label="AdSpace (Left)"
              className="w-full h-full flex items-center justify-center"
            />
          </div>
        </aside>

        {/* Main Content: Game Grid */}
        <div className="flex-1 px-4 py-4 max-w-[1920px] mx-auto w-full">
          <div className="flex items-center justify-between mb-6 pb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-blue-400" />
              รายชื่อเกม ({games?.length || 0})
            </h2>
          </div>

          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
            {games?.map((game: unknown) => {
              const typedGame = game as Game;
              return (
                <Link
                  key={typedGame.id}
                  href={`/games/${typedGame.id}`}
                  className="group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-[1.05] hover:-translate-y-1"
                >
                  <div className="aspect-square w-full bg-slate-800/50 relative overflow-hidden rounded-[1.5rem] shadow-lg shadow-black/20 group-hover:shadow-blue-500/20 transition-all duration-300">
                    {typedGame.icon_url === '-' || !typedGame.icon_url ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <Gamepad2 className="w-10 h-10 text-slate-600" />
                      </div>
                    ) : (
                      <img
                        src={typedGame.icon_url}
                        alt={typedGame.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                  </div>

                  <div className="text-center px-1 w-full">
                    <h3 className="font-bold text-sm text-slate-300 group-hover:text-white transition-colors truncate">
                      {typedGame.name}
                    </h3>
                  </div>
                </Link>
              )
            })}

            {(!games || games.length === 0) && (
              <div className="col-span-full text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800/50 dashed">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 mb-4 animate-bounce">
                  <Gamepad2 className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-medium text-slate-300 mb-2">ยังไม่มีเกมในระบบ</h3>
                <p className="text-slate-500">รอผู้ดูแลระบบเพิ่มเกมใหม่เร็วๆ นี้</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: AdSense & Widgets */}
        <aside className="hidden lg:flex w-[300px] shrink-0 p-4 flex-col gap-6">
          {/* Ad Placeholder */}
          <div className="rounded-xl p-4 h-[300px] flex flex-col items-center justify-center text-center sticky top-24 w-full">
            <AdSenseUnit
              client="ca-pub-XXXXXXXXXXXXXXXX" // TODO: Replace with your Client ID
              slot="0987654321"               // TODO: Replace with your Slot ID (Right Sidebar)
              style={{ display: 'block', width: '300px', height: '250px' }}
              label="AdSpace (Right)"
              className="w-full h-full flex items-center justify-center"
            />
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-xl p-6 border border-blue-500/10 sticky top-[340px] backdrop-blur-sm">
            <h3 className="font-bold text-white mb-2">ลงโฆษณากับเรา?</h3>
            <p className="text-sm text-slate-400 mb-4">ติดต่อทีมงานเพื่อโปรโมทเกมของคุณในพื้นที่นี้</p>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
              ติดต่อโฆษณา
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
