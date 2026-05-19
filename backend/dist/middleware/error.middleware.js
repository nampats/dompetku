export function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode ?? 500;
    const code = err.code ?? 'INTERNAL_ERROR';
    console.error(`[ERROR] ${code}:`, err.message);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }
    res.status(statusCode).json({
        success: false,
        error: {
            code,
            message: err.message || 'Terjadi kesalahan internal.',
        },
    });
}
/**
 * Create a typed application error.
 */
export function createError(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    return error;
}
//# sourceMappingURL=error.middleware.js.map