import { getGamesByGenre } from '@/lib/api';
import { GameCardGrid } from '@/components/game/GameCard';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 2592000;

interface PageProps {
    params: Promise<{ genre: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { genre } = await params;
    const decodedGenre = decodeURIComponent(genre).replace(/-/g, ' ');

    return {
        title: `${decodedGenre} Games | Gamecodeswiki`,
        description: `Find the best active Roblox ${decodedGenre} game codes and updates on Gamecodeswiki`,
    };
}

export default async function GenrePage({ params, searchParams }: PageProps) {
    const { genre } = await params;
    const resolvedParams = await searchParams;
    const decodedGenre = decodeURIComponent(genre).replace(/-/g, ' ');
    const pageParam = resolvedParams?.page;
    const currentPage = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;

    const { games, totalPages } = await getGamesByGenre(decodedGenre, currentPage, 40);

    if (games.length === 0 && currentPage === 1) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2 capitalize">{decodedGenre} Games</h1>
                <p className="text-muted-foreground">
                    All active Roblox games in the {decodedGenre} category.
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {games.map(game => (
                    <GameCardGrid key={game.id} game={game} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-4 pt-8">
                    {currentPage > 1 && (
                        <Link href={`/genre/${genre}?page=${currentPage - 1}`} className="px-6 py-2 glass-strong rounded-xl hover:bg-white/10">
                            Previous
                        </Link>
                    )}
                    <span className="flex items-center text-sm text-muted-foreground px-4">
                        Page {currentPage} of {totalPages}
                    </span>
                    {currentPage < totalPages && (
                        <Link href={`/genre/${genre}?page=${currentPage + 1}`} className="px-6 py-2 glass-strong rounded-xl hover:bg-white/10">
                            Next
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
