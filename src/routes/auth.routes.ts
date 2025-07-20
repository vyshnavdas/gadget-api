// src/routes/auth.routes.ts
import { Router } from 'express';
import dotenv from 'dotenv';
import { checkJsonContentType } from '../middleware/auth.middleware';
import { signup, login, loginRateLimiter, signupRateLimiter } from '../controllers/auth.controller';

dotenv.config();

const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: email@email.com
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */

router.post('/signup', checkJsonContentType, signupRateLimiter, signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user and get a JWT token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: email@email.com
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Login failed
 */
router.post('/login', checkJsonContentType, loginRateLimiter, login);

export default router;
