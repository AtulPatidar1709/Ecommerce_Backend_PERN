import crypto from 'crypto';

/**
 * Generate numeric OTP
 */

export const generateOtp = (length = 6): string => {
  const digits = '0123456789';
  let otp = '';

  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    otp += digits[randomBytes[i] % 10];
  }

  return otp;
};

/**
 * OTP expiry helper (default 5 minutes)
 */
export const getOtpExpiry = (minutes = 5): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};
