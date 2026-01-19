import { prisma } from '../config/prisma';
import bcrypt from 'bcrypt';
import { generateOtp } from '../utils/otp';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import {
  LoginInput,
  OtpVerifyInput,
  RegisterInput,
  SendOtpInput,
} from './auth.schema';
import { sendEmail } from './helper/nodeMailer';
import { AppError } from '../utils/AppError';

export const register = async (data: RegisterInput) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
    },
  });

  const otp = generateOtp();

  await prisma.oTPVerification.create({
    data: {
      userId: user.id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  if (!user.name) {
    throw new AppError('User Name is not Valid.', 400);
  }

  await sendEmail(user.email, otp, user.name);

  // send OTP (SMS / Email)
  return { userId: user.id, message: 'OTP sent' };
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { phone: data.phone }],
    },
  });

  if (!user || !user.password) throw new AppError('Invalid credentials');

  const valid = await bcrypt.compare(data.password, user.password);

  if (!valid) throw new AppError('Invalid credentials');

  console.log('User Info ', user);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken };
};

export const sendOtp = async (data: SendOtpInput) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { phone: data.phone }],
    },
  });

  if (!user || !user.password) throw new AppError('Invalid credentials');

  const otp = generateOtp();

  await prisma.oTPVerification.create({
    data: {
      userId: user.id,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  if (!user.name) {
    throw new AppError('User Name is not Valid.');
  }

  await sendEmail(user.email, otp, user.name);

  return { message: 'Verification Email Sent' };
};

export const verifyOtp = async ({ userId, otp }: OtpVerifyInput) => {
  const record = await prisma.oTPVerification.findFirst({
    where: { userId, otp, verified: false },
  });

  if (!record || record.expiresAt < new Date()) {
    throw new AppError('Invalid or expired OTP');
  }

  await prisma.$transaction([
    prisma.oTPVerification.update({
      where: { id: record.id },
      data: { verified: true },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    }),
  ]);

  return { message: 'Account verified' };
};

export const refreshToken = async (token: string) => {
  const stored = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if (!stored || stored.revoked) {
    throw new AppError('Invalid refresh token');
  }

  const user = await prisma.user.findUnique({
    where: { id: stored.userId },
  });

  if (!user) throw new AppError('User not found');

  return {
    accessToken: generateAccessToken(user),
  };
};
