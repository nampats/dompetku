import { eq, and } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { portfolioHoldings } from '../db/schema/index.js';
import { createError } from '../middleware/error.middleware.js';

export const portfolioService = {
  async list(userId: string) {
    return db
      .select()
      .from(portfolioHoldings)
      .where(eq(portfolioHoldings.userId, userId))
      .orderBy(portfolioHoldings.ticker);
  },

  async getById(userId: string, id: string) {
    const [result] = await db
      .select()
      .from(portfolioHoldings)
      .where(and(eq(portfolioHoldings.id, id), eq(portfolioHoldings.userId, userId)));

    if (!result) throw createError('Aset portofolio tidak ditemukan.', 404, 'NOT_FOUND');
    return result;
  },

  async create(
    userId: string,
    data: {
      ticker: string;
      name: string;
      sector?: string;
      avgBuyPrice: string;
      currentPrice: string;
      lot: number;
    }
  ) {
    const [result] = await db
      .insert(portfolioHoldings)
      .values({ userId, ...data })
      .returning();
    return result;
  },

  async update(
    userId: string,
    id: string,
    data: Partial<{
      ticker: string;
      name: string;
      sector: string;
      avgBuyPrice: string;
      currentPrice: string;
      lot: number;
    }>
  ) {
    await this.getById(userId, id);
    const [result] = await db
      .update(portfolioHoldings)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(portfolioHoldings.id, id), eq(portfolioHoldings.userId, userId)))
      .returning();
    return result;
  },

  async remove(userId: string, id: string) {
    await this.getById(userId, id);
    await db.delete(portfolioHoldings).where(eq(portfolioHoldings.id, id));
  },
};
