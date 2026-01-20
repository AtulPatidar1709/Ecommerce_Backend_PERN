# Project Structure & Architecture Guide

## Directory Structure

```
server/
├── src/
│   ├── index.ts                          # Main application entry point
│   ├── address/                          # User addresses module
│   │   ├── address.controller.ts         # Request handlers
│   │   ├── address.routes.ts             # Route definitions
│   │   ├── address.schema.ts             # Zod validation schemas
│   │   └── address.service.ts            # Business logic
│   ├── auth/                             # Authentication module
│   ├── banner/                           # Homepage banners module
│   │   ├── banner.controller.ts
│   │   ├── banner.routes.ts
│   │   ├── banner.schema.ts
│   │   └── banner.service.ts
│   ├── cart/                             # Shopping cart module
│   ├── category/                         # Product categories module
│   │   ├── category.controller.ts
│   │   ├── category.routes.ts
│   │   ├── category.schema.ts
│   │   └── category.service.ts
│   ├── config/                           # Configuration files
│   │   ├── cloudinary.ts                 # Image upload config
│   │   ├── config.ts                     # Environment variables
│   │   └── prisma.ts                     # Database config
│   ├── coupon/                           # Discount coupons module
│   │   ├── coupon.controller.ts
│   │   ├── coupon.routes.ts
│   │   ├── coupon.schema.ts
│   │   └── coupon.service.ts
│   ├── helper/                           # Utility functions
│   ├── middlewares/                      # Express middlewares
│   │   ├── ErrorHandlerMiddleWare.ts     # Error handling
│   │   ├── globalErrorHandler.ts         # Global error handler
│   │   ├── multerFiles.ts                # File upload config
│   │   ├── rateLimmiter.ts               # Rate limiting
│   │   ├── throttling.ts                 # Request throttling
│   │   └── auth_middlewares/             # Authentication middlewares
│   │       ├── authMiddleware.ts         # JWT verification
│   │       └── isAdmin.ts                # Admin authorization
│   ├── order/                            # Orders module
│   │   ├── order.controller.ts
│   │   ├── order.routes.ts
│   │   ├── order.schema.ts
│   │   ├── order.service.ts
│   │   └── helper/                       # Order-specific helpers
│   ├── orderCancellation/                # Order cancellation module
│   │   ├── orderCancellation.controller.ts
│   │   ├── orderCancellation.routes.ts
│   │   ├── orderCancellation.schema.ts
│   │   └── orderCancellation.service.ts
│   ├── orderReturn/                      # Product returns module
│   │   ├── orderReturn.controller.ts
│   │   ├── orderReturn.routes.ts
│   │   ├── orderReturn.schema.ts
│   │   └── orderReturn.service.ts
│   ├── payment/                          # Payment processing module
│   │   ├── payment.controller.ts
│   │   ├── payment.routes.ts
│   │   ├── payment.schema.ts
│   │   └── payment.service.ts
│   ├── product/                          # Products module
│   │   ├── product.controller.ts
│   │   ├── product.routes.ts
│   │   ├── product.schema.ts
│   │   ├── product.service.ts
│   │   ├── middlewares.ts                # Product-specific middlewares
│   │   ├── helper/                       # Product helpers
│   │   └── utils/                        # Product utilities
│   ├── review/                           # Product reviews module
│   │   ├── review.controller.ts
│   │   ├── review.routes.ts
│   │   ├── review.schema.ts
│   │   └── review.service.ts
│   ├── types/                            # TypeScript type definitions
│   │   ├── express.d.ts                  # Express request types
│   │   └── isJwtPayload.ts               # JWT payload types
│   ├── user/                             # User profile module
│   │   ├── user.controller.ts
│   │   ├── user.routes.ts
│   │   ├── user.schema.ts
│   │   └── user.service.ts
│   └── utils/                            # Shared utilities
│       ├── AppError.ts                   # Custom error class
│       ├── jwt.ts                        # JWT utilities
│       └── otp.ts                        # OTP utilities
├── prisma/
│   ├── schema.prisma                     # Main Prisma schema
│   ├── enums.prisma                      # Enum definitions
│   ├── schema/                           # Schema modules
│   │   ├── ADDRESS/                      # Address schema
│   │   ├── CANCELLATION_RETURN/          # Cancellation & Return schemas
│   │   ├── CART/                         # Cart schema
│   │   ├── CATEGORY_PRODUCT/             # Category & Product schemas
│   │   ├── COUPON/                       # Coupon schemas
│   │   ├── HOMEPAGE/                     # Banner schema
│   │   ├── ORDER_PAYMENT/                # Order & Payment schemas
│   │   ├── REVIEW/                       # Review schema
│   │   └── USER_AUTH/                    # User & Auth schemas
│   ├── migrations/                       # Database migrations
│   └── generated/                        # Generated Prisma client
├── eslint.config.ts                      # ESLint configuration
├── tsconfig.json                         # TypeScript configuration
├── package.json                          # Project dependencies
└── server.ts                             # Server startup file
```

