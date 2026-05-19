import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { accountService } from '../services/account.service.js';
import { success } from '../utils/api-response.js';
const router = Router();
const createSchema = z.object({
    name: z.string().min(1).max(100),
    type: z.enum(['bank', 'e_wallet', 'cash', 'investment']),
    bankCode: z.string().max(10).optional(),
    maskedAccountNumber: z.string().max(30).optional(),
    initialBalance: z.string().optional(),
    icon: z.string().max(50).optional(),
    color: z.string().max(7).optional(),
});
const updateSchema = createSchema.partial();
router.get('/', requireAuth, async (req, res, next) => {
    try {
        const data = await accountService.list(req.userId);
        res.json(success(data));
    }
    catch (err) {
        next(err);
    }
});
router.post('/', requireAuth, validate(createSchema), async (req, res, next) => {
    try {
        const data = await accountService.create(req.userId, req.body);
        res.status(201).json(success(data));
    }
    catch (err) {
        next(err);
    }
});
router.patch('/:id', requireAuth, validate(updateSchema), async (req, res, next) => {
    try {
        const data = await accountService.update(req.userId, req.params.id, req.body);
        res.json(success(data));
    }
    catch (err) {
        next(err);
    }
});
router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        await accountService.remove(req.userId, req.params.id);
        res.json(success({ deleted: true }));
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=account.routes.js.map