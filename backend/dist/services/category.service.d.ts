export declare const categoryService: {
    /** List system categories + user's custom ones */
    list(userId: string): Promise<{
        id: string;
        userId: string | null;
        name: string;
        type: "income" | "expense" | "both";
        icon: string | null;
        color: string | null;
        isSystem: boolean;
        createdAt: Date;
    }[]>;
    create(userId: string, data: {
        name: string;
        type: "income" | "expense" | "both";
        icon?: string;
        color?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string | null;
        type: "income" | "expense" | "both";
        icon: string | null;
        color: string | null;
        isSystem: boolean;
    }>;
    remove(userId: string, id: string): Promise<void>;
};