---

## Architecture Pattern: MVC (Model-View-Controller)

Each module follows the MVC architecture:

### 1. **Routes** (View/API Layer)
- Defines HTTP endpoints
- Maps requests to controllers
- Applies middleware and authentication

```typescript
// Example: category.routes.ts
router.post('/', requireAuth, isAdmin, createCategoryController);
router.get('/', getAllCategoriesController);
router.get('/:id', getCategoryByIdController);
router.put('/:id', requireAuth, isAdmin, updateCategoryController);
router.delete('/:id', requireAuth, isAdmin, deleteCategoryController);
```

### 2. **Controllers** (Request Handler)
- Validates incoming request data
- Calls service methods
- Returns formatted responses
- Handles errors and passes to error handler

```typescript
// Example: category.controller.ts
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

### 3. **Services** (Business Logic)
- Implements core business logic
- Communicates with database via Prisma
- Handles data validation and processing
- Throws AppError for error handling

```typescript
// Example: category.service.ts
export const createCategory = async (data: CreateCategoryInput) => {
  const existingCategory = await prisma.category.findUnique({
    where: { slug: data.slug },
  });

  if (existingCategory) {
    throw new AppError('Category with this slug already exists', 409);
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      imageUrl: data.imageUrl,
    },
  });

  return {
    success: true,
    message: 'Category created successfully',
    data: category,
  };
};
```

### 4. **Schemas** (Validation)
- Defines Zod validation schemas
- Type inference for TypeScript
- Ensures data integrity at request level

```typescript
// Example: category.schema.ts
export const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  imageUrl: z.string().url().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
```

---

## Module List & Responsibilities

### 🔐 **Auth Module** (`/auth`)
- User registration and login
- OTP verification
- Token refresh
- Logout

### 👤 **User Module** (`/user`)
- User profile management
- Password change
- User statistics
- Account deactivation
- Admin user management

### 📦 **Product Module** (`/product`)
- Product CRUD operations
- Product filtering and search
- Product images management

### 🏷️ **Category Module** (`/category`)
- Category CRUD operations
- Product association
- Category status toggle

### 📝 **Review Module** (`/review`)
- Product reviews
- Rating system
- User review history
- Admin review management

### 🛒 **Cart Module** (`/cart`)
- Add/remove items from cart
- Update quantities
- Cart clearing
- Cart calculations

### 🎯 **Order Module** (`/order`)
- Create orders
- Order tracking
- Order status updates
- Order cancellation
- Order history

### 💳 **Payment Module** (`/payment`)
- Payment initiation
- Razorpay integration
- Payment verification
- Payment status tracking

### 📬 **Address Module** (`/address`)
- User address management
- Multiple addresses support
- Address CRUD operations

### 🏷️ **Coupon Module** (`/coupon`)
- Coupon CRUD operations
- Coupon validation
- Discount calculations
- Usage tracking

### 🎁 **Banner Module** (`/banner`)
- Homepage banner management
- Active/Inactive toggle
- Banner scheduling

### ↩️ **Order Return Module** (`/orderReturn`)
- Return request creation
- Return status tracking
- Refund processing

### ❌ **Order Cancellation Module** (`/orderCancellation`)
- Cancellation request handling
- Refund management
- Status tracking

---

## Request Flow Diagram

```
Request
   ↓
Routes (Middleware: auth, admin check)
   ↓
Controller (Validates with Schema)
   ↓
Service (Business Logic + Database)
   ↓
