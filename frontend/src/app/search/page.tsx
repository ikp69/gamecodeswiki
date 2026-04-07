import { searchGames } from '@/lib/api';
import { GameCardGrid } from '@/components/game/GameCard';
import { Search } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = "force-dynamic";

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const q = typeof resolvedParams?.q === 'string' ? resolvedParams.q : '';

    return {
        title: q ? `Search: ${q} | Gamecodeswiki` : 'Search Games | Gamecodeswiki',
        description: q
            ? `Search results for "${q}" - Find active Roblox game codes.`
            : 'Search for active Roblox game codes on Gamecodeswiki.',
    };
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;
    const q = typeof resolvedParams?.q === 'string' ? resolvedParams.q : '';

    const games = q ? await searchGames(q) : [];

    return (
        <div className="space-y-8">
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Search Results</h1>
                {q ? (
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Showing results for <span className="text-primary font-medium">&quot;{q}&quot;</span>
                    </p>
                ) : (
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Type a game name in the search bar above.
                    </p>
                )}
            </div>

            {games.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {games.map(game => (
                        <GameCardGrid key={game.id} game={game} />
                    ))}
                </div>
            ) : q ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center p-8 rounded-2xl glass-strong border border-white/5">
                    <div className="p-4 bg-white/5 rounded-full mb-2 border border-white/10">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold">No games found</h2>
                    <p className="text-muted-foreground max-w-md">
                        We couldn&apos;t find any games matching <span className="text-primary">&quot;{q}&quot;</span>. Try searching for a different name or spelling.
                    </p>
                </div>
            ) : null}
        </div>
    );
}
