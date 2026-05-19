import {
  pgTable,
  uuid,
  text,
  varchar,
  numeric,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.js';

export const portfolioHoldings = pgTable('portfolio_holdings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  ticker: varchar('ticker', { length: 10 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  sector: varchar('sector', { length: 50 }),
  avgBuyPrice: numeric('avg_buy_price', { precision: 15, scale: 2 }).notNull(),
  currentPrice: numeric('current_price', { precision: 15, scale: 2 }).notNull(),
  lot: integer('lot').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const portfolioHoldingsRelations = relations(portfolioHoldings, ({ one }) => ({
  user: one(user, {
    fields: [portfolioHoldings.userId],
    references: [user.id],
  }),
}));
