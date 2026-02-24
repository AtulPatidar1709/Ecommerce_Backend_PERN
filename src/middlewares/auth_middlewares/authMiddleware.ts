import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../../utils/AppError.js';
import { config } from '../../config/config.js';
import { isJwtPayload } from '../../types/isJwtPayload.js';
import { AuthenticatedRequest } from "./types/AuthenticatedRequestTypes.js";

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.signedCookies?.accessToken;

    if (!token) {
      throw new AppError('Not logged in', 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret!) as unknown;

    // Use type guard
    if (!isJwtPayload(decoded)) {
      throw new AppError('Invalid token payload', 401);
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email as string,
      role: (decoded.role || 'USER') as 'USER' | 'ADMIN',
    };

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
