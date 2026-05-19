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
export declare function getPagination(req: Request): PaginationParams;
