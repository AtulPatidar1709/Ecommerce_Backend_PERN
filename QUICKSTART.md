# Quick Start Guide

## 🚀 Getting Started with the E-Commerce API

### Prerequisites

- Node.js v18+
- npm or yarn
- PostgreSQL database
- Environment configuration

---

## 1️⃣ Installation

```bash
# Navigate to project directory
cd server

# Install dependencies
npm install

# or with yarn
yarn install
```

---

## 2️⃣ Environment Setup

Create `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET="your-secret-key-here"
JWT_EXPIRE="15m"
REFRESH_TOKEN_SECRET="your-refresh-secret-here"
REFRESH_TOKEN_EXPIRE="7d"

# Cookie Configuration
COOKIE_SECRET="your-cookie-secret-here"

# Email Configuration (Optional)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-specific-password"

# Image Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
```

---

## 3️⃣ Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Or push schema (development)
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed
```

---

## 4️⃣ Start Development Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Server will be available at: `http://localhost:5000`

---

## 5️⃣ Test API Endpoints

### Using cURL

```bash
# Get all categories
curl http://localhost:5000/api/category

# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "name": "John",
  }'
```

### Using Postman

1. Import the API collection
2. Set environment variables
3. Test each endpoint

---

## 📂 Project Structure

```
src/
├── index.ts              # Main app file
├── address/              # Address management
├── auth/                 # Authentication
├── banner/               # Homepage banners
├── cart/                 # Shopping cart
├── category/             # Product categories
├── config/               # Configuration
├── coupon/               # Discount coupons
├── middlewares/          # Express middlewares
├── order/                # Order management
├── orderCancellation/    # Order cancellation
├── orderReturn/          # Product returns
├── payment/              # Payment processing
├── product/              # Product management
├── review/               # Product reviews
├── user/                 # User profiles
└── utils/                # Utilities
```

---

## 🔑 Key API Routes

### Authentication

```
POST   /api/auth/register          - Register user
POST   /api/auth/login             - Login user
POST   /api/auth/send-otp          - Send OTP
POST   /api/auth/verify-otp        - Verify OTP
POST   /api/auth/refresh-token     - Refresh token
POST   /api/auth/logout            - Logout
```

### Users

```
GET    /api/users/profile          - Get profile
PUT    /api/users/profile          - Update profile
POST   /api/users/change-password  - Change password
GET    /api/users/stats            - Get stats
```

### Products & Categories

```
GET    /api/category               - Get all categories
POST   /api/category               - Create category (Admin)
GET    /api/products               - Get all products
POST   /api/products               - Create product (Admin)
```

### Shopping

```
POST   /api/cart                   - Add to cart
GET    /api/cart                   - Get cart
PUT    /api/cart/:id               - Update cart item
DELETE /api/cart/:id               - Remove from cart
```

### Orders

```
POST   /api/orders                 - Create order
GET    /api/orders                 - Get user orders
GET    /api/orders/:id             - Get order details
PATCH  /api/orders/:id/cancel      - Cancel order
```

### Payment

```
POST   /api/payments               - Initiate payment
POST   /api/payments/verify/razorpay - Verify payment
```

### Reviews

```
POST   /api/reviews                - Create review
GET    /api/reviews                - Get user reviews
GET    /api/reviews/product/:id    - Get product reviews
PUT    /api/reviews/:id            - Update review
DELETE /api/reviews/:id            - Delete review
```

---

## 🔐 Authentication Flow

### 1. Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John",
  }'
```

### 2. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### 3. Access Protected Routes

```bash
curl -H "Cookie: accessToken=..." \
  http://localhost:5000/api/users/profile
```

---

## 📦 Admin Operations

### Create Category

```bash
curl -X POST http://localhost:5000/api/category \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=..." \
  -d '{
    "name": "Electronics",
    "slug": "electronics",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

### Create Product

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=..." \
  -d '{
    "title": "Product Name",
    "description": "Product description",
    "price": 999.99,
    "stock": 50,
    "categoryId": "category-uuid",
    "images": [
      {
        "imageUrl": "https://example.com/image.jpg",
        "isPrimary": true
      }
    ],
    "primaryIndex": 0
  }'
