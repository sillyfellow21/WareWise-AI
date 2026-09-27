import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  const requestId = response.locals.requestId;
  console.error(
    JSON.stringify({
      requestId,
      method: request.method,
      path: request.path,
      error: error instanceof Error ? error.message : 'Unknown error',
    }),
  );
  response.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
      requestId,
    },
  });
};
