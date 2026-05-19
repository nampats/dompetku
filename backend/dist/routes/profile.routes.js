import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { profileService } from '../services/profile.service.js';
import { success } from '../utils/api-response.js';
const router = Router();
const updateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    image: z.string().url().optional(),
});
router.get('/', requireAuth, async (req, res, next) => {
    try {
        const data = await profileService.get(req.userId);
        res.json(success(data));
    }
    catch (err) {
        next(err);
    }
});
router.patch('/', requireAuth, validate(updateSchema), async (req, res, next) => {
    try {
        const data = await profileService.update(req.userId, req.body);
        res.json(success(data));
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=profile.routes.js.map