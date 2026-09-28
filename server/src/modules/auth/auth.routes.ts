import { Router } from 'express';
import multer from 'multer';
import {
  login,
  register,
  resetPasswordSecurity,
  verifyEmail,
} from './auth.controller.js';

// Registration uploads the avatar in memory: Render's filesystem is ephemeral,
// so the bytes are stored as a data URI on the user row instead of on disk.
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

export const authRouter = Router();

authRouter.post('/register', upload.single('picture'), register);
authRouter.post('/login', login);
authRouter.post('/verify-email', verifyEmail);
authRouter.post('/reset-password-security', resetPasswordSecurity);
