import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { categories } from './schema/index.js';
/**
 * Seed script — populates default system categories.
 * Run: npm run db:seed
 */
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);
const systemCategories = [
    { name: 'Makanan & Minuman', type: 'expense', icon: 'restaurant', color: '#FF6B6B', isSystem: true },
    { name: 'Transportasi', type: 'expense', icon: 'commute', color: '#4ECDC4', isSystem: true },
    { name: 'Tagihan & Listrik', type: 'expense', icon: 'lightbulb', color: '#45B7D1', isSystem: true },
    { name: 'Hiburan & Lifestyle', type: 'expense', icon: 'movie', color: '#F7DC6F', isSystem: true },
    { name: 'Belanja', type: 'expense', icon: 'shopping_bag', color: '#BB8FCE', isSystem: true },
    { name: 'Kesehatan', type: 'expense', icon: 'health_and_safety', color: '#82E0AA', isSystem: true },
    { name: 'Pendidikan', type: 'expense', icon: 'school', color: '#85C1E9', isSystem: true },
    { name: 'Kos / Rent', type: 'expense', icon: 'home', color: '#F0B27A', isSystem: true },
    { name: 'Gaji', type: 'income', icon: 'work', color: '#58D68D', isSystem: true },
    { name: 'Freelance', type: 'income', icon: 'computer', color: '#5DADE2', isSystem: true },
    { name: 'Deviden', type: 'income', icon: 'payments', color: '#AF7AC5', isSystem: true },
    { name: 'Investasi', type: 'both', icon: 'trending_up', color: '#F4D03F', isSystem: true },
    { name: 'Dompet Digital', type: 'both', icon: 'account_balance_wallet', color: '#48C9B0', isSystem: true },
    { name: 'Lainnya', type: 'both', icon: 'category', color: '#AAB7B8', isSystem: true },
];
async function seed() {
    console.log('🌱 Seeding system categories...');
    for (const cat of systemCategories) {
        await db
            .insert(categories)
            .values(cat)
            .onConflictDoNothing();
    }
    console.log(`✅ Seeded ${systemCategories.length} system categories.`);
    process.exit(0);
}
seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map