import { getGameBySlug, getOtherGames, getAllGames } from '@/lib/api';
import { HeroCard } from '@/components/game/HeroCard';
import { CodesTable } from '@/components/game/CodesTable';
import { RedeemGuide } from '@/components/game/RedeemGuide';
import { ImageGallery } from '@/components/game/ImageGallery';
import { RelatedGames } from '@/components/game/RelatedGames';
import { GameSchema } from '@/components/seo/GameSchema';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Heart, Users, MessageSquare, Bell } from 'lucide-react';

export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

function extractSlug(rawSlug: string): string {
    return rawSlug;
}

export async function generateStaticParams() {
    try {
        const games = await getAllGames();
        if (!games || !Array.isArray(games)) return [];
        return games.slice(0, 20).map((game) => ({
            slug: game.gameSlug,
        }));
    } catch (error) {
        console.error('Build-time fetch failed for generateStaticParams:', error);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug: rawSlug } = await params;
    const slug = extractSlug(rawSlug);
    const game = await getGameBySlug(slug);
    if (!game) return { title: 'Game Not Found' };

    const activeCount = game.codes.filter(c => c.status === 'active').length;
    const month = new Date().toLocaleString('default', { month: 'long' });
    const year = new Date().getFullYear();

    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://gamecodeswiki.com'}/roblox/${game.gameSlug}`;
    const imageUrl = game.thumbnailUrl || game.iconUrl || '/og-image.png';

    const title = game.gameName.match(/codes$/i) ? game.gameName : `${game.gameName}`;

    return {
        title: `${title} (${month} ${year}) - ${activeCount} Active codes!`,
        description: `Latest ${title} for ${month} ${year}. Get free rewards, boosts, and items. Updated daily!`,
        alternates: {
            canonical: url,
        },
        openGraph: {
            type: 'article',
            title: `${game.gameName} (${month} ${year})`,
            description: `Latest ${game.gameName} for ${month} ${year}. Get free rewards, boosts, and items.`,
            url,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: `${game.gameName} background image`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${game.gameName} (${month} ${year})`,
            description: `Latest ${game.gameName} for ${month} ${year}. Get free rewards, boosts, and items.`,
            images: [imageUrl],
        },
    };
}

export default async function GamePage({ params }: PageProps) {
    const { slug: rawSlug } = await params;
    const slug = extractSlug(rawSlug);
    const game = await getGameBySlug(slug);

    if (!game) {
        notFound();
    }

    const otherGames = await getOtherGames(game.id);

    // Dynamic SEO Text generation
    const activeCount = game.codes.filter(c => c.status === 'active').length;
    const topReward = game.codes.filter(c => c.status === 'active')[0]?.reward || 'free rewards';

    const DevLink = () => game.developerLink
        ? <a href={game.developerLink} target="_blank" rel="nofollow noreferrer" className="text-primary hover:underline">{game.developerName}</a>
        : <strong className="text-primary">{game.developerName}</strong>;

    const GenreLink = () => game.genre
        ? <Link href={`/genre/${game.genre.toLowerCase()}`} className="text-primary hover:underline">{game.genre}</Link>
        : <span>Roblox</span>;

    const variations = [
        <p key={0} className="text-lg text-foreground/90 leading-relaxed">
            Looking for the latest working <strong className="text-primary">{game.gameName}</strong>? You&apos;ve come to the right place! Use our <strong>{activeCount}</strong> active codes list below to get free <strong>{topReward}</strong>, boosts, and items in-game. Developer <DevLink /> frequently updates the game, so make sure to check back daily for new drops.
        </p>,
        <p key={1} className="text-lg text-foreground/90 leading-relaxed">
            Dive into the ultimate <GenreLink /> experience with our up-to-date <strong className="text-primary">{game.gameName}</strong>! Grab <strong>{activeCount}</strong> active rewards right now—including <strong>{topReward}</strong>—to dominate the leaderboards. Massive thanks to <DevLink /> for the constant updates. Bookmark us so you never miss a freebie!
        </p>,
        <p key={2} className="text-lg text-foreground/90 leading-relaxed">
            Stop grinding and start claiming! We have <strong>{activeCount}</strong> freshly tested <strong className="text-primary">{game.gameName}</strong>. Created by the incredible team at <DevLink />, this hit <GenreLink /> game just keeps getting better. Scroll down to redeem your free <strong>{topReward}</strong> and power up your gameplay today.
        </p>,
        <p key={3} className="text-lg text-foreground/90 leading-relaxed">
            Need quick boosting <strong className="text-primary">{game.gameName}</strong>? You&apos;re in luck! There are currently <strong>{activeCount}</strong> working codes available that you can redeem for <strong>{topReward}</strong> and other exclusive loot. As one of the top <GenreLink /> titles on Roblox right now, <DevLink /> drops new codes often, so keep this page saved!
        </p>,
        <p key={4} className="text-lg text-foreground/90 leading-relaxed">
            Join thousands of other players optimizing their gameplay using <strong className="text-primary">{game.gameName}</strong>! Our verified list contains <strong>{activeCount}</strong> active codes. Whether you need <strong>{topReward}</strong> or just a quick XP boost, we&apos;ve got you covered. Support <DevLink /> by liking the game, and check our list below before the rewards expire!
        </p>
    ];

    const hash = Array.from(game.gameSlug).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const variationIndex = hash % variations.length;
    const selectedIntro = variations[variationIndex];

    return (
        <div className="space-y-12 pb-12">
            <GameSchema game={game} />
            {/* Hero */}
            <HeroCard game={game} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="glass rounded-2xl p-6 border-l-4 border-l-primary">
                        {selectedIntro}
                    </div>

                    <CodesTable codes={game.codes} game={game} />
                    <RedeemGuide game={game} />

                    <ImageGallery images={game.images || []} gameName={game.gameName} />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-secondary/20 p-6 rounded-2xl border border-white/5 space-y-6 shadow-xl backdrop-blur-md">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <span className="text-primary"><Bell className="w-5 h-5 fill-current" /></span> Stay Updated
                        </h3>

                        <div className="grid gap-3">
                            {/* Bookmark Row */}
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-black/40 border border-white/5 text-left group">
                                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/20 transition-colors">
                                    <Heart className="w-4 h-4 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-200">Bookmark Page</p>
                                    <p className="text-xs text-gray-500">Press <kbd className="bg-white/10 rounded px-1 text-gray-300">Ctrl+D</kbd> to save us</p>
                                </div>
                            </div>

                            {/* Website Discord CTA */}
                            <a href="#" className="flex items-center gap-4 p-3 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 hover:bg-[#5865F2]/20 transition-all text-left group">
                                <div className="w-10 h-10 rounded-full bg-[#5865F2]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-4 h-4 text-[#5865F2] fill-current" />
                                </div>
                                <div>
                                    <p className="font-medium text-[#5865F2]">Join Our Discord</p>
                                    <p className="text-xs text-indigo-200/60">Official Gamer Community</p>
                                </div>
                            </a>

                            {/* Website Twitter CTA */}
                            <a href="#" className="flex items-center gap-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all text-left group">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Users className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-blue-400">Follow on X (Twitter)</p>
                                    <p className="text-xs text-blue-200/60">Get instant code alerts</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Other Games */}
            <div className="pt-8 border-t border-white/5">
                <RelatedGames games={otherGames} />
            </div>
        </div>
    );
}
