import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory store: IP -> { count, resetTime }
// Note: This resets on server restart. For production, use Upstash Redis.
const rateLimit = new Map<string, { count: number; resetAt: number }>();

const LIMIT = 60;         // max requests
const WINDOW_MS = 60_000; // per 60 seconds

function getIp(req: NextRequest): string {
    return (
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        req.headers.get('x-real-ip') ??
        'unknown'
    );
}

export function middleware(req: NextRequest) {
    const ip = getIp(req);
    const now = Date.now();
    const record = rateLimit.get(ip);

    if (!record || now > record.resetAt) {
        rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return NextResponse.next();
    }

    record.count++;

    if (record.count > LIMIT) {
        return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {
                'Retry-After': String(Math.ceil((record.resetAt - now) / 1000)),
                'Content-Type': 'text/plain',
            },
        });
    }

    return NextResponse.next();
}

// Apply rate limiting only to page routes and search — not to static assets
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
