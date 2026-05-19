/**
 * Standardized API response helpers.
 */
export function success(data, meta) {
    return { success: true, data, meta };
}
export function paginated(data, total, page, limit) {
    return {
        success: true,
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}
export function error(code, message, details) {
    return {
        success: false,
        error: { code, message, details },
    };
}
//# sourceMappingURL=api-response.js.map