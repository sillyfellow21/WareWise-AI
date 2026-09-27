import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

export const requestId: RequestHandler = (request, response, next) => {
  const id = request.header('x-request-id') ?? `req_${randomUUID()}`;
  response.setHeader('x-request-id', id);
  response.locals.requestId = id;
  next();
};
