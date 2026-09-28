import { Router } from 'express';
import { getUser, updateUserDetails } from './users.controller.js';
import { verifyToken } from '../../middleware/verifyToken.js';

export const usersRouter = Router();

usersRouter.get('/:id', verifyToken, getUser);
usersRouter.patch('/:id', verifyToken, updateUserDetails);
