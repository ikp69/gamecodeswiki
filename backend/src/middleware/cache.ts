import { Request, Response, NextFunction } from 'express';
import redis, { CACHE_PREFIX } from '../lib/redis.js';

/**
 * Redis response cache middleware factory.
 * Caches the full JSON response body with a given TTL.
 */
export function cache(ttlSeconds: number = 2592000) { // Default to 30 days
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Skip caching if Redis is not connected
    if (redis.status !== 'ready') {
      return next();
    }

    const cacheKey = `${CACHE_PREFIX}${req.originalUrl}`;

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('Content-Type', 'application/json');
        res.send(cached);
        return;
      }
    } catch {
      // Redis error — skip cache, proceed normally
      return next();
    }

    // Store original json method
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const serialized = JSON.stringify(body);
        redis.setex(cacheKey, ttlSeconds, serialized).catch(() => {});
        res.setHeader('X-Cache', 'MISS');
      }
      return originalJson(body);
    };

    next();
  };
}
