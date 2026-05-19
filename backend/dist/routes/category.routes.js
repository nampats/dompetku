import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { categoryService } from '../services/category.service.js';
import { success } from '../utils/api-response.js';
const router = Router();
const createSchema = z.object({
    name: z.string().min(1).max(50),
    type: z.enum(['income', 'expense', 'both']),
    icon: z.string().max(50).optional(),
    color: z.string().max(7).optional(),
});
router.get('/', requireAuth, async (req, res, next) => {
    try {
        const data = await categoryService.list(req.userId);
        res.json(success(data));
    }
    catch (err) {
        next(err);
    }
});
router.post('/', requireAuth, validate(createSchema), async (req, res, next) => {
    try {
        const data = await categoryService.create(req.userId, req.body);
        res.status(201).json(success(data));
    }
    catch (err) {
        next(err);
    }
});
router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        await categoryService.remove(req.userId, req.params.id);
        res.json(success({ deleted: true }));
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=category.routes.js.map