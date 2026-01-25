import { NextFunction, Response } from 'express';
import createHttpError from 'http-errors';
import { AuthenticatedRequest } from './types/AuthenticatedRequestTypes';

const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return next(createHttpError(401, 'Please log in first.'));
    }

    const { id, role } = req.user;

    if (!id) {
      return next(createHttpError(404, 'Please Logged in first.'));
    }
    if (role !== 'ADMIN') {
      return next(createHttpError(404, 'Admin Only Route.'));
    }

    next();
  } catch (error: unknown) {
    console.log(error);
    return next(createHttpError(400, 'Something went wrong'));
  }
};

export default isAdmin;
