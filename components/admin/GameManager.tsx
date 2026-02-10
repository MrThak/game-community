'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function GameManager({ onGameAdded }: { onGameAdded: () => void }) {
    const [name, setName] = useState('')
    const [iconUrl, setIconUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return

        setLoading(true)
        try {
            const { error } = await supabase
                .from('games')
                .insert([{
                    name,
                    slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                    icon_url: iconUrl.trim() || '-' // Use dash for default icon
                }])

            if (error) throw error

            setName('')
            setIconUrl('')
            onGameAdded()
            alert('Game added successfully!')
        } catch (error: any) {
            console.error('Error adding game:', error)
            alert(`Failed to add game: ${error.message || 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-8">
            <h2 className="text-xl font-bold mb-4">Add New Game</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Game Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Icon URL (Optional)
                    </label>
                    <input
                        type="text"
                        value={iconUrl}
                        onChange={(e) => setIconUrl(e.target.value)}
                        placeholder="https://example.com/icon.png"
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for default icon.</p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    {loading ? 'Adding...' : 'Add Game'}
                </button>
            </form>
        </div>
    )
}
