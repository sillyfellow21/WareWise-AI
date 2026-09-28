import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Bearer-token check compatible with the legacy middleware: the token is
 * optional "Bearer " wrapping (raw tokens also pass) and the payload is
 * `{ id }`. Failures keep the legacy status/body because the client ignores
 * them and relies on the Redux token instead.
 */
const jwtSecret = (): string => process.env.JWT_ACCESS_SECRET ?? 'warewise-dev-secret';

export const signToken = (userId: string): string => jwt.sign({ id: userId }, jwtSecret());

export const verifyToken: RequestHandler = (request, response, next) => {
  try {
    let token = request.header('Authorization');
    if (!token) {
      response.status(403).send('Access Denied');
      return;
    }
    if (token.startsWith('Bearer')) {
      token = token.slice(7).trim();
    }
    const verified = jwt.verify(token, jwtSecret()) as { id?: string };
    if (!verified.id) {
      response.status(403).send('Access Denied');
      return;
    }
    response.locals.userId = verified.id;
    next();
  } catch (error) {
    response.status(500).json({ error: (error as Error).message });
  }
};
