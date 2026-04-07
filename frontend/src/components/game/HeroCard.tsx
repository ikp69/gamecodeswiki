'use client';

import Image from 'next/image';
import { Game } from '@/lib/types';
import { useBookmarks } from '@/lib/bookmarks';
import { CheckCircle, CircleOff, Clock, Heart, Users, Eye, PlayCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/cn';
import { format } from 'date-fns';
import Link from 'next/link';

interface HeroCardProps {
    game: Game;
}

import { DynamicGradientTitle } from './DynamicGradientTitle';
import { ShareButtons } from './ShareButtons';

export function HeroCard({ game }: HeroCardProps) {
    const { isBookmarked, toggleBookmark } = useBookmarks();

    const activeCodes = game.activeCount ?? game.codes.filter(c => c.status === 'active').length;
    const expiredCodes = game.expiredCount ?? game.codes.filter(c => c.status === 'expired').length;

    // Calculate the actual last updated time based on the latest code added
    let latestUpdate = new Date(game.updatedAt);
    if (game.codes && game.codes.length > 0) {
        const addedDates = game.codes
            .map(c => c.added_on ? new Date(c.added_on).getTime() : 0)
            .filter(t => t > 0);
        if (addedDates.length > 0) {
            latestUpdate = new Date(Math.max(...addedDates));
        }
    }

    // Format views helper e.g. 1.2M
    const formatViews = (views: number) => {
        if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
        return views.toString();
    };

    return (
        <div className="relative rounded-2xl overflow-hidden glass-strong mb-8">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 h-full">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent z-10" />
                <Image
                    src={game.thumbnailUrl || '/game-placeholder.png'}
                    alt={`${game.gameName} background`}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover blur-sm opacity-100"
                />
            </div>

            <div className="relative z-20 pt-6 px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {/* Game Icon */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-secondary/50 border-4 border-white/10 shadow-xl overflow-hidden flex-shrink-0 relative">
                        <Image src={game.iconUrl || game.thumbnailUrl || '/game-placeholder.png'} alt={game.gameName} fill sizes="128px" className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                        <div className="flex sm:flex-row sm:items-center justify-between gap-4 mb-2">
                            <DynamicGradientTitle imageSrc={game.thumbnailUrl || game.iconUrl || '/game-placeholder.png'}>
                                {game.gameName.match(/codes$/i) ? game.gameName : `${game.gameName}`}
                            </DynamicGradientTitle>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleBookmark(game.id)}
                                    className={cn("p-2 rounded-lg border transition-colors backdrop-blur-md", isBookmarked(game.id) ? "bg-primary/20 border-primary text-primary" : "bg-black/40 border-white/10 hover:bg-white/10 text-white")}
                                    title="Bookmark Game"
                                >
                                    <Heart className={cn("w-5 h-5", isBookmarked(game.id) && "fill-current")} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-3 items-center">
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-blue-400" /> By{' '}
                                {game.developerLink ? (
                                    <a href={game.developerLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
                                        {game.developerName || "Unknown"}
                                    </a>
                                ) : (
                                    <span>{game.developerName || "Unknown"}</span>
                                )}
                            </span>

                            {game.robloxViews ? (
                                <span className="flex items-center gap-1.5" title={`${game.robloxViews.toLocaleString()} total visits`}>
                                    <Eye className="w-4 h-4 text-purple-400" /> {formatViews(game.robloxViews)}+ Visits
                                </span>
                            ) : null}

                            {game.genre && (
                                <Link href={`/genre/${game.genre.toLowerCase()}`} className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-xs border border-white/5">
                                    🏷️ {game.genre}
                                </Link>
                            )}
                        </div>

                        <div className="mb-4 flex flex-wrap gap-4 items-center">
                            <div className="flex gap-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-green-500/20 text-green-400 border border-green-500/30 text-sm">
                                    <CheckCircle className="w-4 h-4" /> {activeCodes} Active Codes
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 text-sm">
                                    <CircleOff className="w-4 h-4" /> {expiredCodes} Expired Codes
                                </span>
                            </div>

                            <div className="flex gap-2">
                                {game.robloxUrl && (
                                    <a href={game.robloxUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors text-sm font-medium">
                                        <PlayCircle className="w-4 h-4" /> Play on Roblox
                                    </a>
                                )}
                                {game.discordLink && (
                                    <a href={game.discordLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#5865F2] hover:bg-[#4752c4] text-white transition-colors text-sm font-medium">
                                        <MessageSquare className="w-4 h-4" /> Join Discord
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            <ShareButtons title={`${game.gameName}`} />
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 bg-black/40 inline-flex px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                            <Clock className="w-3 h-3 text-green-400" />
                            Last Updated: <span className="text-white font-medium">{format(latestUpdate, "MMM dd, yyyy 'at' h:mm a")}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
