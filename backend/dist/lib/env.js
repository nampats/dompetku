import 'dotenv/config';
function getEnv(key, fallback) {
    const value = process.env[key] ?? fallback;
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}
export const env = {
    PORT: parseInt(getEnv('PORT', '3001'), 10),
    DATABASE_URL: getEnv('DATABASE_URL'),
    BETTER_AUTH_SECRET: getEnv('BETTER_AUTH_SECRET'),
    BETTER_AUTH_URL: getEnv('BETTER_AUTH_URL', 'http://localhost:3001'),
    FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:5173'),
    NODE_ENV: getEnv('NODE_ENV', 'development'),
};
//# sourceMappingURL=env.js.map