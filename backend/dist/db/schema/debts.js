import { pgTable, uuid, text, varchar, numeric, date, integer, timestamp, pgEnum, } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.js';
export const debtTypeEnum = pgEnum('debt_type', ['utang', 'piutang']);
export const debtStatusEnum = pgEnum('debt_status', [
    'active',
    'paid_off',
    'overdue',
    'cancelled',
]);
export const debts = pgTable('debts', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    type: debtTypeEnum('type').notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    counterparty: varchar('counterparty', { length: 100 }).notNull(),
    category: varchar('category', { length: 50 }),
    totalAmount: numeric('total_amount', { precision: 15, scale: 2 }).notNull(),
    paidAmount: numeric('paid_amount', { precision: 15, scale: 2 })
        .notNull()
        .default('0'),
    icon: varchar('icon', { length: 50 }),
    dueDate: date('due_date'),
    recurringDay: integer('recurring_day'),
    status: debtStatusEnum('status').notNull().default('active'),
    note: text('note'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export const debtPayments = pgTable('debt_payments', {
    id: uuid('id').primaryKey().defaultRandom(),
    debtId: uuid('debt_id')
        .notNull()
        .references(() => debts.id, { onDelete: 'cascade' }),
    amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
    paidAt: date('paid_at').notNull(),
    note: text('note'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
export const debtsRelations = relations(debts, ({ one, many }) => ({
    user: one(user, {
        fields: [debts.userId],
        references: [user.id],
    }),
    payments: many(debtPayments),
}));
export const debtPaymentsRelations = relations(debtPayments, ({ one }) => ({
    debt: one(debts, {
        fields: [debtPayments.debtId],
        references: [debts.id],
    }),
}));
//# sourceMappingURL=debts.js.map