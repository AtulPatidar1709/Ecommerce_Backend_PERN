import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/AppError';
import { config } from '../../config/config';
import { isJwtPayload } from '../../types/isJwtPayload';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.signedCookies?.accessToken;

    console.log('Toke is here ', token);

    if (!token) {
      throw new AppError('Not logged in', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret!) as unknown;

    console.log('decoded is here ', decoded);

    // Use type guard
    if (!isJwtPayload(decoded)) {
      throw new AppError('Invalid token payload', 401);
    }

    req.user = { id: decoded.sub, email: decoded.email, role: decoded.role };

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
