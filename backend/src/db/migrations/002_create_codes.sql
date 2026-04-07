-- Create codes table
CREATE TABLE IF NOT EXISTS codes (
  id         SERIAL PRIMARY KEY,
  game_id    INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  code       VARCHAR(255) NOT NULL,
  reward     TEXT NOT NULL,
  status     VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'expired')),
  added_on   DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_codes_game_id ON codes(game_id);
CREATE INDEX IF NOT EXISTS idx_codes_status ON codes(status);
CREATE INDEX IF NOT EXISTS idx_codes_added_on ON codes(added_on DESC);
CREATE INDEX IF NOT EXISTS idx_codes_game_status ON codes(game_id, status);
