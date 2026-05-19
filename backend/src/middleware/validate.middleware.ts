import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Validate request body, query, or params against a Zod schema.
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      // Replace with parsed (and coerced) data
      (req as any)[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = (error.issues as any[]).map((e) => ({
          field: String(e.path?.join?.('.') ?? ''),
          message: String(e.message ?? 'Invalid'),
        }));
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Data tidak valid.',
            details,
          },
        });
        return;
      }
      next(error);
    }
  };
}
