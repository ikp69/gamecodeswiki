'use client';

import { Game } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface GameListProps {
    games: Game[];
    currentPage: number;
    totalPages: number;
}

export function GameList({ games, currentPage, totalPages }: GameListProps) {
    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {games.map((game) => (
                    <Link
                        key={game.id}
                        href={`/roblox/${game.gameSlug}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl glass hover:bg-white/10 transition-colors group gap-4 sm:gap-0"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary shadow-lg">
                                <Image src={game.iconUrl || game.thumbnailUrl || '/game-placeholder.png'} alt={game.gameName} fill sizes="48px" className="object-cover" />
                            </div>
                            <div>
                                <span className="font-bold text-base group-hover:text-primary transition-colors block">{game.gameName}</span>
                                <span className="text-xs text-muted-foreground sm:hidden">
                                    {game.developerName}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6 text-sm text-muted-foreground w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                            <span className="flex items-center gap-1.5 text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded-md">
                                <CheckCircle className="w-3.5 h-3.5" />
                                {game.activeCount ?? game.codes.filter(c => c.status === 'active').length} Codes
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(game.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                {prevPage ? (
                    <Link
                        href={`/?page=${prevPage}`}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 transition-colors font-semibold text-primary"
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </Link>
                ) : <div />}

                <span className="text-sm text-muted-foreground font-medium">
                    Page {currentPage} of {totalPages}
                </span>

                {nextPage ? (
                    <Link
                        href={`/?page=${nextPage}`}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 transition-colors font-semibold text-primary"
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </Link>
                ) : <div />}
            </div>
        </div>
    );
}
