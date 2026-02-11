'use client'

import React from 'react'
import AdSenseUnit from '@/components/ads/AdSenseUnit'

export default function GameLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full min-h-screen flex flex-col pt-8">
            <div className="flex flex-col xl:flex-row justify-between flex-1">
                {/* Left Sidebar (Ads) */}
                <aside className="hidden xl:flex w-[300px] shrink-0 p-4 flex-col gap-4">
                    <div className="rounded-xl p-4 h-[600px] flex flex-col items-center justify-center text-center sticky top-24 w-full bg-[#050b14]/80 neon-border backdrop-blur-sm">
                        <AdSenseUnit
                            client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}
                            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEFT || ''}
                            style={{ display: 'block', width: '160px', height: '600px' }}
                            label="AdSpace (Left)"
                            className="w-full h-full flex items-center justify-center"
                        />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full max-w-7xl mx-auto p-4">
                    {children}
                </main>

                {/* Right Sidebar (Ads) */}
                <aside className="hidden xl:flex w-[300px] shrink-0 p-4 flex-col gap-4">
                    <div className="rounded-xl p-4 h-[300px] flex flex-col items-center justify-center text-center sticky top-24 w-full bg-[#050b14]/80 neon-border backdrop-blur-sm">
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
