import Link from 'next/link';
import { Game } from '@/lib/types';
import { Clock } from 'lucide-react';
import Image from 'next/image';

export function GameCardFeatured({ game }: { game: Game }) {
    return (
        <Link href={`/roblox/${game.gameSlug}`} className="relative group overflow-hidden rounded-2xl glass-strong aspect-[2/1] border border-white/5 block">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <Image src={game.thumbnailUrl || '/game-placeholder.png'} alt={game.gameName} fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-0" />

            <div className="absolute bottom-0 left-0 p-6 z-20">
                <h3 className="text-xl font-bold mb-1 text-white group-hover:text-primary transition-colors">{game.gameName}</h3>
                <p className="text-sm text-gray-300 mb-2 line-clamp-1">{game.description}</p>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/20 backdrop-blur-sm">
                        {game.activeCount ?? game.codes.filter(c => c.status === 'active').length} Codes
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(game.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export function GameCardGrid({ game }: { game: Game }) {
    return (
        <Link href={`/roblox/${game.gameSlug}`} className="group flex flex-col gap-2 block">
            <div className="relative aspect-square rounded-xl glass-strong overflow-hidden border border-white/5">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <Image src={game.thumbnailUrl || '/game-placeholder.png'} alt={game.gameName} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-medium">
                    {game.activeCount ?? game.codes.filter(c => c.status === 'active').length} Codes
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{game.gameName}</h3>
            </div>
        </Link>
    );
}
