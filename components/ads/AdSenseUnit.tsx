'use client'

import { useEffect, useRef, useState } from 'react'

type AdSenseUnitProps = {
    client: string; // e.g., "ca-pub-XXXXXXXXXXXXXXXX"
    slot: string;   // e.g., "1234567890"
    format?: 'auto' | 'fluid' | 'rectangle';
    responsive?: boolean;
    style?: React.CSSProperties;
    className?: string; // Add className prop
    label?: string; // Optional label for the placeholder
    onBlocked?: () => void; // Callback when ad is blocked
}

export default function AdSenseUnit({
    client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '',
    slot,
    format = 'auto',
    responsive = true,
    style = { display: 'block' },
    className,
    label = 'Advertisement',
    onBlocked
}: AdSenseUnitProps) {
    const adRef = useRef<HTMLElement>(null)
    const [isBlocked, setIsBlocked] = useState(false)

    useEffect(() => {
        let isMounted = true;

        // 1. Initialize AdSense
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error('AdSense error:', err);
        }

        // 2. Detect Network/DNS Adblockers
        fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-store'
        }).catch(() => {
            if (isMounted) {
                setIsBlocked(true);
                if (onBlocked) onBlocked();
            }
        });

        // 3. Detect DOM-level Adblockers
        const checkTimer = setTimeout(() => {
            if (!isMounted) return;
            const testAd = document.createElement('div');
            testAd.className = 'adsbox textAd ad-banner';
            testAd.style.display = 'block';
            testAd.style.position = 'absolute';
            testAd.style.top = '-999px';
            testAd.style.left = '-999px';
            document.body.appendChild(testAd);

            setTimeout(() => {
                if (!isMounted) return;
                if (testAd.offsetHeight === 0 || window.getComputedStyle(testAd).display === 'none') {
                    setIsBlocked(true);
                    if (onBlocked) onBlocked();
                }
                testAd.remove();
            }, 100);
        }, 1000);

        return () => {
            isMounted = false;
            clearTimeout(checkTimer);
        }
    }, [onBlocked]);

    // If no client ID is provided (dev mode or not setup), show a placeholder
    if (!client || client === 'ca-pub-XXXXXXXXXXXXXXXX') {
        return (
            <div className={`bg-gray-800/20 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-500 p-4 ${className}`} style={style}>
                <span className="text-xs font-semibold uppercase tracking-widest mb-2">{label}</span>
                <span className="text-xs">Client ID Missing</span>
            </div>
        )
    }

    if (isBlocked) {
        return null; // Don't render anything if blocked, let parent handle it or just disappear
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
