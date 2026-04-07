import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, getClient, closePool } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CodeEntry {
  code: string;
  reward: string;
  status: 'active' | 'expired';
  added_on: string;
}

interface GameEntry {
  title: string;
  slug: string;
  source_url?: string;
  discord_link?: string;
  roblox_link?: string;
  rolimons_link?: string;
  images?: string[];
  developer_name?: string;
  developer_link?: string;
  genre?: string;
  sub_genre?: string;
  codes?: CodeEntry[];
}

async function seed(): Promise<void> {
  const dataPath = path.resolve(__dirname, '../../data-fetching', 'final_game_data.json');

  if (!fs.existsSync(dataPath)) {
    console.error(`[Seed] Data file not found: ${dataPath}`);
    process.exit(1);
  }

  console.log('[Seed] Reading game data...');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const games: GameEntry[] = JSON.parse(raw);
  console.log(`[Seed] Found ${games.length} games`);

  const client = await getClient();

  try {
    await client.query('BEGIN');

    let totalCodes = 0;

    for (let i = 0; i < games.length; i++) {
      const g = games[i];

      // Upsert game
      const gameResult = await client.query(
        `INSERT INTO games (slug, title, thumbnail_url, images, genre, sub_genre, roblox_link, discord_link, developer_name, developer_link, source_url, rolimons_link)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           thumbnail_url = EXCLUDED.thumbnail_url,
           images = EXCLUDED.images,
           genre = EXCLUDED.genre,
           sub_genre = EXCLUDED.sub_genre,
           roblox_link = EXCLUDED.roblox_link,
           discord_link = EXCLUDED.discord_link,
           developer_name = EXCLUDED.developer_name,
           developer_link = EXCLUDED.developer_link,
           source_url = EXCLUDED.source_url,
           rolimons_link = EXCLUDED.rolimons_link,
           updated_at = NOW()
         RETURNING id`,
        [
          g.slug,
          g.title,
          g.images?.[0] || null,
          g.images || [],
          g.genre || null,
          g.sub_genre || null,
          g.roblox_link || null,
          g.discord_link || null,
          g.developer_name || null,
          g.developer_link || null,
          g.source_url || null,
          g.rolimons_link || null,
        ]
      );

      const gameId = gameResult.rows[0].id;

      // Delete existing codes for this game (full reseed)
      await client.query('DELETE FROM codes WHERE game_id = $1', [gameId]);

      // Insert codes
      const codes = g.codes || [];
      if (codes.length > 0) {
        const values: unknown[] = [];
        const placeholders: string[] = [];
        let paramIndex = 1;

        for (const c of codes) {
          placeholders.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4})`);
          values.push(gameId, c.code, c.reward, c.status, c.added_on);
          paramIndex += 5;
        }

        await client.query(
          `INSERT INTO codes (game_id, code, reward, status, added_on) VALUES ${placeholders.join(', ')}`,
          values
        );

        totalCodes += codes.length;
      }

      // Update denormalized counts
      const activeCount = codes.filter(c => c.status === 'active').length;
      const expiredCount = codes.filter(c => c.status === 'expired').length;

      // Find the most recent code date as last_checked
      const latestDate = codes.length > 0
        ? codes.reduce((latest, c) => c.added_on > latest ? c.added_on : latest, codes[0].added_on)
        : null;

      await client.query(
        `UPDATE games SET active_count = $1, expired_count = $2, last_checked = COALESCE($3, NOW()), updated_at = NOW() WHERE id = $4`,
        [activeCount, expiredCount, latestDate, gameId]
      );

      if ((i + 1) % 50 === 0) {
        console.log(`[Seed] Processed ${i + 1}/${games.length} games...`);
      }
    }

    await client.query('COMMIT');
    console.log(`[Seed] Done! Inserted ${games.length} games and ${totalCodes} codes`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Seed] Failed, transaction rolled back:', err);
    throw err;
  } finally {
    client.release();
    await closePool();
  }
}

seed().catch((err) => {
  console.error('[Seed] Fatal error:', err);
  process.exit(1);
});
