import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { dashboardService } from '../services/dashboard.service.js';
import { success } from '../utils/api-response.js';
const router = Router();
router.get('/summary', requireAuth, async (req, res, next) => {
    try {
        const data = await dashboardService.getSummary(req.userId);
        res.json(success(data));
    }
    catch (err) {
        next(err);
    }
});
router.get('/cashflow', requireAuth, async (req, res, next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const data = await dashboardService.getCashflow(req.userId, year);
        res.json(success(data));
    }
    catch (err) {
        next(err);
    }
});
router.get('/top-expenses', requireAuth, async (req, res, next) => {
    try {
        const now = new Date();
        const month = parseInt(req.query.month) || now.getMonth() + 1;
        const year = parseInt(req.query.year) || now.getFullYear();
        const data = await dashboardService.getTopExpenses(req.userId, month, year);
        res.json(success(data));
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=dashboard.routes.js.map