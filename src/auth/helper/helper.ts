import { AppError } from '../../utils/AppError';
import { Request } from 'express';

// Helper to extract user ID from authenticated request
const getUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }
  return userId;
};

export { getUserId };
