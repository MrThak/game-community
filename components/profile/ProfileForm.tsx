'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Camera, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ProfileForm() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [displayName, setDisplayName] = useState('')
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        getProfile()
    }, [])

    async function getProfile() {
        try {
            setLoading(true)
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) return

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`display_name, avatar_url`)
                .eq('id', session.user.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setDisplayName(data.display_name || session.user.user_metadata?.full_name || '')
                setAvatarUrl(data.avatar_url || session.user.user_metadata?.avatar_url || null)
            } else {
                // Use metadata as fallback if no profile record yet
                setDisplayName(session.user.user_metadata?.full_name || '')
                setAvatarUrl(session.user.user_metadata?.avatar_url || null)
            }
        } catch (error: any) {
            console.error('Error loading profile:', error.message)
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile() {
        try {
            setSaving(true)
            setMessage(null)
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) return

            const updates = {
                id: session.user.id,
                display_name: displayName,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            }

            // Update Profiles Table
            const { error } = await supabase.from('profiles').upsert(updates)
            if (error) throw error

            // Also update Auth Metadata for immediate UI feedback elsewhere
            await supabase.auth.updateUser({
                data: { full_name: displayName, avatar_url: avatarUrl }
            })

            setMessage({ type: 'success', text: 'บันทึกโปรไฟล์เรียบร้อยแล้ว!' })
        } catch (error: any) {
            setMessage({ type: 'error', text: `เกิดข้อผิดพลาด: ${error.message}` })
        } finally {
            setSaving(false)
        }
    }

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true)
            setMessage(null)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('กรุณาเลือกรูปภาพ')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            setAvatarUrl(publicUrl)
            setMessage({ type: 'success', text: 'อัปโหลดรูปภาพสำเร็จ! (อย่าลืมกดบันทึก)' })
        } catch (error: any) {
            setMessage({ type: 'error', text: `อัปโหลดไม่สำเร็จ: ${error.message}` })
        } finally {
            setUploading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-gray-500 font-medium">กำลังโหลดข้อมูลโปรไฟล์...</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Header Decoration */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
                </div>

                <div className="px-8 pb-10 relative">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center -mt-16 mb-8 group">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 shadow-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-gray-400" />
                                )}

                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute bottom-1 right-1 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
                                title="เปลี่ยนรูปโปรไฟล์"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={uploadAvatar}
                        />
                        <p className="mt-4 text-sm text-gray-500 font-medium">ภาพโปรไฟล์ของคุณ</p>
                    </div>

                    {/* Status Message */}
                    {message && (
                        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-800'
                                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                                ชื่อแสดงผล (Display Name)
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg font-medium dark:text-white"
                                placeholder="ใส่ชื่อเท่ๆ ของคุณที่นี่..."
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={updateProfile}
                                disabled={saving}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>กำลังบันทึก...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-6 h-6" />
                                        <span>บันทึกการเปลี่ยนแปลง</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-center text-gray-400 text-xs">
                ข้อมูลโปรไฟล์ของคุณจะถูกใช้ในทุกส่วนของ Thak Talker Community
            </p>
        </div>
    )
}
