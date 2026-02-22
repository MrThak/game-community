'use client'

import { useEffect } from 'react'

type AdSenseUnitProps = {
    client: string; // e.g., "ca-pub-XXXXXXXXXXXXXXXX"
    slot: string;   // e.g., "1234567890"
    format?: 'auto' | 'fluid' | 'rectangle';
    responsive?: boolean;
    style?: React.CSSProperties;
    className?: string; // Add className prop
    label?: string; // Optional label for the placeholder
}

export default function AdSenseUnit({
    client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
    slot,
    format = 'auto',
    responsive = true,
    style = { display: 'block' },
    className,
    label = 'Advertisement'
}: AdSenseUnitProps) {
    useEffect(() => {
        // Initialize AdSense only once when component mounts
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }
    }, []);

    // If no client ID is provided (dev mode or not setup), show a placeholder
    if (!client || client === 'ca-pub-XXXXXXXXXXXXXXXX') {
        return (
            <div className={`bg-gray-800/20 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-500 p-4 ${className}`} style={style}>
                <span className="text-xs font-semibold uppercase tracking-widest mb-2">{label}</span>
                <span className="text-xs">Client ID Missing</span>
            </div>
        )
    }

    return (
        <div className={`overflow-hidden ${className}`}>
            <ins
                className="adsbygoogle"
                style={style}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            ></ins>
        </div>
    )
}
