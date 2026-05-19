import {
  pgTable,
  uuid,
  text,
  varchar,
  numeric,
  boolean,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.js';

export const accountTypeEnum = pgEnum('account_type', [
  'bank',
  'e_wallet',
  'cash',
  'investment',
]);

export const financialAccounts = pgTable('financial_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  type: accountTypeEnum('type').notNull(),
  bankCode: varchar('bank_code', { length: 10 }),
  maskedAccountNumber: varchar('masked_account_number', { length: 30 }),
  currentBalance: numeric('current_balance', { precision: 15, scale: 2 })
    .notNull()
    .default('0'),
  initialBalance: numeric('initial_balance', { precision: 15, scale: 2 })
    .notNull()
    .default('0'),
  icon: varchar('icon', { length: 50 }),
  color: varchar('color', { length: 7 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const financialAccountsRelations = relations(financialAccounts, ({ one }) => ({
  user: one(user, {
    fields: [financialAccounts.userId],
    references: [user.id],
  }),
}));
