import { eq, and } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { portfolioHoldings } from '../db/schema/index.js';
import { createError } from '../middleware/error.middleware.js';
export const portfolioService = {
    async list(userId) {
        return db
            .select()
            .from(portfolioHoldings)
            .where(eq(portfolioHoldings.userId, userId))
            .orderBy(portfolioHoldings.ticker);
    },
    async getById(userId, id) {
        const [result] = await db
            .select()
            .from(portfolioHoldings)
            .where(and(eq(portfolioHoldings.id, id), eq(portfolioHoldings.userId, userId)));
        if (!result)
            throw createError('Aset portofolio tidak ditemukan.', 404, 'NOT_FOUND');
        return result;
    },
    async create(userId, data) {
        const [result] = await db
            .insert(portfolioHoldings)
            .values({ userId, ...data })
            .returning();
        return result;
    },
    async update(userId, id, data) {
        await this.getById(userId, id);
        const [result] = await db
            .update(portfolioHoldings)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(portfolioHoldings.id, id), eq(portfolioHoldings.userId, userId)))
            .returning();
        return result;
    },
    async remove(userId, id) {
        await this.getById(userId, id);
        await db.delete(portfolioHoldings).where(eq(portfolioHoldings.id, id));
    },
};
//# sourceMappingURL=portfolio.service.js.map