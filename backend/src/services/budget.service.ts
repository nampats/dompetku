import { eq, and } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { budgets, categories } from '../db/schema/index.js';
import { createError } from '../middleware/error.middleware.js';

export const budgetService = {
  async list(userId: string, month?: number, year?: number) {
    const conditions = [eq(budgets.userId, userId)];
    if (month) conditions.push(eq(budgets.month, month));
    if (year) conditions.push(eq(budgets.year, year));

    return db
      .select({
        id: budgets.id,
        categoryId: budgets.categoryId,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        amount: budgets.amount,
        period: budgets.period,
        month: budgets.month,
        year: budgets.year,
      })
      .from(budgets)
      .leftJoin(categories, eq(budgets.categoryId, categories.id))
      .where(and(...conditions));
  },

  async upsert(
    userId: string,
    data: {
      categoryId: string;
      amount: string;
      period?: 'monthly' | 'weekly' | 'yearly';
      month: number;
      year: number;
    }
  ) {
    // Check for existing budget for this category+month+year
    const [existing] = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, userId),
          eq(budgets.categoryId, data.categoryId),
          eq(budgets.month, data.month),
          eq(budgets.year, data.year)
        )
      );

    if (existing) {
      const [result] = await db
        .update(budgets)
        .set({ amount: data.amount, period: data.period, updatedAt: new Date() })
        .where(eq(budgets.id, existing.id))
        .returning();
      return result;
    }

    const [result] = await db
      .insert(budgets)
      .values({ userId, ...data })
      .returning();
    return result;
  },

  async remove(userId: string, id: string) {
    const [budget] = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)));

    if (!budget) throw createError('Anggaran tidak ditemukan.', 404, 'NOT_FOUND');

    await db.delete(budgets).where(eq(budgets.id, id));
  },
};
