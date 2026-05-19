import type { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
/**
 * Validate request body, query, or params against a Zod schema.
 */
export declare function validate(schema: ZodSchema, source?: 'body' | 'query' | 'params'): (req: Request, res: Response, next: NextFunction) => void;
