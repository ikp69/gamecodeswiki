import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors.js';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const requestId = (req as any).requestId || 'unknown';

  if (err instanceof AppError) {
    res.status(err.status).json({
      type: `https://api.codergg.com/errors/${err.code.toLowerCase()}`,
      title: err.title,
      status: err.status,
      detail: err.message,
      request_id: requestId,
    });
    return;
  }

  // Unexpected errors
  console.error(`[ERROR] ${requestId}:`, err);

  res.status(500).json({
    type: 'https://api.codergg.com/errors/internal',
    title: 'Internal Server Error',
    status: 500,
    detail: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
    request_id: requestId,
  });
}
