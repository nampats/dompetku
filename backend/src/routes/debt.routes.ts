import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { debtService } from '../services/debt.service.js';
import { success } from '../utils/api-response.js';

const router = Router();

const createSchema = z.object({
  type: z.enum(['utang', 'piutang']),
  title: z.string().min(1).max(200),
  counterparty: z.string().min(1).max(100),
  category: z.string().max(50).optional(),
  totalAmount: z.string().min(1),
  icon: z.string().max(50).optional(),
  dueDate: z.string().optional(),
  recurringDay: z.number().int().min(1).max(31).optional(),
  note: z.string().optional(),
});

const updateSchema = createSchema.partial().extend({
  status: z.enum(['active', 'paid_off', 'overdue', 'cancelled']).optional(),
});

const paymentSchema = z.object({
  amount: z.string().min(1),
  paidAt: z.string().min(1),
  note: z.string().optional(),
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const data = await debtService.list(
      req.userId!,
      req.query.type as any,
      req.query.status as string
    );
    res.json(success(data));
  } catch (err) { next(err); }
});

router.post('/', requireAuth, validate(createSchema), async (req, res, next) => {
  try {
    const data = await debtService.create(req.userId!, req.body);
    res.status(201).json(success(data));
  } catch (err) { next(err); }
});

router.patch('/:id', requireAuth, validate(updateSchema), async (req, res, next) => {
  try {
    const data = await debtService.update(req.userId!, req.params.id, req.body);
    res.json(success(data));
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await debtService.remove(req.userId!, req.params.id);
    res.json(success({ deleted: true }));
  } catch (err) { next(err); }
});

router.post('/:id/payments', requireAuth, validate(paymentSchema), async (req, res, next) => {
  try {
    const data = await debtService.addPayment(req.userId!, req.params.id, req.body);
    res.status(201).json(success(data));
  } catch (err) { next(err); }
});

router.get('/:id/payments', requireAuth, async (req, res, next) => {
  try {
    const data = await debtService.listPayments(req.userId!, req.params.id);
    res.json(success(data));
  } catch (err) { next(err); }
});

export default router;
