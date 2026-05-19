import { pgTable, uuid, text, varchar, numeric, date, timestamp, } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.js';
export const goals = pgTable('goals', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 100 }).notNull(),
    description: varchar('description', { length: 255 }),
    icon: varchar('icon', { length: 50 }),
    targetAmount: numeric('target_amount', { precision: 15, scale: 2 }).notNull(),
    currentAmount: numeric('current_amount', { precision: 15, scale: 2 })
        .notNull()
        .default('0'),
    deadline: date('deadline'),
    color: varchar('color', { length: 7 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export const goalContributions = pgTable('goal_contributions', {
    id: uuid('id').primaryKey().defaultRandom(),
    goalId: uuid('goal_id')
        .notNull()
        .references(() => goals.id, { onDelete: 'cascade' }),
    amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
    contributedAt: date('contributed_at').notNull(),
    note: text('note'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
export const goalsRelations = relations(goals, ({ one, many }) => ({
    user: one(user, {
        fields: [goals.userId],
        references: [user.id],
    }),
    contributions: many(goalContributions),
}));
export const goalContributionsRelations = relations(goalContributions, ({ one }) => ({
    goal: one(goals, {
        fields: [goalContributions.goalId],
        references: [goals.id],
    }),
}));
//# sourceMappingURL=goals.js.map