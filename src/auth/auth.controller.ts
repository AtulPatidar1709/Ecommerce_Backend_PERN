import { NextFunction, Request, Response } from 'express';
import {
  registerSchema,
  loginSchema,
  otpVerifySchema,
  sendOtpSchema,
} from './auth.schema';
import * as authService from './auth.service';

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = otpVerifySchema.parse(req.body);
    const result = await authService.verifyOtp(data);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const sendOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = sendOtpSchema.parse(req.body);
    const result = await authService.sendOtp(data);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.refreshToken;
    const result = await authService.refreshToken(token);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    next(error);
  }
};
