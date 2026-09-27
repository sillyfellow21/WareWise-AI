import type { RequestHandler } from 'express';

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const windowMs = 60_000;
const maxRequests = 120;

export const rateLimit: RequestHandler = (request, response, next) => {
  const now = Date.now();
  const key = request.ip ?? 'unknown';
  const current = buckets.get(key);
  const bucket = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + windowMs }
    : current;

  bucket.count += 1;
  buckets.set(key, bucket);
  response.setHeader('x-ratelimit-limit', maxRequests);
  response.setHeader('x-ratelimit-remaining', Math.max(maxRequests - bucket.count, 0));

  if (bucket.count > maxRequests) {
    response.status(429).json({
      error: {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Try again later.',
        requestId: response.locals.requestId,
      },
    });
    return;
  }

  next();
};