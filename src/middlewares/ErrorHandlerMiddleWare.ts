import { Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { config } from '../config/config.js';

const ErrorHandlerMiddleWare = (err: HttpError, req: Request, res: Response) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message,
    errorStack: config.environment === 'development' ? err.stack : '',
  });
};

export default ErrorHandlerMiddleWare;
