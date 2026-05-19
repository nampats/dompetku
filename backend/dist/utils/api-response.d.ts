/**
 * Standardized API response helpers.
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    meta?: Record<string, unknown>;
    error?: {
        code: string;
        message: string;
        details?: unknown;
    };
}
export declare function success<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T>;
export declare function paginated<T>(data: T[], total: number, page: number, limit: number): ApiResponse<T[]>;
export declare function error(code: string, message: string, details?: unknown): ApiResponse;
