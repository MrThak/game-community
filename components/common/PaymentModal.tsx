'use client'

import React from 'react'
import Image from 'next/image'
import { X, Copy, Check } from 'lucide-react'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
    const [copied, setCopied] = React.useState(false)
    const [method, setMethod] = React.useState<'promptpay' | 'truemoney'>('promptpay')
    const [isZoomed, setIsZoomed] = React.useState(false)

    const DATA = {
        promptpay: {
            acc: '505-2-91460-3',
            bank: 'ไทยพาณิชย์ (SCB)',
            name: 'ทักษิณ ขจัดโรคา',
            image: '/payment-qr.jpg.jpg',
            label: 'สแกน QR Code พร้อมเพย์',
            showAcc: true
        },
        truemoney: {
            acc: '-',
            bank: 'TrueMoney Wallet',
            name: 'ทักษิณ ขจัดโรคา',
            image: '/truemoney-qr.png.png',
            label: 'สแกน QR Code ทรูมันนี่',
            showAcc: false
        }
    }

    const current = DATA[method]

    if (!isOpen) return null

    const handleCopy = () => {
        if (!current.showAcc) return
        navigator.clipboard.writeText(current.acc)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
                <div className="bg-slate-900 border border-blue-500/30 rounded-2xl w-full max-w-md p-6 relative shadow-2xl shadow-blue-500/20" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">☕ โดเนทสนับสนุนเว็บ</h2>
                        <p className="text-gray-400 text-sm">ช่วยค่าเซิร์ฟเวอร์และเป็นกำลังใจให้ผู้พัฒนาครับ</p>
                    </div>

                    {/* Method Toggle */}
                    <div className="flex p-1 bg-slate-800 rounded-lg mb-6 max-w-xs mx-auto">
                        <button
                            onClick={() => setMethod('promptpay')}
                            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${method === 'promptpay'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            PromptPay
                        </button>
                        <button
                            onClick={() => setMethod('truemoney')}
                            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${method === 'truemoney'
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            TrueMoney
                        </button>
                    </div>

                    <div
                        className="bg-white p-4 rounded-xl mb-6 mx-auto w-fit cursor-zoom-in hover:ring-4 ring-blue-500/30 transition-all active:scale-95"
                        onClick={() => setIsZoomed(true)}
                        title="คลิกเพื่อขยายรูป"
                    >
                        <div className="relative w-48 h-48 mx-auto">
                            <Image
                                key={current.image}
                                src={current.image}
                                alt={`${current.label} QR Code`}
                                fill
                                className="object-contain rounded-lg"
                                priority
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">🔍 คลิกเพื่อขยายใหญ่</p>
                    </div>

                    {current.showAcc && (
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-blue-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">
                                    เลขบัญชี (Bank Account)
                                </span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-lg border border-slate-700">
                                <code className="flex-1 text-lg font-mono text-blue-400">{current.acc}</code>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                                    title="Copy Number"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            <div className="mt-3 text-sm text-gray-400 space-y-2">
                                <p>🏦 {current.bank}</p>
                                <p>👤 {current.name}</p>
                                <div className="pt-2 border-t border-blue-500/10 mt-2">
                                    <p className="text-blue-400 font-medium">💰 แนะนำจำนวนเงิน:</p>
                                    <p className="text-xs">ช่วยค่ากาแฟคนทำเว็บ 20, 50, 100 บาท หรือตามศรัทธาครับ</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-xs text-yellow-500/80 mb-4">
                            * โดเนทแล้วสามารถส่งสลิปหรือแจ้งข้อความเพิ่มเติมมาที่ <br />
                            <span className="font-bold text-yellow-500">LINE: thaktalker</span> หรือ Inbox บอกผมได้เลยครับ! 🙏
                        </p>
                    </div>
                </div>
            </div>

            {/* Zoomed QR Code Overlay */}
            {isZoomed && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out animate-fade-in"
                    onClick={() => setIsZoomed(false)}
                >
                    <div className="relative w-full max-w-[90vw] md:max-w-[500px] aspect-square p-4 bg-white rounded-3xl shadow-2xl animate-scale-up">
                        <Image
                            src={current.image}
                            alt={`${current.label} QR Code Full`}
                            fill
                            className="object-contain p-4"
                            priority
                        />
                        <button
                            className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors flex items-center gap-2 font-bold"
                            onClick={() => setIsZoomed(false)}
                        >
                            <span>ปิดหน้าต่าง</span>
                            <X className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
