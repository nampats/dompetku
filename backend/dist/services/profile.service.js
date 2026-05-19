import { eq } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { user } from '../db/schema/index.js';
import { createError } from '../middleware/error.middleware.js';
export const profileService = {
    async get(userId) {
        const [result] = await db.select().from(user).where(eq(user.id, userId));
        if (!result)
            throw createError('Pengguna tidak ditemukan.', 404, 'NOT_FOUND');
        return result;
    },
    async update(userId, data) {
        const [result] = await db
            .update(user)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(user.id, userId))
            .returning();
        return result;
    },
};
//# sourceMappingURL=profile.service.js.map