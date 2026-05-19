interface TransactionFilters {
    type?: 'income' | 'expense' | 'transfer';
    categoryId?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page: number;
    limit: number;
    offset: number;
}
export declare const transactionService: {
    list(userId: string, filters: TransactionFilters): Promise<{
        data: {
            id: string;
            type: "income" | "expense" | "transfer";
            amount: string;
            fee: string;
            description: string;
            note: string | null;
            date: string;
            categoryId: string | null;
            categoryName: string | null;
            categoryIcon: string | null;
            fromAccountId: string | null;
            toAccountId: string | null;
            createdAt: Date;
        }[];
        total: number;
    }>;
    getById(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        type: "income" | "expense" | "transfer";
        categoryId: string | null;
        fromAccountId: string | null;
        toAccountId: string | null;
        amount: string;
        fee: string;
        description: string;
        note: string | null;
        date: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(userId: string, data: {
        type: "income" | "expense" | "transfer";
        categoryId?: string;
        fromAccountId?: string;
        toAccountId?: string;
        amount: string;
        fee?: string;
        description: string;
        note?: string;
        date: string;
    }): Promise<{
        date: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: "income" | "expense" | "transfer";
        description: string;
        categoryId: string | null;
        fromAccountId: string | null;
        toAccountId: string | null;
        amount: string;
        fee: string;
        note: string | null;
    }>;
    update(userId: string, id: string, data: Partial<{
        type: "income" | "expense" | "transfer";
        categoryId: string;
        fromAccountId: string;
        toAccountId: string;
        amount: string;
        fee: string;
        description: string;
        note: string;
        date: string;
    }>): Promise<{
        id: string;
        userId: string;
        type: "income" | "expense" | "transfer";
        categoryId: string | null;
        fromAccountId: string | null;
        toAccountId: string | null;
        amount: string;
        fee: string;
        description: string;
        note: string | null;
        date: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(userId: string, id: string): Promise<void>;
};
export {};
