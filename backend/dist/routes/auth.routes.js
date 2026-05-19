import { Router } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../lib/auth.js';
const router = Router();
// Better Auth handles all /api/auth/* routes
router.use(toNodeHandler(auth));
export default router;
//# sourceMappingURL=auth.routes.js.map