'use client';

import {
    siFacebook,
    siX,
    siReddit,
    siWhatsapp,
    siTelegram,
    siPinterest
} from 'simple-icons/icons';
import { Copy, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/cn';

interface ShareButtonsProps {
    title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const getUrl = () => typeof window !== 'undefined' ? window.location.href : '';

    const shareLinks = [
        {
            name: 'Facebook',
            icon: (
                <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d={siFacebook.path} />
                </svg>
            ),
            url: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: 'bg-[#1877F2] hover:bg-[#1877F2]/90'
        },
        {
            name: 'X',
            icon: (
                <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d={siX.path} />
                </svg>
            ),
            url: (url: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            color: 'bg-black hover:bg-black/90 border border-white/20'
        },
        {
            name: 'Reddit',
            icon: (
                <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d={siReddit.path} />
                </svg>
            ),
            url: (url: string) => `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
            color: 'bg-[#FF4500] hover:bg-[#FF4500]/90'
        },
        {
            name: 'WhatsApp',
            icon: (
                <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d={siWhatsapp.path} />
                </svg>
            ),
            url: (url: string) => `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
            color: 'bg-[#25D366] hover:bg-[#25D366]/90'
        },
        {
            name: 'Telegram',
            icon: (
                <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d={siTelegram.path} />
                </svg>
            ),
            url: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            color: 'bg-[#26A5E4] hover:bg-[#26A5E4]/90'
        },
        {
            name: 'Pinterest',
            icon: (
                <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d={siPinterest.path} />
                </svg>
            ),
            url: (url: string) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}`,
            color: 'bg-[#E60023] hover:bg-[#E60023]/90'
        }
    ];

    const copyToClipboard = () => {
        const url = getUrl();
        if (!url) return;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const nativeShare = async () => {
        const url = getUrl();
        if (!url) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            copyToClipboard();
        }
    };

    return (
        <div className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
            <span className="text-sm text-white whitespace-nowrap">Share:</span>

            <div className="flex items-center gap-2">
                {shareLinks.map((link) => (
                    <button
                        key={link.name}
                        onClick={() => {
                            const url = getUrl();
                            if (url) window.open(link.url(url), '_blank', 'width=600,height=400');
                        }}
                        className={cn(
                            "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl transition-transform hover:scale-105 active:scale-95 shadow-lg",
                            link.color
                        )}
                        title={`Share on ${link.name}`}
                    >
                        {link.icon}
                    </button>
                ))}

                <button
                    onClick={copyToClipboard}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-slate-700 hover:bg-slate-600 transition-transform hover:scale-105 active:scale-95 shadow-lg relative"
                    title="Copy Link"
                >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
                    {copied && (
                        <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                            Copied!
                        </span>
                    )}
                </button>

                <button
                    onClick={nativeShare}
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-red-500 to-pink-500 hover:brightness-110 transition-transform hover:scale-105 active:scale-95 shadow-lg"
                    title="More Options"
                >
                    <Share2 className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    );
}
