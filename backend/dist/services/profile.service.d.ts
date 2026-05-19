export declare const profileService: {
    get(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(userId: string, data: Partial<{
        name: string;
        image: string;
    }>): Promise<{
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
