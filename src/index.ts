import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { config } from './config/config';
import authRoutes from './auth/auth.routes';
import cartRoutes from './cart/cart.routes';
import userRoutes from './user/user.routes';
import orderRoutes from './order/order.routes';
import couponRoutes from './coupon/coupon.routes';
import reviewRoutes from './review/review.routes';
import bannerRoutes from './banner/banner.routes';
import paymentRoutes from './payment/payment.routes';
import productRoutes from './product/product.routes';
import addressRoutes from './address/address.routes';
import categoryRoutes from './category/category.routes';
import orderReturnRoutes from './orderReturn/orderReturn.routes';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import orderCancellationRoutes from './orderCancellation/orderCancellation.routes';

const app = express();

// Core Security & Optimization (Top Level)
app.use(
  cors({
    origin: [config.frontendDomain!, config.buildDomain!],
    credentials: true,
  }),
);

// Cookie & Body Parsing.
app.use(cookieParser(config.cookieSecret));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/order-returns', orderReturnRoutes);
app.use('/api/order-cancellations', orderCancellationRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'E-Commerce API Server is running',
    version: '1.0.0',
  });
});

app.use(globalErrorHandler);

export { app };
