import Link from 'next/link';
import Image from 'next/image';
import { Game } from '@/lib/types';

export function RelatedGames({ games }: { games: Game[] }) {
    if (games.length === 0) return null;

    return (
        <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                More Games
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {games.map(game => (
                    <Link
                        key={game.id}
                        href={`/roblox/${game.gameSlug}`}
                        className="group block glass-strong rounded-xl overflow-hidden hover:bg-white/10 transition-colors"
                    >
                        <div className="aspect-video bg-black/20 relative">
                            <Image src={game.thumbnailUrl || '/game-placeholder.png'} alt={game.gameName} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                        </div>
                        <div className="p-3">
                            <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{game.gameName}</h3>
                            <p className="text-xs text-muted-foreground">{game.activeCount ?? game.codes.filter(c => c.status === 'active').length} Codes</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
