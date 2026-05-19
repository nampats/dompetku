import { eq, and, desc, ilike, sql, count } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { transactions, categories, financialAccounts } from '../db/schema/index.js';
import { createError } from '../middleware/error.middleware.js';
export const transactionService = {
    async list(userId, filters) {
        const conditions = [eq(transactions.userId, userId)];
        if (filters.type) {
            conditions.push(eq(transactions.type, filters.type));
        }
        if (filters.categoryId) {
            conditions.push(eq(transactions.categoryId, filters.categoryId));
        }
        if (filters.search) {
            conditions.push(ilike(transactions.description, `%${filters.search}%`));
        }
        if (filters.startDate) {
            conditions.push(sql `${transactions.date} >= ${filters.startDate}`);
        }
        if (filters.endDate) {
            conditions.push(sql `${transactions.date} <= ${filters.endDate}`);
        }
        const whereClause = and(...conditions);
        const [data, [{ total }]] = await Promise.all([
            db
                .select({
                id: transactions.id,
                type: transactions.type,
                amount: transactions.amount,
                fee: transactions.fee,
                description: transactions.description,
                note: transactions.note,
                date: transactions.date,
                categoryId: transactions.categoryId,
                categoryName: categories.name,
                categoryIcon: categories.icon,
                fromAccountId: transactions.fromAccountId,
                toAccountId: transactions.toAccountId,
                createdAt: transactions.createdAt,
            })
                .from(transactions)
                .leftJoin(categories, eq(transactions.categoryId, categories.id))
                .where(whereClause)
                .orderBy(desc(transactions.date))
                .limit(filters.limit)
                .offset(filters.offset),
            db
                .select({ total: count() })
                .from(transactions)
                .where(whereClause),
        ]);
        return { data, total };
    },
    async getById(userId, id) {
        const [result] = await db
            .select()
            .from(transactions)
            .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
        if (!result)
            throw createError('Transaksi tidak ditemukan.', 404, 'NOT_FOUND');
        return result;
    },
    async create(userId, data) {
        const [result] = await db
            .insert(transactions)
            .values({
            userId,
            type: data.type,
            categoryId: data.categoryId,
            fromAccountId: data.fromAccountId,
            toAccountId: data.toAccountId,
            amount: data.amount,
            fee: data.fee ?? '0',
            description: data.description,
            note: data.note,
            date: data.date,
        })
            .returning();
        // Update account balances
        if (data.fromAccountId) {
            const totalDeduction = parseFloat(data.amount) + parseFloat(data.fee ?? '0');
            await db
                .update(financialAccounts)
                .set({
                currentBalance: sql `${financialAccounts.currentBalance}::numeric - ${totalDeduction.toString()}::numeric`,
                updatedAt: new Date(),
            })
                .where(eq(financialAccounts.id, data.fromAccountId));
        }
        if (data.toAccountId && data.type !== 'expense') {
            await db
                .update(financialAccounts)
                .set({
                currentBalance: sql `${financialAccounts.currentBalance}::numeric + ${data.amount}::numeric`,
                updatedAt: new Date(),
            })
                .where(eq(financialAccounts.id, data.toAccountId));
        }
        return result;
    },
    async update(userId, id, data) {
        await this.getById(userId, id);
        const [result] = await db
            .update(transactions)
            .set({ ...data, updatedAt: new Date() })
            .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
            .returning();
        return result;
    },
    async remove(userId, id) {
        await this.getById(userId, id);
        await db
            .delete(transactions)
            .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    },
};
//# sourceMappingURL=transaction.service.js.map