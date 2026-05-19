export declare const goalService: {
    list(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        description: string | null;
        icon: string | null;
        targetAmount: string;
        currentAmount: string;
        deadline: string | null;
        color: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getById(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        description: string | null;
        icon: string | null;
        targetAmount: string;
        currentAmount: string;
        deadline: string | null;
        color: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(userId: string, data: {
        title: string;
        description?: string;
        icon?: string;
        targetAmount: string;
        currentAmount?: string;
        deadline?: string;
        color?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        icon: string | null;
        color: string | null;
        description: string | null;
        title: string;
        targetAmount: string;
        currentAmount: string;
        deadline: string | null;
    }>;
    update(userId: string, id: string, data: Partial<{
        title: string;
        description: string;
        icon: string;
        targetAmount: string;
        deadline: string;
        color: string;
    }>): Promise<{
        id: string;
        userId: string;
        title: string;
        description: string | null;
        icon: string | null;
        targetAmount: string;
        currentAmount: string;
        deadline: string | null;
        color: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(userId: string, id: string): Promise<void>;
    addContribution(userId: string, goalId: string, data: {
        amount: string;
        contributedAt: string;
        note?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        amount: string;
        note: string | null;
        goalId: string;
        contributedAt: string;
    }>;
};
