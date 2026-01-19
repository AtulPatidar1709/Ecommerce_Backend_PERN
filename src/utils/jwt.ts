import jwt from 'jsonwebtoken';

export const generateAccessToken = (user: any) =>
  jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });

export const generateRefreshToken = (user: any) =>
  jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
