import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { portfolioService } from '../services/portfolio.service.js';
import { success } from '../utils/api-response.js';

const router = Router();

const createSchema = z.object({
  ticker: z.string().min(1).max(10),
  name: z.string().min(1).max(100),
  sector: z.string().max(50).optional(),
  avgBuyPrice: z.string().min(1),
  currentPrice: z.string().min(1),
  lot: z.number().int().min(0),
});

const updateSchema = createSchema.partial();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const data = await portfolioService.list(req.userId!);
    res.json(success(data));
  } catch (err) { next(err); }
});

router.post('/', requireAuth, validate(createSchema), async (req, res, next) => {
  try {
    const data = await portfolioService.create(req.userId!, req.body);
    res.status(201).json(success(data));
  } catch (err) { next(err); }
});

router.patch('/:id', requireAuth, validate(updateSchema), async (req, res, next) => {
  try {
    const data = await portfolioService.update(req.userId!, req.params.id, req.body);
    res.json(success(data));
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await portfolioService.remove(req.userId!, req.params.id);
    res.json(success({ deleted: true }));
  } catch (err) { next(err); }
});

export default router;
