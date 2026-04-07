import { NextResponse } from 'next/server';
import { getGamesByIds } from '@/lib/api';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    if (!idsParam) return NextResponse.json([]);
    const ids = idsParam.split(',').filter(Boolean);
    try {
        const games = await getGamesByIds(ids);
        return NextResponse.json(games);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}
