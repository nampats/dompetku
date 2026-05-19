import { eq, sql, and } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { financialAccounts, transactions, debts, goals, portfolioHoldings, } from '../db/schema/index.js';
export const dashboardService = {
    /** Aggregate total wealth from all accounts + portfolio */
    async getSummary(userId) {
        const [accountTotals] = await db
            .select({
            totalBalance: sql `COALESCE(SUM(${financialAccounts.currentBalance}::numeric), 0)`,
        })
            .from(financialAccounts)
            .where(and(eq(financialAccounts.userId, userId), eq(financialAccounts.isActive, true)));
        const [portfolioTotals] = await db
            .select({
            totalValue: sql `COALESCE(SUM(${portfolioHoldings.currentPrice}::numeric * ${portfolioHoldings.lot} * 100), 0)`,
        })
            .from(portfolioHoldings)
            .where(eq(portfolioHoldings.userId, userId));
        const [debtSummary] = await db
            .select({
            totalUtang: sql `COALESCE(SUM(CASE WHEN ${debts.type} = 'utang' THEN (${debts.totalAmount}::numeric - ${debts.paidAmount}::numeric) ELSE 0 END), 0)`,
            totalPiutang: sql `COALESCE(SUM(CASE WHEN ${debts.type} = 'piutang' THEN (${debts.totalAmount}::numeric - ${debts.paidAmount}::numeric) ELSE 0 END), 0)`,
        })
            .from(debts)
            .where(and(eq(debts.userId, userId), eq(debts.status, 'active')));
        const [goalsSummary] = await db
            .select({
            totalTarget: sql `COALESCE(SUM(${goals.targetAmount}::numeric), 0)`,
            totalSaved: sql `COALESCE(SUM(${goals.currentAmount}::numeric), 0)`,
        })
            .from(goals)
            .where(eq(goals.userId, userId));
        return {
            totalAccountBalance: accountTotals.totalBalance,
            totalPortfolioValue: portfolioTotals.totalValue,
            totalUtang: debtSummary.totalUtang,
            totalPiutang: debtSummary.totalPiutang,
            netPosition: String(parseFloat(debtSummary.totalPiutang) - parseFloat(debtSummary.totalUtang)),
            goalsTotalTarget: goalsSummary.totalTarget,
            goalsTotalSaved: goalsSummary.totalSaved,
        };
    },
    /** Monthly cashflow data for chart */
    async getCashflow(userId, year) {
        const rows = await db
            .select({
            month: sql `EXTRACT(MONTH FROM ${transactions.date}::date)`,
            type: transactions.type,
            total: sql `SUM(${transactions.amount}::numeric)`,
            totalFees: sql `SUM(${transactions.fee}::numeric)`,
        })
            .from(transactions)
            .where(and(eq(transactions.userId, userId), sql `EXTRACT(YEAR FROM ${transactions.date}::date) = ${year}`))
            .groupBy(sql `EXTRACT(MONTH FROM ${transactions.date}::date)`, transactions.type);
        return rows;
    },
    /** Top expense categories for current month */
    async getTopExpenses(userId, month, year) {
        const { categories } = await import('../db/schema/index.js');
        const rows = await db
            .select({
            categoryId: transactions.categoryId,
            categoryName: categories.name,
            categoryIcon: categories.icon,
            categoryColor: categories.color,
            total: sql `SUM(${transactions.amount}::numeric + ${transactions.fee}::numeric)`,
        })
            .from(transactions)
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(and(eq(transactions.userId, userId), eq(transactions.type, 'expense'), sql `EXTRACT(MONTH FROM ${transactions.date}::date) = ${month}`, sql `EXTRACT(YEAR FROM ${transactions.date}::date) = ${year}`))
            .groupBy(transactions.categoryId, categories.name, categories.icon, categories.color)
            .orderBy(sql `SUM(${transactions.amount}::numeric) DESC`)
            .limit(5);
        return rows;
    },
};
//# sourceMappingURL=dashboard.service.js.map