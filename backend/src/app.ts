import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './lib/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import apiRouter from './routes/index.js';

const app = express();

// ── Security ──
app.use(helmet());

// ── CORS ──
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';

// ── Auth Route (Must be before body parsers) ──
app.use('/api/auth', toNodeHandler(auth));

// ── Body Parsing ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes (non-auth) ──
app.use('/api', apiRouter);

// ── Global Error Handler ──
app.use(errorHandler);

export default app;
