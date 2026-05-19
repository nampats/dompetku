import type { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth.js';
import { fromNodeHeaders } from 'better-auth/node';

/**
 * Extend Express Request to carry authenticated user data.
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userSession?: {
        user: { id: string; name: string; email: string; image?: string | null };
        session: { id: string; expiresAt: Date };
      };
    }
  }
}

/**
 * Middleware that verifies the session via Better Auth.
 * Populates req.userId and req.userSession.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Silakan login terlebih dahulu.' },
      });
      return;
    }

    req.userId = session.user.id;
    req.userSession = session;
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Sesi tidak valid.' },
    });
  }
}
