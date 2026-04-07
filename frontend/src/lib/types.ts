// ─── Types ──────────────────────────────────────────────────────────

export interface Code {
  code: string;
  reward: string;
  status: 'active' | 'expired';
  added_on?: string;
}

export interface Game {
  id: string;
  gameName: string;
  gameSlug: string;
  robloxUrl?: string;
  developerName?: string;
  developerLink?: string;
  iconUrl?: string;
  thumbnailUrl?: string;
  images?: string[];
  genre?: string;
  subGenre?: string;
  discordLink?: string;
  robloxViews?: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  activeCount: number;
  expiredCount: number;
  codes: Code[];
}

export interface RelatedGame {
  slug: string;
  title: string;
  thumbnail_url: string | null;
  active_count: number;
  genre: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
