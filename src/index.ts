import express from 'express';
import authRoutes from './auth/auth.routes';
import addressRoutes from './address/address.routes';
import cartRoutes from './cart/cart.routes';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';
import { config } from './config/config';
const app = express();

app.use(cookieParser(config.cookieSecret));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello',
  });
});

app.use(globalErrorHandler);

export { app };
