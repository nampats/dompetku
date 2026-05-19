import { pgTable, uuid, text, varchar, boolean, timestamp, } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth.js';
export const userSettings = pgTable('user_settings', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
        .notNull()
        .unique()
        .references(() => user.id, { onDelete: 'cascade' }),
    currency: varchar('currency', { length: 5 }).notNull().default('IDR'),
    locale: varchar('locale', { length: 10 }).notNull().default('id-ID'),
    googleSheetsApiKey: text('google_sheets_api_key'),
    googleSheetsSpreadsheetId: varchar('google_sheets_spreadsheet_id', {
        length: 100,
    }),
    googleSheetsEnabled: boolean('google_sheets_enabled').notNull().default(false),
    telegramBotToken: text('telegram_bot_token'),
    telegramChatId: varchar('telegram_chat_id', { length: 50 }),
    telegramEnabled: boolean('telegram_enabled').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export const userSettingsRelations = relations(userSettings, ({ one }) => ({
    user: one(user, {
        fields: [userSettings.userId],
        references: [user.id],
    }),
}));
//# sourceMappingURL=settings.js.map