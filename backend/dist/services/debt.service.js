import { eq, and, sql } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { debts, debtPayments } from '../db/schema/index.js';
import { createError } from '../middleware/error.middleware.js';
export const debtService = {
    async list(userId, type, status) {
        const conditions = [eq(debts.userId, userId)];
        if (type)
            conditions.push(eq(debts.type, type));
        if (status)
            conditions.push(eq(debts.status, status));
        return db.select().from(debts).where(and(...conditions)).orderBy(debts.createdAt);
    },
    async getById(userId, id) {
        const [result] = await db
            .select()
            .from(debts)
            .where(and(eq(debts.id, id), eq(debts.userId, userId)));
        if (!result)
            throw createError('Catatan hutang/piutang tidak ditemukan.', 404, 'NOT_FOUND');
        return result;
    },
    async create(userId, data) {
        const [result] = await db
            .insert(debts)
            .values({ userId, ...data })
            .returning();
        return result;
    },
    async update(userId, id, data) {
        await this.getById(userId, id);
        const [result] = await db
            .update(debts)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(debts.id, id), eq(debts.userId, userId)))
            .returning();
        return result;
    },
    async remove(userId, id) {
        await this.getById(userId, id);
        await db.delete(debts).where(eq(debts.id, id));
    },
    async addPayment(userId, debtId, data) {
        const debt = await this.getById(userId, debtId);
        const [payment] = await db
            .insert(debtPayments)
            .values({ debtId, ...data })
            .returning();
        // Update paid amount on the debt record
        await db
            .update(debts)
            .set({
            paidAmount: sql `${debts.paidAmount}::numeric + ${data.amount}::numeric`,
            updatedAt: new Date(),
        })
            .where(eq(debts.id, debtId));
        return payment;
    },
    async listPayments(userId, debtId) {
        await this.getById(userId, debtId);
        return db
            .select()
            .from(debtPayments)
            .where(eq(debtPayments.debtId, debtId))
            .orderBy(debtPayments.paidAt);
    },
};
//# sourceMappingURL=debt.service.js.map