import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { Prisma } from '../../prisma/generated/prisma/client';

type ValidationError = {
  field: string;
  message: string;
}[];

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Defaults
  let statusCode = 500;
  let message = 'Something went wrong';
  let errors: ValidationError | null = null;

  /* ---------------- ZOD ERRORS ---------------- */
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    /* ---------------- PRISMA ERRORS ---------------- */
    statusCode = 400;

    switch (err.code) {
      case 'P2002':
        message = `Duplicate value for field: ${err.meta?.target}`;
        break;
      case 'P2025':
        message = 'Record not found';
        statusCode = 404;
        break;
      default:
        message = 'Database error';
    }
  } else if (err instanceof jwt.JsonWebTokenError) {
    /* ---------------- JWT ERRORS ---------------- */
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (err instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Authentication token expired';
  } else if (err instanceof AppError) {
    /* ---------------- APP ERROR ---------------- */
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    /* ---------------- UNKNOWN ERROR ---------------- */
    message = err.message;
  }

  /* ---------------- RESPONSE ---------------- */
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err instanceof Error ? err.stack : undefined,
    }),
  });
};
