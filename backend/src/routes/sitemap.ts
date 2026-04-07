import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../db/connection.js';
import { cache } from '../middleware/cache.js';

const router = Router();

// ─── GET /sitemap.xml ──────────────────────────────────────────────
// Auto-generated XML sitemap from game slugs
router.get('/', cache(3600), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const baseUrl = process.env.SITE_URL || 'https://codergg.com';

    const result = await query(
      `SELECT slug, updated_at FROM games ORDER BY updated_at DESC`
    );

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Homepage
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;

    // Game pages
    for (const row of result.rows) {
      const lastmod = row.updated_at
        ? new Date(row.updated_at).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/${row.slug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

export default router;
