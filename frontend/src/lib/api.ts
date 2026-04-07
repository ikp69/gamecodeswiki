/* eslint-disable @typescript-eslint/no-explicit-any */
import { Game, Code } from '@/lib/types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');
const FRONTEND_KEY = process.env.NEXT_PUBLIC_FRONTEND_KEY || '';

const DEFAULT_REVALIDATE = process.env.NODE_ENV === 'development' ? 0 : 3600;

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${API_URL}${path}`;
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'X-Frontend-Key': FRONTEND_KEY,
                ...options?.headers,
            },
        });

        if (!res.ok) {
            // During build time, don't crash on 404 or other API errors
            const isBuildTime = process.env.NODE_ENV === 'production' && typeof window === 'undefined';
            if (isBuildTime) {
                console.warn(`[API Build Warning] ${res.status} on ${url}. Returning empty defaults.`);
                return {
                    data: [],
                    pagination: { total: 0, totalPages: 0 }
                } as unknown as T;
            }
            throw new Error(`API error ${res.status}: ${res.statusText} at ${url}`);
        }

        return await res.json();
    } catch (error: any) {
        // Handle connection errors
        const isConnectionError = error.code === 'ECONNREFUSED' || error.message?.includes('fetch failed');

        if (isConnectionError) {
            console.warn(`[API] Connection failed to ${url}. Returning empty defaults.`);
            return {
                data: [],
                pagination: { total: 0, totalPages: 0 }
            } as unknown as T;
        }

        throw error;
    }
}

/** Helper to properly map backend responses to Game type */
function mapGame(data: any): Game {
    if (!data) {
        throw new Error('mapGame called with null/undefined data');
    }
    return {
        id: String(data.id || ''),
        gameName: String(data.title || data.gameName || ''),
        gameSlug: String(data.slug || data.gameSlug || ''),
        robloxUrl: data.roblox_link || data.robloxUrl,
        developerName: data.developer_name || data.developerName || data.developer,
        developerLink: data.developer_link || data.developerLink,
        iconUrl: data.thumbnail_url || data.iconUrl,
        thumbnailUrl: data.thumbnail_url || data.thumbnailUrl,
        images: Array.isArray(data.images) ? data.images : typeof data.images === 'string' ? [data.images] : [],
        genre: data.genre || '',
        subGenre: data.sub_genre || data.subGenre || '',
        discordLink: data.discord_link || data.discordLink,
        robloxViews: data.roblox_views ? parseInt(data.roblox_views, 10) : 0,
        description: data.description || '',
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
        updatedAt: data.updated_at || data.updatedAt || new Date().toISOString(),
        activeCount: data.active_count ?? data.activeCount ?? 0,
        expiredCount: data.expired_count ?? data.expiredCount ?? 0,
        codes: [
            ...(data.active_codes || []).map((c: any) => ({ ...c, status: 'active' as const })),
            ...(data.expired_codes || []).map((c: any) => ({ ...c, status: 'expired' as const })),
            ...(data.codes || [])
        ] as Code[]
    };
}

function formatResponse(data: any): Game[] {
    if (!data) return [];
    if (Array.isArray(data.data)) {
        return data.data.map(mapGame);
    }
    if (Array.isArray(data)) {
        return data.map(mapGame);
    }
    return [];
}

const BASE_FILTERS = 'has_codes=true&has_thumbnail=true';

export async function getAllGames(): Promise<Game[]> {
    const data = await apiFetch<any>(`/api/v1/games?limit=1000&${BASE_FILTERS}`, { next: { revalidate: DEFAULT_REVALIDATE } });
    return formatResponse(data);
}

export async function getPaginatedGames(page: number = 1, limit: number = 20): Promise<{ games: Game[], totalPages: number, totalCount: number }> {
    const data = await apiFetch<any>(`/api/v1/games?page=${page}&limit=${limit}&${BASE_FILTERS}`, { next: { revalidate: DEFAULT_REVALIDATE } });
    return {
        games: formatResponse(data),
        totalPages: data.pagination?.totalPages || 0,
        totalCount: data.pagination?.total || 0,
    };
}

export async function getGamesByGenre(genre: string, page: number = 1, limit: number = 40): Promise<{ games: Game[], totalPages: number }> {
    const data = await apiFetch<any>(`/api/v1/games?genre=${encodeURIComponent(genre)}&page=${page}&limit=${limit}&${BASE_FILTERS}`, { next: { revalidate: DEFAULT_REVALIDATE } });
    return {
        games: formatResponse(data),
        totalPages: data.pagination?.totalPages || 0,
    };
}

export async function getLatestGames(limit: number = 50): Promise<Game[]> {
    const data = await apiFetch<any>(`/api/v1/games?sort=latest&limit=${limit}&${BASE_FILTERS}`, { next: { revalidate: DEFAULT_REVALIDATE } });
    return formatResponse(data);
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
    try {
        const data = await apiFetch<any>(`/api/v1/games/${slug}`, { next: { revalidate: DEFAULT_REVALIDATE } });
        return mapGame(data.data || data);
    } catch (e: any) {
        if (e.message && e.message.includes('404')) return null;
        throw e;
    }
}

export async function getGamesByIds(ids: string[]): Promise<Game[]> {
    if (!ids || ids.length === 0) return [];
    // We don't apply BASE_FILTERS here because we want to show specifically bookmarked games even if they run out of codes temporarily
    const data = await apiFetch<any>(`/api/v1/games?ids=${ids.join(',')}&limit=${ids.length}`, { next: { revalidate: DEFAULT_REVALIDATE } });
    return formatResponse(data);
}

export async function getFeaturedGames(): Promise<Game[]> {
    const data = await apiFetch<any>(`/api/v1/games?sort=popular&limit=2&${BASE_FILTERS}`, { next: { revalidate: DEFAULT_REVALIDATE } });
    return formatResponse(data);
}

export async function searchGames(query: string): Promise<Game[]> {
    const data = await apiFetch<any>(`/api/v1/games?search=${encodeURIComponent(query)}&limit=20&${BASE_FILTERS}`, { cache: 'no-store' });
    return formatResponse(data);
}

export async function getOtherGames(excludeId: string, limit: number = 4): Promise<Game[]> {
    const data = await apiFetch<any>(`/api/v1/games?sort=popular&limit=10&${BASE_FILTERS}`, { next: { revalidate: DEFAULT_REVALIDATE } });
    const games = formatResponse(data);
    return games.filter(g => g.id !== excludeId).slice(0, limit);
}

export async function getPopularGames(limit: number = 50): Promise<Game[]> {
    const data = await apiFetch<any>(`/api/v1/games?sort=popular&limit=${limit}&${BASE_FILTERS}`, { next: { revalidate: DEFAULT_REVALIDATE } });
    return formatResponse(data);
}
