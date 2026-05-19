import { ZodError } from 'zod';
/**
 * Validate request body, query, or params against a Zod schema.
 */
export function validate(schema, source = 'body') {
    return (req, res, next) => {
        try {
            const data = schema.parse(req[source]);
            // Replace with parsed (and coerced) data
            req[source] = data;
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const details = error.issues.map((e) => ({
                    field: String(e.path?.join?.('.') ?? ''),
                    message: String(e.message ?? 'Invalid'),
                }));
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Data tidak valid.',
                        details,
                    },
                });
                return;
            }
            next(error);
        }
    };
}
//# sourceMappingURL=validate.middleware.js.map