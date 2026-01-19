import { Router } from 'express';
import {
  registerController,
  loginController,
  verifyOtpController,
  refreshTokenController,
  logoutController,
  sendOtpController,
} from './auth.controller';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/verify-otp', verifyOtpController);
router.post('/send-otp', sendOtpController);
router.post('/refresh-token', refreshTokenController);
router.post('/logout', logoutController);

export default router;