```

### Create Coupon

```bash
curl -X POST http://localhost:5000/api/coupons \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=..." \
  -d '{
    "code": "SAVE10",
    "description": "Save 10% on all orders",
    "discountType": "PERCENTAGE",
    "discountValue": 10,
    "minOrderAmount": 1000,
    "maxDiscountAmount": 5000,
    "validFrom": "2025-01-20T00:00:00Z",
    "validTo": "2025-12-31T23:59:59Z"
  }'
```

---

## 🧪 Sample Data Creation

### 1. Create User

```bash
POST /api/auth/register
{
  "email": "john@example.com",
  "password": "Password123",
  "name": "John",
}
```

### 2. Create Category

```bash
POST /api/category
{
  "name": "Electronics",
  "slug": "electronics",
  "imageUrl": "https://example.com/image.jpg"
}
```

### 3. Create Product

```bash
POST /api/products
{
  "title": "Laptop",
  "description": "High-performance laptop",
  "price": 50000,
  "stock": 20,
  "categoryId": "<category-uuid>",
  "images": [
    {
      "imageUrl": "https://example.com/laptop.jpg",
      "isPrimary": true
    }
  ],
  "primaryIndex": 0
}
```

### 4. Add to Cart

```bash
POST /api/cart
{
  "productId": "<product-uuid>",
  "quantity": 1
}
```

### 5. Create Order

```bash
POST /api/orders
{
  "addressId": "<address-uuid>",
  "couponId": "<coupon-uuid>" (optional)
}
```

---

## 🛠️ Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio

# Run migrations
npx prisma migrate dev --name <migration-name>

# Reset database (development only)
npx prisma migrate reset

# Lint code with ESLint
npm run lint

# Format code with Prettier
npm run format
```

---

## 📝 Code Examples

### Using Service Layer

```typescript
import * as categoryService from './category.service';

// Create category
const result = await categoryService.createCategory({
  name: 'Electronics',
  slug: 'electronics',
});

// Get category
const category = await categoryService.getCategoryById(categoryId);
```

### Using Controller

```typescript
export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = createCategorySchema.parse(req.body);
    const result = await categoryService.createCategory(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
```

### Using Routes

```typescript
import { Router } from 'express';
import { createCategoryController } from './category.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';
import isAdmin from '../middlewares/auth_middlewares/isAdmin';

const router = Router();

router.post('/', requireAuth, isAdmin, createCategoryController);

export default router;
```

---

## 🐛 Debugging

### Enable Debug Logs

```bash
# Enable Prisma debug
DEBUG=prisma* npm run dev
```

### Check Prisma Schema

```bash
npx prisma studio
```

### Validate Schema

```bash
npx prisma validate
```

---

## 📋 Troubleshooting

### Issue: Database Connection Failed

**Solution:**

```bash
# Check DATABASE_URL in .env
# Verify PostgreSQL is running
# Reset database: npx prisma migrate reset
```

### Issue: TypeScript Compilation Error

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Regenerate Prisma Client
npx prisma generate
```

### Issue: JWT Token Invalid

**Solution:**

```bash
# Check JWT_SECRET in .env
# Ensure token is in httpOnly cookie
# Verify token hasn't expired
```

### Issue: Validation Error

**Solution:**

```bash
# Check schema in .schema.ts files
# Validate request body matches Zod schema
# Check error message for details
```

---

## 📖 Documentation Files

1. **API_DOCUMENTATION.md** - Complete API reference
2. **ARCHITECTURE.md** - System architecture guide
3. **IMPLEMENTATION_SUMMARY.md** - Implementation details
4. **README.md** - Quick start guide (this file)

---

## 🚀 Deployment

### Prerequisites

- Docker (optional)
- Node.js hosting (Heroku, AWS, DigitalOcean, etc.)
- PostgreSQL database
- Environment variables configured

### Steps

1. Push code to repository
2. Configure environment variables
3. Run database migrations
4. Start server
5. Test endpoints

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [JWT Documentation](https://jwt.io/)

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Follow code style
4. Test thoroughly
5. Create pull request

---

## 📞 Support

For issues and questions:

1. Check documentation files
2. Review error messages
3. Check database schema
4. Verify environment variables
5. Check server logs

---

## 📝 License

MIT License - Feel free to use this project

---

**Happy Coding! 🎉**

---

**Last Updated:** January 20, 2025 **Version:** 1.0.0
