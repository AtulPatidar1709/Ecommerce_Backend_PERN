import { AuthenticatedRequest } from '../../middlewares/auth_middlewares/types/AuthenticatedRequestTypes.js';
import { AppError } from '../../utils/AppError.js';

// Helper to extract user ID from authenticated request
const getUserId = (req: AuthenticatedRequest): string => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }
  return userId;
};

export { getUserId };
