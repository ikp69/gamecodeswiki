'use client';

import { RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="relative">
                <span className="text-[120px] font-black text-white/5 leading-none select-none">500</span>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">⚠️</span>
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Something went wrong</h1>
                <p className="text-muted-foreground max-w-md">
                    We hit an unexpected error. This is usually temporary — try refreshing.
                </p>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Try Again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 glass-strong font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                    <Home className="w-4 h-4" /> Go Home
                </Link>
            </div>
        </div>
    );
}
