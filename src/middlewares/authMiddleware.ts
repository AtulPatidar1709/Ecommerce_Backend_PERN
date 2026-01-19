import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { config } from '../config/config';
import { isJwtPayload } from '../types/isJwtPayload';

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: { id: string; email?: string; role: string };
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.signedCookies?.refreshToken;

    if (!token) {
      throw new AppError('Not logged in', 401);
    }

    const decoded = jwt.verify(token, config.jwtRefreshSecret!) as unknown;

    // Use type guard
    if (!isJwtPayload(decoded)) {
      throw new AppError('Invalid token payload', 401);
    }

    req.user = { id: decoded.sub, role: decoded.role };

    next();
  } catch (err: unknown) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid token', 401));
    }
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError('Token expired', 401));
    }
    next(err);
  }
};
