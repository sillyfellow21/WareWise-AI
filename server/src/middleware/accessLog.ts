import type { RequestHandler } from 'express';

export const accessLog: RequestHandler = (request, response, next) => {
  const startedAt = performance.now();
  response.on('finish', () => {
    console.log(
      JSON.stringify({
        requestId: response.locals.requestId,
        method: request.method,
        path: request.path,
        status: response.statusCode,
        duration: Math.round(performance.now() - startedAt),
      }),
    );
  });
  next();
};