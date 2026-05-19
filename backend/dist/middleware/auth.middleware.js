import { auth } from '../lib/auth.js';
import { fromNodeHeaders } from 'better-auth/node';
/**
 * Middleware that verifies the session via Better Auth.
 * Populates req.userId and req.userSession.
 */
export async function requireAuth(req, res, next) {
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
    }
    catch {
        res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Sesi tidak valid.' },
        });
    }
}
//# sourceMappingURL=auth.middleware.js.map