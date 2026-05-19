import type { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Extract pagination params from request query.
 * Defaults: page=1, limit=20, max limit=100
 */
export function getPagination(req: Request): PaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
