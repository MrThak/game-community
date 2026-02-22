'use client'

import React, { useState } from 'react'
import AdSenseUnit from '@/components/ads/AdSenseUnit'

export default function GameLayout({ children }: { children: React.ReactNode }) {
    const [leftAdBlocked, setLeftAdBlocked] = useState(false);
    const [rightAdBlocked, setRightAdBlocked] = useState(false);

    return (
        <div className="w-full min-h-screen flex flex-col pt-8">
            <div className="flex flex-col xl:flex-row justify-between flex-1">
                {/* Left Sidebar (Ads) */}
                {!leftAdBlocked && (
                    <aside className="hidden xl:flex w-[300px] shrink-0 p-4 flex-col gap-4 transition-all duration-300">
                        <div className="rounded-xl p-4 min-h-[600px] flex flex-col items-center justify-center text-center sticky top-24 w-full bg-[#050b14]/80 neon-border backdrop-blur-sm">
                            <AdSenseUnit
                                client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}
                                slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEFT || ''}
                                style={{ display: 'block', width: '160px', height: '600px' }}
                                label="AdSpace (Left)"
                                className="w-full h-full flex items-center justify-center"
                                onBlocked={() => setLeftAdBlocked(true)}
                            />
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <main className={`flex-1 w-full mx-auto p-4 transition-all duration-300 ${leftAdBlocked && rightAdBlocked ? 'max-w-[1600px]' : 'max-w-7xl'}`}>
                    {children}
                </main>

                {/* Right Sidebar (Ads) */}
                {!rightAdBlocked && (
                    <aside className="hidden xl:flex w-[300px] shrink-0 p-4 flex-col gap-4 transition-all duration-300">
                        <div className="rounded-xl p-4 min-h-[250px] flex flex-col items-center justify-center text-center sticky top-24 w-full bg-[#050b14]/80 neon-border backdrop-blur-sm">
                            <AdSenseUnit
                                client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''}
                                slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT || ''}
                                style={{ display: 'block', width: '300px', height: '250px' }}
                                label="AdSpace (Right)"
                                className="w-full h-full flex items-center justify-center"
                                onBlocked={() => setRightAdBlocked(true)}
                            />
                        </div>
                    </aside>
                )}
            </div>
        </div>
    )
}
