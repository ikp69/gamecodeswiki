'use client';

import { Search, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function SearchInput({ mobile = false }: { mobile?: boolean }) {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            startTransition(() => {
                router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={mobile ? "relative w-full" : "hidden md:flex flex-1 max-w-md mx-8 relative"}
            role="search"
        >
            <label htmlFor={mobile ? "search-mobile" : "search-desktop"} className="sr-only">Search for games</label>
            <input
                id={mobile ? "search-mobile" : "search-desktop"}
                type="text"
                placeholder="Search for games..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-secondary/50 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            />
            <button type="submit" className="absolute left-3 top-2.5" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                ) : (
                    <Search className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                )}
            </button>
        </form>
    );
}
