import { Request } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth_middlewares/types/AuthenticatedRequestTypes';
import { AppError } from '../../utils/AppError';
import { getOrdersQuerySchema } from '../oder.schema';

// Helper to extract user ID from authenticated request
const getUserId = (req: Request): string => {
  const userId = (req : AuthenticatedRequest).user?.id;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }
  return userId;
};

// Helper to parse and validate query parameters
const parseQuery = (query: Record<string, unknown>) => {
  return getOrdersQuerySchema.parse(query);
};

export { getUserId, parseQuery };
