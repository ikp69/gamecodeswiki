import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { requestId } from './middleware/requestId.js';
import { frontendAuth } from './middleware/frontendAuth.js';
import { errorHandler } from './middleware/errorHandler.js';

import gamesRouter from './routes/games.js';
import statsRouter from './routes/stats.js';
import sitemapRouter from './routes/sitemap.js';

// Load env
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Trust proxy for Railway/Proxies (required for express-rate-limit)
app.set('trust proxy', 1);

// ─── Global Middleware ─────────────────────────────────────────────

// Security headers
app.use(helmet());

// Gzip compression
app.use(compression());

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, etc. in dev)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'X-Frontend-Key', 'X-Request-Id'],
}));

// Request ID
app.use(requestId);

// Set request ID in response
app.use((req, res, next) => {
  res.setHeader('X-Request-Id', (req as any).requestId || '');
  next();
});

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    type: 'https://api.codergg.com/errors/rate_limit',
    title: 'Too Many Requests',
    status: 429,
    detail: 'Rate limit exceeded. Try again later.',
  },
});

app.use('/api/', apiLimiter);

// JSON body parser
app.use(express.json({ limit: '1mb' }));

// ─── Routes ────────────────────────────────────────────────────────

// Sitemap (no frontend auth required — needs to be public for SEO crawlers)
app.use('/sitemap.xml', sitemapRouter);

// Health check (no auth)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes (frontend auth required)
app.use('/api/v1/games', frontendAuth, gamesRouter);
app.use('/api/v1/stats', frontendAuth, statsRouter);

// 404 for unmatched routes
app.use((_req, res) => {
  res.status(404).json({
    type: 'https://api.codergg.com/errors/not_found',
    title: 'Not Found',
    status: 404,
    detail: 'The requested endpoint does not exist',
  });
});

// ─── Global Error Handler ──────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 CoderGG API running on http://localhost:${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/health`);
  console.log(`   Games:   http://localhost:${PORT}/api/v1/games`);
  console.log(`   Stats:   http://localhost:${PORT}/api/v1/stats`);
  console.log(`   Sitemap: http://localhost:${PORT}/sitemap.xml\n`);
});

export default app;
