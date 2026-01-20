import express from 'express';
import authRoutes from './auth/auth.routes';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';
import { config } from './config/config';
const app = express();

app.use(cookieParser(config.cookieSecret));

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello',
  });
});

app.use(globalErrorHandler);

export { app };
