import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../lib/errors.js';

export function frontendAuth(req: Request, _res: Response, next: NextFunction): void {
  const key = req.headers['x-frontend-key'] as string | undefined;
  const expectedKey = process.env.FRONTEND_KEY;

  if (!expectedKey) {
    // If no key configured, skip check (dev convenience)
    return next();
  }

  if (!key || key !== expectedKey) {
    throw new ForbiddenError('Invalid or missing frontend key');
  }

  next();
}
