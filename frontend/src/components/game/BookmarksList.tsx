'use client';

import { useBookmarks } from '@/lib/bookmarks';
import { Game } from '@/lib/types';
import { GameCardGrid } from '@/components/game/GameCard';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BookmarksList() {
    const { bookmarks } = useBookmarks();
    const [mounted, setMounted] = useState(false);
    const [bookmarkedGames, setBookmarkedGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        if (bookmarks.length > 0) {
            setLoading(true);
            fetch(`/api/games?ids=${bookmarks.join(',')}`)
                .then(res => res.json())
                .then(data => {
                    setBookmarkedGames(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch bookmarks:", err);
                    setLoading(false);
                });
        } else {
            setBookmarkedGames([]);
            setLoading(false);
        }
    }, [bookmarks]);

    if (!mounted) return null;

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[40vh]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (bookmarkedGames.length === 0) {
        return (
            <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-white/5">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-2">No Bookmarks Yet</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Save your favorite games by clicking the heart icon on any game page to easily access them here.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {bookmarkedGames.map(game => (
                <GameCardGrid key={game.id} game={game} />
            ))}
        </div>
    );
}
