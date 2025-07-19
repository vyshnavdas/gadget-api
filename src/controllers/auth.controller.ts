import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import rateLimit from 'express-rate-limit';

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({
      message: 'User created',
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(401).json({
      message: 'Signup failed: Invalid or missing fields',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: '1h'
    });

    res.json({ token, expiresIn: '1h' });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
    console.error('Login error:', err);
  }
};

export const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // max 5 attempts
  message: { message: 'Too many login attempts. Please try again after 5 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
