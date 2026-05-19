import { pgTable, uuid, text, varchar, boolean, timestamp, pgEnum, } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.js';
export const categoryTypeEnum = pgEnum('category_type', [
    'income',
    'expense',
    'both',
]);
export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 50 }).notNull(),
    type: categoryTypeEnum('type').notNull(),
    icon: varchar('icon', { length: 50 }),
    color: varchar('color', { length: 7 }),
    isSystem: boolean('is_system').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
export const categoriesRelations = relations(categories, ({ one }) => ({
    user: one(user, {
        fields: [categories.userId],
        references: [user.id],
    }),
}));
//# sourceMappingURL=categories.js.map