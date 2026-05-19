export declare const settingsService: {
    get(userId: string): Promise<{
        id: string;
        userId: string;
        currency: string;
        locale: string;
        googleSheetsApiKey: string | null;
        googleSheetsSpreadsheetId: string | null;
        googleSheetsEnabled: boolean;
        telegramBotToken: string | null;
        telegramChatId: string | null;
        telegramEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(userId: string, data: Partial<{
        currency: string;
        locale: string;
        googleSheetsApiKey: string;
        googleSheetsSpreadsheetId: string;
        googleSheetsEnabled: boolean;
        telegramBotToken: string;
        telegramChatId: string;
        telegramEnabled: boolean;
    }>): Promise<{
        id: string;
        userId: string;
        currency: string;
        locale: string;
        googleSheetsApiKey: string | null;
        googleSheetsSpreadsheetId: string | null;
        googleSheetsEnabled: boolean;
        telegramBotToken: string | null;
        telegramChatId: string | null;
        telegramEnabled: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
};
