export declare const portfolioService: {
    list(userId: string): Promise<{
        id: string;
        userId: string;
        ticker: string;
        name: string;
        sector: string | null;
        avgBuyPrice: string;
        currentPrice: string;
        lot: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getById(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        ticker: string;
        name: string;
        sector: string | null;
        avgBuyPrice: string;
        currentPrice: string;
        lot: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(userId: string, data: {
        ticker: string;
        name: string;
        sector?: string;
        avgBuyPrice: string;
        currentPrice: string;
        lot: number;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        ticker: string;
        sector: string | null;
        avgBuyPrice: string;
        currentPrice: string;
        lot: number;
    }>;
    update(userId: string, id: string, data: Partial<{
        ticker: string;
        name: string;
        sector: string;
        avgBuyPrice: string;
        currentPrice: string;
        lot: number;
    }>): Promise<{
        id: string;
        userId: string;
        ticker: string;
        name: string;
        sector: string | null;
        avgBuyPrice: string;
        currentPrice: string;
        lot: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(userId: string, id: string): Promise<void>;
};
