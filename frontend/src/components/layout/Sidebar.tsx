import Link from 'next/link';
import { getPopularGames } from '@/lib/api';
import Image from 'next/image';

export async function Sidebar() {
    const trendingGames = await getPopularGames(5);

    return (
        <aside className="space-y-6">
            {/* Ad Space */}
            <div className="glass rounded-xl text-center flex items-center justify-center p-4">
                <div className="w-[300px] h-[250px] bg-white/5 flex items-center justify-center rounded-lg">
                    <span className="text-muted-foreground text-xs">Ad Space (300x250)</span>
                </div>
            </div>

            {/* Popular Games Widget */}
            <div className="glass-strong rounded-xl p-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    🔥 Trending Now
                </h3>
                <div className="space-y-4">
                    {trendingGames.map((game) => (
                        <Link
                            key={game.id}
                            href={`/roblox/${game.gameSlug}`}
                            className="flex items-center gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors"
                        >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                                <Image src={game.iconUrl || game.thumbnailUrl || '/game-placeholder.png'} alt={game.gameName} fill sizes="48px" className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                                    {game.gameName}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    {game.activeCount ?? game.codes.filter(c => c.status === 'active').length} Active Codes
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Sticky Ad placeholder */}
            <div className="sticky top-20 glass rounded-xl text-center flex items-center justify-center p-4 mt-8">
                <div className="w-[160px] h-[600px] bg-white/5 flex items-center justify-center rounded-lg">
                    <span className="text-muted-foreground text-xs">Sticky Ad (160x600)</span>
                </div>
            </div>
        </aside>
    );
}
