import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export const generateAccessToken = (user: { id: string; role: string }) =>
  jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret!, {
    expiresIn: '15m',
  });

export const generateRefreshToken = (user: { id: string; role: string }) =>
  jwt.sign({ sub: user.id }, config.jwtRefreshSecret!, { expiresIn: '7d' });
