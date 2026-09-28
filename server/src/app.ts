import type { RequestHandler } from 'express';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestId } from './middleware/requestId.js';
import { accessLog } from './middleware/accessLog.js';
import { rateLimit } from './middleware/rateLimit.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { usersRouter } from './modules/users/users.routes.js';
import { productsRouter } from './modules/products/products.routes.js';
import { assetsRouter } from './modules/assets/assets.routes.js';
import { predictMonthly } from './modules/predictions/predictions.controller.js';

export const app = express();

// Render's router is the only peer; trust one hop so `request.ip` (and the
// rate limiter) resolve to the real client instead of the proxy address.
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());
// Avatars are loaded cross-origin via <img>; without a permissive resource
// policy the browser would block them even though the API answers 200.
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(requestId);
app.use(accessLog);
app.use(rateLimit);

const startedAt = Date.now();

const liveness: RequestHandler = (_request, response) => {
  response.json({ data: { status: 'ok' } });
};

app.get('/health', liveness);
// Render health check target (`healthCheckPath` in render.yaml). Answers 200 so new
// instances only receive traffic once they are serving requests.
app.get('/api/health', liveness);

app.get('/ready', (_request, response) => {
  const checks = {
    database: Boolean(env.databaseUrl),
    redis: Boolean(env.redisUrl),
  };
  const ready = Object.values(checks).every(Boolean);
  response.status(ready ? 200 : 503).json({ data: { status: ready ? 'ready' : 'not_ready', checks } });
});

app.get('/api/v1/health', liveness);

// Legacy-compatible application routes — paths the React client calls
// verbatim (auth, users, products, avatars, monthly predictions).
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/assets', assetsRouter);
app.get('/predictMonthly', predictMonthly);

app.get('/metrics', (_request, response) => {
  response.type('text/plain').send(
    `warewise_process_uptime_seconds ${Math.floor((Date.now() - startedAt) / 1000)}\n`,
  );
});

app.use((_request, response) => {
  response.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found.',
      requestId: response.locals.requestId,
    },
  });
});

app.use(errorHandler);
