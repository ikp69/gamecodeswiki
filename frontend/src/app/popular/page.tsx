import { getPopularGames } from '@/lib/api';
import { GameCardGrid } from '@/components/game/GameCard';
import { Game } from '@/lib/types';

export const revalidate = 2592000;

export const metadata = {
    title: 'Popular Games | Gamecodeswiki',
    description: 'Most popular Roblox games with active codes.',
};

export default async function PopularPage() {
    let popularGames: Game[] = [];
    try {
        popularGames = await getPopularGames(40);
    } catch (error) {
        console.error('Failed to fetch popular games during build:', error);
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Popular Games</h1>
                <p className="text-muted-foreground">The most played games on our platform right now.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {popularGames.map(game => (
                    <GameCardGrid key={game.id} game={game} />
                ))}
            </div>
            {popularGames.length === 0 && (
                <p className="text-center py-12 text-muted-foreground">Unable to load games at this time.</p>
            )}
        </div>
    );
}
