import type { Request, Response, NextFunction } from 'express';
/**
 * Extend Express Request to carry authenticated user data.
 */
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userSession?: {
                user: {
                    id: string;
                    name: string;
                    email: string;
                    image?: string | null;
                };
                session: {
                    id: string;
                    expiresAt: Date;
                };
            };
        }
    }
}
/**
 * Middleware that verifies the session via Better Auth.
 * Populates req.userId and req.userSession.
 */
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
