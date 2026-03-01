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

    // If no client ID is provided (dev mode or not setup), return null instead of a placeholder
    if (!client || client === 'ca-pub-XXXXXXXXXXXXXXXX') {
        return null;
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
