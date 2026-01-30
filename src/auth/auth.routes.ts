import { Router } from 'express';
import {
  registerController,
  loginController,
  verifyOtpController,
  refreshTokenController,
  logoutController,
  sendOtpController,
} from './auth.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/verify-otp', requireAuth, verifyOtpController);
router.post('/send-otp', sendOtpController);
router.post('/refresh-token', refreshTokenController);
router.post('/logout', logoutController);

export default router;
