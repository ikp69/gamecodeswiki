-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id             SERIAL PRIMARY KEY,
  slug           VARCHAR(255) UNIQUE NOT NULL,
  title          VARCHAR(255) NOT NULL,
  thumbnail_url  TEXT,
  images         TEXT[],
  genre          VARCHAR(100),
  sub_genre      VARCHAR(100),
  roblox_link    TEXT,
  discord_link   TEXT,
  description    TEXT,
  developer_name VARCHAR(255),
  developer_link TEXT,
  source_url     TEXT,
  rolimons_link  TEXT,
  total_views    BIGINT DEFAULT 0,
  active_count   INTEGER DEFAULT 0,
  expired_count  INTEGER DEFAULT 0,
  last_checked   TIMESTAMPTZ DEFAULT NOW(),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);
CREATE INDEX IF NOT EXISTS idx_games_genre ON games(genre);
CREATE INDEX IF NOT EXISTS idx_games_updated_at ON games(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_games_total_views ON games(total_views DESC);
CREATE INDEX IF NOT EXISTS idx_games_title_trgm ON games USING gin(title gin_trgm_ops);
