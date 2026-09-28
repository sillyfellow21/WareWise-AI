import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { getPrisma } from '../../db/client.js';
import { serializeUser } from '../../lib/serialize.js';
import { signToken } from '../../middleware/verifyToken.js';

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

/**
 * Legacy-compatible auth endpoints (the React client's Form.jsx calls these
 * paths and reads `{ token, user }`, `{ success, securityQuestion }` and
 * `{ success, message }` responses verbatim).
 */

export const register: RequestHandler = async (request, response) => {
  try {
    const body = request.body as Record<string, unknown>;
    const firstName = asString(body.firstName);
    const lastName = asString(body.lastName);
    const email = asString(body.email);
    const password = asString(body.password);
    const securityQuestion = asString(body.securityQuestion);
    const securityAnswer = asString(body.securityAnswer);
    if (!firstName || !lastName || !email || !password || !securityQuestion || !securityAnswer) {
      response.status(400).json({
        error: 'firstName, lastName, email, password, securityQuestion and securityAnswer are required',
      });
      return;
    }
    const salt = await bcrypt.genSalt();
    const [passwordHash, securityAnswerHash] = await Promise.all([
      bcrypt.hash(password, salt),
      bcrypt.hash(securityAnswer, salt),
    ]);
    const file = request.file;
    const picturePath = asString(body.picturePath) || file?.originalname || '';
    const pictureData = file
      ? `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
      : null;
    const created = await getPrisma().user.create({
      data: {
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath,
        pictureData,
        role: asString(body.role) || null,
        location: asString(body.location) || null,
        employeeId: asString(body.employeeId) || null,
        supplierId: asString(body.supplierId) || null,
        phoneNumber: asString(body.phoneNumber) || null,
        securityQuestion,
        securityAnswer: securityAnswerHash,
      },
    });
    response.status(201).json(serializeUser(created));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      response.status(409).json({ error: 'An account with this email already exists' });
      return;
    }
    response.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
};

export const login: RequestHandler = async (request, response) => {
  try {
    const body = request.body as { email?: unknown; password?: unknown };
    const user = await getPrisma().user.findUnique({ where: { email: asString(body.email) } });
    if (!user) {
      response.status(400).json({ msg: 'User does not exsist ' });
      return;
    }
    const isMatch = await bcrypt.compare(asString(body.password), user.password);
    if (!isMatch) {
      response.status(400).json({ msg: 'Invalid Password' });
      return;
    }
    response.status(200).json({ token: signToken(user.id), user: serializeUser(user) });
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
};

export const verifyEmail: RequestHandler = async (request, response) => {
  try {
    const body = request.body as { email?: unknown };
    const user = await getPrisma().user.findUnique({ where: { email: asString(body.email) } });
    if (!user) {
      response.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    response.status(200).json({ success: true, securityQuestion: user.securityQuestion });
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    response.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const resetPasswordSecurity: RequestHandler = async (request, response) => {
  const body = request.body as { email?: unknown; securityAnswer?: unknown; password?: unknown };
  if (!body.email || !body.securityAnswer || !body.password) {
    response.status(400).json({
      message: 'Email, security answer, and new password are required',
    });
    return;
  }
  try {
    const user = await getPrisma().user.findUnique({ where: { email: asString(body.email) } });
    if (!user) {
      response.status(404).json({ message: 'User not found' });
      return;
    }
    const isMatch = await bcrypt.compare(asString(body.securityAnswer), user.securityAnswer);
    if (!isMatch) {
      response.status(400).json({ message: 'Incorrect security answer' });
      return;
    }
    const passwordHash = await bcrypt.hash(asString(body.password), 10);
    await getPrisma().user.update({ where: { id: user.id }, data: { password: passwordHash } });
    response.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in resetPasswordSecurity:', error);
    response.status(500).json({ success: false, message: 'Internal server error' });
  }
};
