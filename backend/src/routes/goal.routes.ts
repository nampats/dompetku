import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { goalService } from '../services/goal.service.js';
import { success } from '../utils/api-response.js';

const router = Router();

const createSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  icon: z.string().max(50).optional(),
  targetAmount: z.string().min(1),
  currentAmount: z.string().optional(),
  deadline: z.string().optional(),
  color: z.string().max(7).optional(),
});

const updateSchema = createSchema.partial();

const contributionSchema = z.object({
  amount: z.string().min(1),
  contributedAt: z.string().min(1),
  note: z.string().optional(),
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const data = await goalService.list(req.userId!);
    res.json(success(data));
  } catch (err) { next(err); }
});

router.post('/', requireAuth, validate(createSchema), async (req, res, next) => {
  try {
    const data = await goalService.create(req.userId!, req.body);
    res.status(201).json(success(data));
  } catch (err) { next(err); }
});

router.patch('/:id', requireAuth, validate(updateSchema), async (req, res, next) => {
  try {
    const data = await goalService.update(req.userId!, req.params.id, req.body);
    res.json(success(data));
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await goalService.remove(req.userId!, req.params.id);
    res.json(success({ deleted: true }));
  } catch (err) { next(err); }
});

router.post('/:id/contributions', requireAuth, validate(contributionSchema), async (req, res, next) => {
  try {
    const data = await goalService.addContribution(req.userId!, req.params.id, req.body);
    res.status(201).json(success(data));
  } catch (err) { next(err); }
});

export default router;
