export declare const accountService: {
    list(userId: string): Promise<{
        id: string;
        userId: string;
        name: string;
        type: "bank" | "e_wallet" | "cash" | "investment";
        bankCode: string | null;
        maskedAccountNumber: string | null;
        currentBalance: string;
        initialBalance: string;
        icon: string | null;
        color: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getById(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        name: string;
        type: "bank" | "e_wallet" | "cash" | "investment";
        bankCode: string | null;
        maskedAccountNumber: string | null;
        currentBalance: string;
        initialBalance: string;
        icon: string | null;
        color: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(userId: string, data: {
        name: string;
        type: "bank" | "e_wallet" | "cash" | "investment";
        bankCode?: string;
        maskedAccountNumber?: string;
        initialBalance?: string;
        icon?: string;
        color?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: "bank" | "e_wallet" | "cash" | "investment";
        bankCode: string | null;
        maskedAccountNumber: string | null;
        currentBalance: string;
        initialBalance: string;
        icon: string | null;
        color: string | null;
        isActive: boolean;
    }>;
    update(userId: string, id: string, data: Partial<{
        name: string;
        type: "bank" | "e_wallet" | "cash" | "investment";
        bankCode: string;
        maskedAccountNumber: string;
        icon: string;
        color: string;
        isActive: boolean;
    }>): Promise<{
        id: string;
        userId: string;
        name: string;
        type: "bank" | "e_wallet" | "cash" | "investment";
        bankCode: string | null;
        maskedAccountNumber: string | null;
        currentBalance: string;
        initialBalance: string;
        icon: string | null;
        color: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(userId: string, id: string): Promise<void>;
};
