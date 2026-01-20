import { Request } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Extract and validate user ID from request
 */
export const getUserIdFromRequest = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError('User ID not found', 401);
  }
  return userId;
};
