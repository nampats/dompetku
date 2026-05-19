import { eq, and } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { financialAccounts } from '../db/schema/index.js';
import { createError } from '../middleware/error.middleware.js';

export const accountService = {
  async list(userId: string) {
    return db
      .select()
      .from(financialAccounts)
      .where(eq(financialAccounts.userId, userId))
      .orderBy(financialAccounts.createdAt);
  },

  async getById(userId: string, id: string) {
    const [result] = await db
      .select()
      .from(financialAccounts)
      .where(and(eq(financialAccounts.id, id), eq(financialAccounts.userId, userId)));

    if (!result) throw createError('Akun tidak ditemukan.', 404, 'NOT_FOUND');
    return result;
  },

  async create(
    userId: string,
    data: {
      name: string;
      type: 'bank' | 'e_wallet' | 'cash' | 'investment';
      bankCode?: string;
      maskedAccountNumber?: string;
      initialBalance?: string;
      icon?: string;
      color?: string;
    }
  ) {
    const [result] = await db
      .insert(financialAccounts)
      .values({
        userId,
        name: data.name,
        type: data.type,
        bankCode: data.bankCode,
        maskedAccountNumber: data.maskedAccountNumber,
        initialBalance: data.initialBalance ?? '0',
        currentBalance: data.initialBalance ?? '0',
        icon: data.icon,
        color: data.color,
      })
      .returning();

    return result;
  },

  async update(
    userId: string,
    id: string,
    data: Partial<{
      name: string;
      type: 'bank' | 'e_wallet' | 'cash' | 'investment';
      bankCode: string;
      maskedAccountNumber: string;
      icon: string;
      color: string;
      isActive: boolean;
    }>
  ) {
    await this.getById(userId, id); // ensure exists

    const [result] = await db
      .update(financialAccounts)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(financialAccounts.id, id), eq(financialAccounts.userId, userId)))
      .returning();

    return result;
  },

  async remove(userId: string, id: string) {
    await this.getById(userId, id);
    await db
      .delete(financialAccounts)
      .where(and(eq(financialAccounts.id, id), eq(financialAccounts.userId, userId)));
  },
};
