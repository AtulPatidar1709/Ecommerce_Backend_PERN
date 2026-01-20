import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export const generateAccessToken = (user: any) =>
  jwt.sign({ sub: user.id, role: user.role }, config.jwtSecret!, {
    expiresIn: '15m',
  });

export const generateRefreshToken = (user: any) =>
  jwt.sign({ sub: user.id }, config.jwtRefreshSecret!, { expiresIn: '7d' });
