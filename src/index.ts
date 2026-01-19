import express from 'express';
import authRoutes from './auth/auth.routes';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello',
  });
});

app.use(globalErrorHandler);

export { app };
