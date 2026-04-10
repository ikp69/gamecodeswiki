import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../db/connection.js';
import { NotFoundError, ValidationError } from '../lib/errors.js';
import { cache } from '../middleware/cache.js';

const router = Router();

// ─── GET /api/v1/games ─────────────────────────────────────────────
// Unified game listing with sort, genre, search, pagination
router.get('/', cache(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;
    const sort = (req.query.sort as string) || 'latest';
    const genre = req.query.genre as string | undefined;
    const search = req.query.search as string | undefined;
    const hasCodes = req.query.has_codes === 'true';
    const hasThumbnail = req.query.has_thumbnail === 'true';
    const ids = req.query.ids as string | undefined;

    // Build WHERE conditions
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (ids) {
      const idList = ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      if (idList.length > 0) {
        conditions.push(`g.id = ANY($${paramIndex}::int[])`);
        params.push(idList);
        paramIndex++;
      }
    }

    if (genre) {
      conditions.push(`g.genre ILIKE $${paramIndex}`);
      params.push(genre);
      paramIndex++;
    }

    if (search) {
      conditions.push(`g.title ILIKE $${paramIndex}`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (hasCodes) {
      conditions.push('g.active_count > 0');
    }

    if (hasThumbnail) {
      conditions.push(`(g.thumbnail_url IS NOT NULL AND g.thumbnail_url != '' AND g.thumbnail_url NOT LIKE '%placeholder%')`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sort logic
    let orderClause: string;
    switch (sort) {
      case 'popular':
        orderClause = 'ORDER BY g.total_views DESC, g.last_checked DESC';
        break;
      case 'latest':
      default:
        orderClause = 'ORDER BY g.last_checked DESC, g.id DESC';
        break;
    }

    // Count query
    const countResult = await query(
      `SELECT COUNT(*) as total FROM games g ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].total, 10);
    const totalPages = Math.ceil(total / limit);

    // Data query
    const dataParams = [...params, limit, offset];
    const dataResult = await query(
      `SELECT
        g.id,
        g.slug,
        g.title,
        g.thumbnail_url,
        g.genre,
        g.sub_genre,
        g.active_count,
        g.expired_count,
        g.last_checked,
        g.total_views
      FROM games g
      ${whereClause}
      ${orderClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      dataParams
    );

    res.json({
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/games/:slug ───────────────────────────────────────
// Full game detail with codes + related games
router.get('/:slug', cache(), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    if (!slug || slug.length > 255) {
      throw new ValidationError('Invalid game slug');
    }

    // Get game
    const gameResult = await query(
      `SELECT
        g.id, g.slug, g.title, g.thumbnail_url, g.images, g.genre, g.sub_genre,
        g.roblox_link, g.discord_link, g.description, g.developer_name, g.developer_link,
        g.source_url, g.rolimons_link, g.total_views, g.active_count, g.expired_count,
        g.last_checked, g.created_at, g.updated_at
      FROM games g
      WHERE g.slug = $1`,
      [slug]
    );

    if (gameResult.rows.length === 0) {
      throw new NotFoundError(`Game not found: ${slug}`);
    }

    const game = gameResult.rows[0];

    // Increment view count (fire-and-forget)
    query('UPDATE games SET total_views = total_views + 1 WHERE id = $1', [game.id]).catch(() => { });

    // Get active codes (ordered by added_on DESC)
    const activeCodesResult = await query(
      `SELECT code, reward, added_on
       FROM codes
       WHERE game_id = $1 AND status = 'active'
       ORDER BY added_on DESC, id DESC`,
      [game.id]
    );

    // Get expired codes (ordered by added_on DESC)
    const expiredCodesResult = await query(
      `SELECT code, reward, added_on
       FROM codes
       WHERE game_id = $1 AND status = 'expired'
       ORDER BY added_on DESC, id DESC`,
      [game.id]
    );

    // Get related games (same genre, exclude current, limit 6)
    const relatedResult = await query(
      `SELECT slug, title, thumbnail_url, active_count, genre
       FROM games
       WHERE genre = $1 AND id != $2
       ORDER BY total_views DESC
       LIMIT 6`,
      [game.genre, game.id]
    );

    res.json({
      data: {
        ...game,
        active_codes: activeCodesResult.rows,
        expired_codes: expiredCodesResult.rows,
        related_games: relatedResult.rows,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
