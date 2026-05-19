import { pgTable, uuid, text, varchar, numeric, date, timestamp, pgEnum, } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.js';
import { categories } from './categories.js';
import { financialAccounts } from './financial-accounts.js';
export const transactionTypeEnum = pgEnum('transaction_type', [
    'income',
    'expense',
    'transfer',
]);
export const transactions = pgTable('transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    type: transactionTypeEnum('type').notNull(),
    categoryId: uuid('category_id').references(() => categories.id, {
        onDelete: 'set null',
    }),
    fromAccountId: uuid('from_account_id').references(() => financialAccounts.id, { onDelete: 'set null' }),
    toAccountId: uuid('to_account_id').references(() => financialAccounts.id, {
        onDelete: 'set null',
    }),
    amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
    fee: numeric('fee', { precision: 15, scale: 2 }).notNull().default('0'),
    description: varchar('description', { length: 255 }).notNull(),
    note: text('note'),
    date: date('date').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export const transactionsRelations = relations(transactions, ({ one }) => ({
    user: one(user, {
        fields: [transactions.userId],
        references: [user.id],
    }),
    category: one(categories, {
        fields: [transactions.categoryId],
        references: [categories.id],
    }),
    fromAccount: one(financialAccounts, {
        fields: [transactions.fromAccountId],
        references: [financialAccounts.id],
        relationName: 'fromAccount',
    }),
    toAccount: one(financialAccounts, {
        fields: [transactions.toAccountId],
        references: [financialAccounts.id],
        relationName: 'toAccount',
    }),
}));
//# sourceMappingURL=transactions.js.map