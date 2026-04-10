import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../db/connection.js';
import { cache } from '../middleware/cache.js';

const router = Router();

// ─── GET /api/v1/stats ─────────────────────────────────────────────
// Site-wide statistics
router.get('/', cache(), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await query(`
      SELECT
        (SELECT COUNT(*) FROM games) AS total_games,
        (SELECT COUNT(*) FROM codes WHERE status = 'active') AS total_active_codes,
        (SELECT COUNT(*) FROM codes WHERE status = 'expired') AS total_expired_codes,
        (SELECT COUNT(*) FROM codes WHERE status = 'active' AND added_on = CURRENT_DATE) AS codes_added_today,
        (SELECT COALESCE(SUM(total_views), 0) FROM games) AS total_views
    `);

    const stats = result.rows[0];

    res.json({
      data: {
        total_games: parseInt(stats.total_games, 10),
        total_active_codes: parseInt(stats.total_active_codes, 10),
        total_expired_codes: parseInt(stats.total_expired_codes, 10),
        codes_added_today: parseInt(stats.codes_added_today, 10),
        total_views: parseInt(stats.total_views, 10),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
