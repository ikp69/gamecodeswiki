import { getFeaturedGames, getPaginatedGames } from '@/lib/api';
import { Game } from '@/lib/types';
import { GameList } from "@/components/game/GameList";
import { GameCardFeatured } from "@/components/game/GameCard";
import { TrendingUp } from "lucide-react";

export const revalidate = 3600;

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams;
  const pageParam = resolvedParams?.page;
  const currentPage = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;
  const limit = 20;

  let featuredGames: Game[] = [];
  let paginatedData = { games: [] as Game[], totalPages: 0, totalCount: 0 };
  let error: string | null = null;

  try {
    featuredGames = await getFeaturedGames();
    paginatedData = await getPaginatedGames(currentPage, limit);
  } catch (err) {
    console.error("Failed to fetch games:", err);
    error = "Unable to connect to the database. Please check your connection settings.";
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 max-w-md">
          <h2 className="text-xl font-bold mb-2">Database Connection Error</h2>
          <p>{error}</p>
          <p className="text-sm mt-4 opacity-70">
            If you are the developer, run <code>node scripts/check-connection.mjs</code> to troubleshoot.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Featured Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" /> Featured Games
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredGames.map(game => (
            <GameCardFeatured key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* All Codes List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All Game Codes</h2>
        </div>
        <GameList 
          games={paginatedData.games} 
          currentPage={currentPage}
          totalPages={paginatedData.totalPages}
        />
      </section>
    </div>
  );
}
