import { eq } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { userSettings } from '../db/schema/index.js';
export const settingsService = {
    async get(userId) {
        let [result] = await db
            .select()
            .from(userSettings)
            .where(eq(userSettings.userId, userId));
        // Auto-create default settings if none exist
        if (!result) {
            [result] = await db
                .insert(userSettings)
                .values({ userId })
                .returning();
        }
        return result;
    },
    async update(userId, data) {
        await this.get(userId); // Ensure record exists
        const [result] = await db
            .update(userSettings)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(userSettings.userId, userId))
            .returning();
        return result;
    },
};
//# sourceMappingURL=settings.service.js.map