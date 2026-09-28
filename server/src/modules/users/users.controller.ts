import type { RequestHandler } from 'express';
import { getPrisma } from '../../db/client.js';
import { serializeUser } from '../../lib/serialize.js';

/** Fields the client may patch; secrets (`password`, `securityAnswer`) never. */
const updatableFields = [
  'firstName',
  'lastName',
  'email',
  'location',
  'role',
  'employeeId',
  'supplierId',
  'securityQuestion',
  'picturePath',
] as const;

export const getUser: RequestHandler = async (request, response) => {
  try {
    const user = await getPrisma().user.findUnique({ where: { id: String(request.params.id) } });
    if (!user) {
      response.status(404).json({ message: 'User not found' });
      return;
    }
    response.status(200).json(serializeUser(user));
  } catch (error) {
    response.status(403).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

/**
 * Mirrors the legacy `Object.assign(user, updates)` behaviour (the client
 * round-trips the whole serialized user) but through a field allowlist so
 * `password`/`securityAnswer` cannot be overwritten from the browser.
 */
export const updateUserDetails: RequestHandler = async (request, response) => {
  try {
    const body = request.body as Record<string, unknown>;
    const data: Record<string, string> = {};
    for (const field of updatableFields) {
      const value = body[field];
      if (typeof value === 'string') {
        data[field] = value;
      }
    }
    if (body.phoneNumber !== undefined && body.phoneNumber !== null) {
      data.phoneNumber = String(body.phoneNumber);
    }
    const existing = await getPrisma().user.findUnique({ where: { id: String(request.params.id) } });
    if (!existing) {
      response.status(404).json({ message: 'User not found' });
      return;
    }
    const user = await getPrisma().user.update({ where: { id: existing.id }, data });
    response.status(200).json({ message: 'User details updated successfully', user: serializeUser(user) });
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
};
