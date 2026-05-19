import { eq, and, sql } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { goals, goalContributions } from '../db/schema/index.js';
import { createError } from '../middleware/error.middleware.js';
export const goalService = {
    async list(userId) {
        return db.select().from(goals).where(eq(goals.userId, userId)).orderBy(goals.createdAt);
    },
    async getById(userId, id) {
        const [result] = await db
            .select()
            .from(goals)
            .where(and(eq(goals.id, id), eq(goals.userId, userId)));
        if (!result)
            throw createError('Target dana tidak ditemukan.', 404, 'NOT_FOUND');
        return result;
    },
    async create(userId, data) {
        const [result] = await db
            .insert(goals)
            .values({ userId, ...data })
            .returning();
        return result;
    },
    async update(userId, id, data) {
        await this.getById(userId, id);
        const [result] = await db
            .update(goals)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(goals.id, id), eq(goals.userId, userId)))
            .returning();
        return result;
    },
    async remove(userId, id) {
        await this.getById(userId, id);
        await db.delete(goals).where(eq(goals.id, id));
    },
    async addContribution(userId, goalId, data) {
        await this.getById(userId, goalId);
        const [contribution] = await db
            .insert(goalContributions)
            .values({ goalId, ...data })
            .returning();
        await db
            .update(goals)
            .set({
            currentAmount: sql `${goals.currentAmount}::numeric + ${data.amount}::numeric`,
            updatedAt: new Date(),
        })
            .where(eq(goals.id, goalId));
        return contribution;
    },
};
//# sourceMappingURL=goal.service.js.map