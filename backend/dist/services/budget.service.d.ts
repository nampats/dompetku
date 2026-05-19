export declare const budgetService: {
    list(userId: string, month?: number, year?: number): Promise<{
        id: string;
        categoryId: string;
        categoryName: string | null;
        categoryIcon: string | null;
        amount: string;
        period: "monthly" | "weekly" | "yearly";
        month: number;
        year: number;
    }[]>;
    upsert(userId: string, data: {
        categoryId: string;
        amount: string;
        period?: "monthly" | "weekly" | "yearly";
        month: number;
        year: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        categoryId: string;
        amount: string;
        period: "monthly" | "weekly" | "yearly";
        month: number;
        year: number;
    }>;
    remove(userId: string, id: string): Promise<void>;
};
