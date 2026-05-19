import type { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    code?: string;
}
export declare function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction): void;
/**
 * Create a typed application error.
 */
export declare function createError(message: string, statusCode?: number, code?: string): AppError;
