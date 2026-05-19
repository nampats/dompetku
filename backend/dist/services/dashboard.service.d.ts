export declare const dashboardService: {
    /** Aggregate total wealth from all accounts + portfolio */
    getSummary(userId: string): Promise<{
        totalAccountBalance: string;
        totalPortfolioValue: string;
        totalUtang: string;
        totalPiutang: string;
        netPosition: string;
        goalsTotalTarget: string;
        goalsTotalSaved: string;
    }>;
    /** Monthly cashflow data for chart */
    getCashflow(userId: string, year: number): Promise<{
        month: number;
        type: "income" | "expense" | "transfer";
        total: string;
        totalFees: string;
    }[]>;
    /** Top expense categories for current month */
    getTopExpenses(userId: string, month: number, year: number): Promise<{
        categoryId: string | null;
        categoryName: string | null;
        categoryIcon: string | null;
        categoryColor: string | null;
        total: string;
    }[]>;
};
