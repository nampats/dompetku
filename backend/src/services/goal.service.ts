import { eq, and, sql } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { goals, goalContributions } from '../db/schema/index.js';
import { createError } from '../middleware/error.middleware.js';

export const goalService = {
  async list(userId: string) {
    return db.select().from(goals).where(eq(goals.userId, userId)).orderBy(goals.createdAt);
  },

  async getById(userId: string, id: string) {
    const [result] = await db
      .select()
      .from(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)));

    if (!result) throw createError('Target dana tidak ditemukan.', 404, 'NOT_FOUND');
    return result;
  },

  async create(
    userId: string,
    data: {
      title: string;
      description?: string;
      icon?: string;
      targetAmount: string;
      currentAmount?: string;
      deadline?: string;
      color?: string;
    }
  ) {
    const [result] = await db
      .insert(goals)
      .values({ userId, ...data })
      .returning();
    return result;
  },

  async update(
    userId: string,
    id: string,
    data: Partial<{
      title: string;
      description: string;
      icon: string;
      targetAmount: string;
      deadline: string;
      color: string;
    }>
  ) {
    await this.getById(userId, id);
    const [result] = await db
      .update(goals)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(goals.id, id), eq(goals.userId, userId)))
      .returning();
    return result;
  },

  async remove(userId: string, id: string) {
    await this.getById(userId, id);
    await db.delete(goals).where(eq(goals.id, id));
  },

  async addContribution(
    userId: string,
    goalId: string,
    data: { amount: string; contributedAt: string; note?: string }
  ) {
    await this.getById(userId, goalId);

    const [contribution] = await db
      .insert(goalContributions)
      .values({ goalId, ...data })
      .returning();

    await db
      .update(goals)
      .set({
        currentAmount: sql`${goals.currentAmount}::numeric + ${data.amount}::numeric`,
        updatedAt: new Date(),
      })
      .where(eq(goals.id, goalId));

    return contribution;
  },
};
