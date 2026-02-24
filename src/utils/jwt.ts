import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { userType } from '../auth/auth.schema.js';

export const generateAccessToken = (user: userType) =>
  jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    config.jwtSecret!,
    {
      expiresIn: '15m',
    },
  );

export const generateRefreshToken = (user: { id: string; role: string }) =>
  jwt.sign({ sub: user.id }, config.jwtRefreshSecret!, { expiresIn: '7d' });
