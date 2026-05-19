import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { budgetService } from '../services/budget.service.js';
import { success } from '../utils/api-response.js';

const router = Router();

const upsertSchema = z.object({
  categoryId: z.string().uuid(),
  amount: z.string().min(1),
  period: z.enum(['monthly', 'weekly', 'yearly']).optional(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020),
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const month = req.query.month ? parseInt(req.query.month as string) : undefined;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const data = await budgetService.list(req.userId!, month, year);
    res.json(success(data));
  } catch (err) { next(err); }
});

router.post('/', requireAuth, validate(upsertSchema), async (req, res, next) => {
  try {
    const data = await budgetService.upsert(req.userId!, req.body);
    res.status(201).json(success(data));
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await budgetService.remove(req.userId!, req.params.id);
    res.json(success({ deleted: true }));
  } catch (err) { next(err); }
});

export default router;
