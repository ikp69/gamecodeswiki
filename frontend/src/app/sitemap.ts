import type { MetadataRoute } from 'next';
import { getAllGames } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamecodeswiki.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    try {
        const games = await getAllGames();

        const gamePages = games.map((game) => ({
            url: `${SITE_URL}/roblox/${game.gameSlug}`,
            lastModified: new Date(game.updatedAt),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        }));

        return [
            {
                url: SITE_URL,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${SITE_URL}/latest`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.8,
            },
            {
                url: `${SITE_URL}/popular`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
            },
            ...gamePages,
        ];
    } catch (e) {
        console.error('Sitemap build-time fetch failed:', e);
        // Return minimal sitemap to avoid build crash
        return [
            {
                url: SITE_URL,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            }
        ];
    }
}
