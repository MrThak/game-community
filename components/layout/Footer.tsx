'use client'

import React from 'react'

export default function Footer() {
    return (
        <footer className="w-full bg-slate-950 text-slate-500 py-6 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                <p>&copy; {new Date().getFullYear()} GameHub. All rights reserved.</p>

                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-blue-400 transition-colors">About Us</a>
                    <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    )
}
