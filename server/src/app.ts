import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestId } from './middleware/requestId.js';
import { accessLog } from './middleware/accessLog.js';
import { rateLimit } from './middleware/rateLimit.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(requestId);
app.use(accessLog);
app.use(rateLimit);

const startedAt = Date.now();

app.get('/health', (_request, response) => {
  response.json({ data: { status: 'ok' } });
});

app.get('/ready', (_request, response) => {
  const checks = {
    database: Boolean(env.databaseUrl),
    redis: Boolean(env.redisUrl),
  };
  const ready = Object.values(checks).every(Boolean);
  response.status(ready ? 200 : 503).json({ data: { status: ready ? 'ready' : 'not_ready', checks } });
});

app.get('/api/v1/health', (_request, response) => {
  response.json({ data: { status: 'ok' } });
});

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
