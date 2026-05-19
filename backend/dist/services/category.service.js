import { eq, and, or, isNull } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { categories } from '../db/schema/index.js';
import { createError } from '../middleware/error.middleware.js';
export const categoryService = {
    /** List system categories + user's custom ones */
    async list(userId) {
        return db
            .select()
            .from(categories)
            .where(or(eq(categories.isSystem, true), eq(categories.userId, userId), isNull(categories.userId)))
            .orderBy(categories.name);
    },
    async create(userId, data) {
        const [result] = await db
            .insert(categories)
            .values({ userId, ...data, isSystem: false })
            .returning();
        return result;
    },
    async remove(userId, id) {
        const [cat] = await db
            .select()
            .from(categories)
            .where(and(eq(categories.id, id), eq(categories.userId, userId)));
        if (!cat)
            throw createError('Kategori tidak ditemukan.', 404, 'NOT_FOUND');
        if (cat.isSystem)
            throw createError('Kategori sistem tidak bisa dihapus.', 403, 'FORBIDDEN');
        await db.delete(categories).where(eq(categories.id, id));
    },
};
//# sourceMappingURL=category.service.js.map