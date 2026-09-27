import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestId } from './middleware/requestId.js';

export const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(requestId);

app.get('/health', (_request, response) => {
  response.json({ data: { status: 'ok' } });
});

app.get('/ready', (_request, response) => {
  response.json({ data: { status: 'ready' } });
});

app.get('/api/v1/health', (_request, response) => {
  response.json({ data: { status: 'ok' } });
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
