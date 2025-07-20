// src/routes/auth.routes.ts
import { Router } from 'express';
import dotenv from 'dotenv';
import { checkJsonContentType } from '../middleware/auth.middleware';
import { signup, login, loginRateLimiter, signupRateLimiter } from '../controllers/auth.controller';

dotenv.config();

const router = Router();

router.post('/signup', checkJsonContentType, signupRateLimiter, signup);
router.post('/login', checkJsonContentType, loginRateLimiter, login);

export default router;
