/**
 * Extract pagination params from request query.
 * Defaults: page=1, limit=20, max limit=100
 */
export function getPagination(req) {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;
    return { page, limit, offset };
}
//# sourceMappingURL=pagination.js.map