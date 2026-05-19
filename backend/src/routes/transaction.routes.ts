import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { transactionService } from '../services/transaction.service.js';
import { success, paginated } from '../utils/api-response.js';
import { getPagination } from '../utils/pagination.js';

const router = Router();

const createSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  categoryId: z.string().uuid().optional(),
  fromAccountId: z.string().uuid().optional(),
  toAccountId: z.string().uuid().optional(),
  amount: z.string().min(1),
  fee: z.string().optional(),
  description: z.string().min(1).max(255),
  note: z.string().optional(),
  date: z.string().min(1),
});

const updateSchema = createSchema.partial();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const pagination = getPagination(req);
    const filters = {
      type: req.query.type as any,
      categoryId: req.query.categoryId as string,
      search: req.query.search as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      ...pagination,
    };
    const { data, total } = await transactionService.list(req.userId!, filters);
    res.json(paginated(data, total, pagination.page, pagination.limit));
  } catch (err) { next(err); }
});

router.post('/', requireAuth, validate(createSchema), async (req, res, next) => {
  try {
    const data = await transactionService.create(req.userId!, req.body);
    res.status(201).json(success(data));
  } catch (err) { next(err); }
});

router.patch('/:id', requireAuth, validate(updateSchema), async (req, res, next) => {
  try {
    const data = await transactionService.update(req.userId!, req.params.id, req.body);
    res.json(success(data));
  } catch (err) { next(err); }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    await transactionService.remove(req.userId!, req.params.id);
    res.json(success({ deleted: true }));
  } catch (err) { next(err); }
});

export default router;
