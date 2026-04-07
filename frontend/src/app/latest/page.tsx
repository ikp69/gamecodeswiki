import { getLatestGames } from '@/lib/api';
import { GameCardGrid } from '@/components/game/GameCard';
import { Game } from '@/lib/types';

export const revalidate = 3600;

export const metadata = {
    title: 'Latest Updated Codes',
    description: 'Recently updated Roblox game codes. Check out the newest rewards.',
};

export default async function LatestPage() {
    let sortedGames: Game[] = [];
    try {
        sortedGames = await getLatestGames(50);
    } catch (error) {
        console.error('Failed to fetch latest games during build:', error);
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Recently Updated</h1>
                <p className="text-muted-foreground">Fresh codes just added for these games.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedGames.map(game => (
                    <GameCardGrid key={game.id} game={game} />
                ))}
            </div>
            {sortedGames.length === 0 && (
                <p className="text-center py-12 text-muted-foreground">Unable to load games at this time.</p>
            )}
        </div>
    );
}
