import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { settingsService } from '../services/settings.service.js';
import { success } from '../utils/api-response.js';

const router = Router();

const updateSchema = z.object({
  currency: z.string().max(5).optional(),
  locale: z.string().max(10).optional(),
  googleSheetsApiKey: z.string().optional(),
  googleSheetsSpreadsheetId: z.string().max(100).optional(),
  googleSheetsEnabled: z.boolean().optional(),
  telegramBotToken: z.string().optional(),
  telegramChatId: z.string().max(50).optional(),
  telegramEnabled: z.boolean().optional(),
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const data = await settingsService.get(req.userId!);
    res.json(success(data));
  } catch (err) { next(err); }
});

router.patch('/', requireAuth, validate(updateSchema), async (req, res, next) => {
  try {
    const data = await settingsService.update(req.userId!, req.body);
    res.json(success(data));
  } catch (err) { next(err); }
});

export default router;
