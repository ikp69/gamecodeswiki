import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, closePool } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate(): Promise<void> {
  console.log('[Migrate] Starting migrations...');

  // Enable pg_trgm extension for trigram search
  await query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

  // Create migrations tracking table
  await query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         SERIAL PRIMARY KEY,
      filename   VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Read migration files
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  // Get already applied migrations
  const result = await query('SELECT filename FROM _migrations ORDER BY filename');
  const applied = new Set(result.rows.map((r: { filename: string }) => r.filename));

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`[Migrate] Skipping (already applied): ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`[Migrate] Applying: ${file}`);

    await query(sql);
    await query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
    console.log(`[Migrate] Applied: ${file}`);
  }

  console.log('[Migrate] All migrations applied successfully');
  await closePool();
}

migrate().catch((err) => {
  console.error('[Migrate] Failed:', err);
  process.exit(1);
});
