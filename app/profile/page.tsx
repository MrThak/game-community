import GamePageLayout from '@/components/layout/GamePageLayout'
import ProfileForm from '@/components/profile/ProfileForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function ProfilePage() {
    return (
        <GamePageLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 italic uppercase">ตั้งค่าโปรไฟล์</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium italic">จัดการข้อมูลบัญชีของคุณ</p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold">กลับหน้าแรก</span>
                    </Link>
                </div>

                <ProfileForm />
            </div>
        </GamePageLayout>
    )
}
