import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="relative">
                <span className="text-[120px] font-black text-white/5 leading-none select-none">404</span>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">🎮</span>
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Page Not Found</h1>
                <p className="text-muted-foreground max-w-md">
                    The page you&apos;re looking for doesn&apos;t exist or may have been moved.
                </p>
            </div>

            <div className="flex gap-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                    <Home className="w-4 h-4" /> Go Home
                </Link>
                <Link
                    href="/search"
                    className="inline-flex items-center gap-2 px-6 py-3 glass-strong font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                    <Search className="w-4 h-4" /> Search Games
                </Link>
            </div>
        </div>
    );
}