Response/Error
   ↓
Error Handler Middleware
   ↓
Response to Client
```

---

## Key Design Patterns

### 1. **Error Handling**
```typescript
// Custom error class
throw new AppError('User not found', 404);

// Global error handler catches and responds
```

### 2. **Data Validation**
```typescript
// All inputs validated with Zod
const data = createCategorySchema.parse(req.body);
```

### 3. **Authentication**
```typescript
// Middleware checks JWT tokens
router.post('/', requireAuth, isAdmin, createCategoryController);
```

### 4. **Pagination**
```typescript
// Standard pagination pattern
const [items, totalCount] = await Promise.all([
  prisma.model.findMany({ skip, take: limit }),
  prisma.model.count(),
]);
```

### 5. **Relationships**
```typescript
// Include related data in responses
include: {
  products: { select: { id: true, title: true } },
  _count: { select: { products: true } },
}
```

---

## Database Schema Relationships

### User-Related Models
- **User** → One-to-Many → **Address**
- **User** → One-to-Many → **Order**
- **User** → One-to-Many → **Review**
- **User** → One-to-Many → **CartItem**
- **User** → One-to-Many → **RefreshToken**

### Product-Related Models
- **Category** → One-to-Many → **Product**
- **Product** → One-to-Many → **ProductImage**
- **Product** → One-to-Many → **CartItem**
- **Product** → One-to-Many → **OrderItem**
- **Product** → One-to-Many → **Review**

### Order-Related Models
- **Order** → Many-to-One → **User**
- **Order** → Many-to-One → **Address**
- **Order** → Many-to-One → **Coupon**
- **Order** → One-to-Many → **OrderItem**
- **Order** → One-to-One → **Payment**
- **Order** → One-to-One → **OrderCancellation**
- **Order** → One-to-One → **OrderReturn**

### Coupon-Related Models
- **Coupon** → Many-to-Many → **User** (via UserCoupon)
- **Coupon** → One-to-Many → **Order**

---

## Environment Variables (.env)

```
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=production

# Cookies
COOKIE_SECRET=your-cookie-secret

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay (Payments)
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
```

---

## Development Best Practices

### ✅ **Do's**
- Use TypeScript for type safety
- Validate all inputs with Zod schemas
- Use Prisma for database operations
- Implement proper error handling
- Add appropriate middleware
- Use meaningful error messages
- Implement pagination for list endpoints
- Follow consistent naming conventions
- Use descriptive variable/function names
- Add logging for debugging

### ❌ **Don'ts**
- Don't use string concatenation for SQL queries
- Don't expose sensitive data in responses
- Don't skip input validation
- Don't catch errors without handling
- Don't hardcode configuration values
- Don't use `any` type unnecessarily
- Don't make synchronous database calls
- Don't expose error stack traces to clients
- Don't mix business logic with route handlers
- Don't forget to close database connections

---

## Performance Optimization

### Database Queries
- Use `select` to fetch only needed fields
- Use `where` conditions to filter early
- Implement proper indexing
- Use pagination for large datasets
- Avoid N+1 query problems with `include`

### Response Optimization
- Only include necessary data in responses
- Compress large responses
- Implement caching for frequently accessed data
- Use CDN for static assets

### Security
- Validate and sanitize all inputs
- Use parameterized queries
- Implement rate limiting
- Use HTTPS in production
- Hash sensitive data
- Secure cookie settings

---

## Testing Endpoints

Use Postman or similar API client to test:

1. **Auth Flow:**
   - Register → Login → Verify OTP → Get Profile

2. **Product Flow:**
   - Get Categories → Get Products → Create Review

3. **Order Flow:**
   - Add to Cart → Create Order → Initiate Payment → Verify Payment

4. **Admin Flow:**
   - Create Category → Create Product → Create Coupon → View All Orders

---

## API Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## Version Control Recommendations

### Commit Messages
```
feat: Add category CRUD routes
fix: Handle null reference in payment service
docs: Update API documentation
refactor: Simplify order service logic
```

### Branch Strategy
```
main → production code
develop → integration branch
feature/... → feature branches
bugfix/... → bug fix branches
```

---

**Last Updated:** January 20, 2025

**Maintainer:** Development Team
