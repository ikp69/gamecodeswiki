import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Get a unique version for the cache
// On Railway, RAILWAY_GIT_COMMIT_SHA is available. 
// If not, we use a startup timestamp to ensure cache is "reset" on every deploy/restart.
const CACHE_VERSION = process.env.RAILWAY_GIT_COMMIT_SHA || `v${Date.now()}`;
export const CACHE_PREFIX = `cache:${CACHE_VERSION}:`;

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 200, 5000);
    console.log(`[Redis] Reconnecting in ${delay}ms (attempt ${times})`);
    return delay;
  },
  lazyConnect: false,
});

redis.on('connect', () => {
  console.log(`[Redis] Connected (Prefix: ${CACHE_PREFIX})`);
});
redis.on('error', (err: Error) => console.error('[Redis] Error:', err.message));

export default redis;
