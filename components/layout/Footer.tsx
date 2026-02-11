'use client'

import React from 'react'

export default function Footer() {
    return (
        <footer className="w-full bg-slate-950 text-slate-500 py-6 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                <p>&copy; {new Date().getFullYear()} Thak Talker. All rights reserved.</p>

                <div className="flex items-center gap-6">
                    {/* Links removed as per request */}
                </div>
            </div>
        </footer>
    )
}
