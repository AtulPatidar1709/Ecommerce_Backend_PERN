# E-Commerce API Documentation

## Overview

This is a comprehensive RESTful API for an e-commerce platform built with
Express.js, TypeScript, and Prisma ORM. The API follows industry best practices
for clean code, error handling, and security.

## Base URL

```
http://localhost:5000/api
```

---

## Authentication Routes (`/api/auth`)

### 1. Register User

- **Endpoint:** `POST /api/auth/register`
- **Description:** Create a new user account
- **Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

- **Response:** `201 Created`

### 2. Login User

- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate user and receive tokens
- **Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

- **Response:** `201 Created` (Sets httpOnly cookies)

### 3. Send OTP

- **Endpoint:** `POST /api/auth/send-otp`
- **Description:** Send OTP to user email
- **Body:**

```json
{
  "email": "user@example.com"
}
```

- **Response:** `201 Created`

### 4. Verify OTP

- **Endpoint:** `POST /api/auth/verify-otp`
- **Description:** Verify OTP for email verification
- **Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

- **Response:** `200 OK`

### 5. Refresh Token

- **Endpoint:** `POST /api/auth/refresh-token`
- **Description:** Get new access token using refresh token
- **Response:** `201 Created`

### 6. Logout User

- **Endpoint:** `POST /api/auth/logout`
- **Description:** Clear authentication tokens
- **Auth Required:** Yes
- **Response:** `200 OK`

---

## User Profile Routes (`/api/users`)

### 1. Get Current User Profile

- **Endpoint:** `GET /api/users/profile`
- **Description:** Get authenticated user's profile
- **Auth Required:** Yes
- **Response:** `200 OK`

### 2. Update User Profile

- **Endpoint:** `PUT /api/users/profile`
- **Description:** Update user profile information
- **Auth Required:** Yes
- **Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9876543210"
}
```

- **Response:** `200 OK`

### 3. Change Password

- **Endpoint:** `POST /api/users/change-password`
- **Description:** Change user password
- **Auth Required:** Yes
- **Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

- **Response:** `200 OK`

### 4. Get User Statistics

- **Endpoint:** `GET /api/users/stats`
- **Description:** Get user order and activity statistics
- **Auth Required:** Yes
- **Response:** `200 OK`

### 5. Get All Users (Admin)

- **Endpoint:** `GET /api/users?page=1&limit=10`
- **Description:** Get paginated list of all users
- **Auth Required:** Yes (Admin)
- **Query Parameters:** `page`, `limit`
- **Response:** `200 OK`

### 6. Get User by ID (Admin)

- **Endpoint:** `GET /api/users/:id`
- **Description:** Get specific user details
- **Auth Required:** Yes (Admin)
- **Response:** `200 OK`

### 7. Deactivate Account

- **Endpoint:** `POST /api/users/deactivate`
- **Description:** Deactivate user account
- **Auth Required:** Yes
- **Body:**

```json
{
  "password": "userPassword123"
}
```

- **Response:** `200 OK`

---

## Category Routes (`/api/category`)

### 1. Get All Categories

- **Endpoint:** `GET /api/category?isActive=true`
- **Description:** Get all product categories
- **Query Parameters:** `isActive` (optional)
- **Response:** `200 OK`

### 2. Get Category by ID

- **Endpoint:** `GET /api/category/:id`
- **Description:** Get specific category with products
- **Response:** `200 OK`

### 3. Get Category by Slug

- **Endpoint:** `GET /api/category/slug/:slug`
- **Description:** Get category by URL slug
- **Response:** `200 OK`

### 4. Create Category (Admin)

- **Endpoint:** `POST /api/category`
- **Description:** Create new product category
- **Auth Required:** Yes (Admin)
- **Body:**

```json
{
  "name": "Electronics",
  "slug": "electronics",
  "imageUrl": "https://example.com/image.jpg"
}
```

- **Response:** `201 Created`

### 5. Update Category (Admin)

- **Endpoint:** `PUT /api/category/:id`
- **Description:** Update category details
- **Auth Required:** Yes (Admin)
- **Body:** Same as create (all fields optional)
- **Response:** `200 OK`

### 6. Toggle Category Status (Admin)

- **Endpoint:** `PATCH /api/category/:id/toggle-status`
- **Description:** Activate/Deactivate category
- **Auth Required:** Yes (Admin)
- **Response:** `200 OK`

### 7. Delete Category (Admin)

- **Endpoint:** `DELETE /api/category/:id`
- **Description:** Delete category (must have no products)
- **Auth Required:** Yes (Admin)
- **Response:** `200 OK`

---

## Product Routes (`/api/products`)

### 1. Get All Products

- **Endpoint:** `GET /api/products`
- **Description:** Get all active products with pagination
- **Response:** `200 OK`

### 2. Get Product by ID

- **Endpoint:** `GET /api/products/:id`
- **Description:** Get specific product details
- **Response:** `200 OK`

### 3. Create Product (Admin)

- **Endpoint:** `POST /api/products`
- **Description:** Create new product
- **Auth Required:** Yes (Admin)
- **Body:**

```json
{
  "title": "Product Name",
  "description": "Detailed product description",
  "price": 999.99,
  "discountPrice": 799.99,
  "stock": 50,
  "brand": "Brand Name",
  "categoryId": "uuid",
  "images": [
    {
      "imageUrl": "https://example.com/image1.jpg",
      "isPrimary": true
    }
  ],
  "primaryIndex": 0
}
```

- **Response:** `201 Created`

### 4. Update Product (Admin)

- **Endpoint:** `PUT /api/products/:id`
- **Description:** Update product details
- **Auth Required:** Yes (Admin)
- **Body:** Same as create (all fields optional)
- **Response:** `200 OK`

### 5. Delete Product (Admin)

- **Endpoint:** `DELETE /api/products/:id`
- **Description:** Delete product
- **Auth Required:** Yes (Admin)
- **Response:** `200 OK`

---

## Review Routes (`/api/reviews`)

### 1. Create Review

- **Endpoint:** `POST /api/reviews`
- **Description:** Create product review (must have purchased product)
- **Auth Required:** Yes
- **Body:**

```json
{
  "productId": "uuid",
  "rating": 5,
  "comment": "Great product!"
}
```

- **Response:** `201 Created`

### 2. Get Reviews by Product

- **Endpoint:** `GET /api/reviews/product/:productId?page=1&limit=10`
- **Description:** Get all reviews for a product
- **Query Parameters:** `page`, `limit`
- **Response:** `200 OK`

### 3. Get User Reviews

- **Endpoint:** `GET /api/reviews?page=1&limit=10`
- **Description:** Get authenticated user's reviews
- **Auth Required:** Yes
- **Query Parameters:** `page`, `limit`
- **Response:** `200 OK`

### 4. Get Review by ID

- **Endpoint:** `GET /api/reviews/:id`
- **Description:** Get specific review
- **Response:** `200 OK`

### 5. Update Review

- **Endpoint:** `PUT /api/reviews/:id`
- **Description:** Update user's review
- **Auth Required:** Yes
- **Body:**

```json
{
  "rating": 4,
  "comment": "Updated review"
}
```

- **Response:** `200 OK`

### 6. Delete Review

- **Endpoint:** `DELETE /api/reviews/:id`
- **Description:** Delete user's review
- **Auth Required:** Yes
- **Response:** `200 OK`

### 7. Delete Review (Admin)

- **Endpoint:** `DELETE /api/reviews/:id/admin`
- **Description:** Delete any review (admin only)
- **Auth Required:** Yes (Admin)
- **Response:** `200 OK`

---

## Address Routes (`/api/address`)

### 1. Create Address

- **Endpoint:** `POST /api/address`
- **Description:** Add new delivery address
- **Auth Required:** Yes
- **Body:**

```json
{
  "name": "Home",
  "phone": "9876543210",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "pincode": "10001",
  "country": "USA"
}
```

- **Response:** `201 Created`

### 2. Get All Addresses

- **Endpoint:** `GET /api/address`
- **Description:** Get user's addresses
- **Auth Required:** Yes
- **Response:** `200 OK`

### 3. Get Address by ID

- **Endpoint:** `GET /api/address/:addressId`
- **Description:** Get specific address
- **Auth Required:** Yes
- **Response:** `200 OK`

### 4. Update Address

- **Endpoint:** `PUT /api/address/:addressId`
- **Description:** Update address details
- **Auth Required:** Yes
- **Body:** Same as create (all fields optional)
- **Response:** `200 OK`

### 5. Delete Address

- **Endpoint:** `DELETE /api/address/:addressId`
- **Description:** Delete address
- **Auth Required:** Yes
- **Response:** `200 OK`

---

## Cart Routes (`/api/cart`)

### 1. Add to Cart

- **Endpoint:** `POST /api/cart`
- **Description:** Add product to shopping cart
- **Auth Required:** Yes
- **Body:**

```json
{
  "productId": "uuid",
  "quantity": 2
}
```

- **Response:** `201 Created`

### 2. Get Cart

- **Endpoint:** `GET /api/cart`
- **Description:** Get user's shopping cart
- **Auth Required:** Yes
- **Response:** `200 OK`

### 3. Update Cart Item

- **Endpoint:** `PUT /api/cart/:cartItemId`
- **Description:** Update item quantity
- **Auth Required:** Yes
- **Body:**

```json
{
  "quantity": 3
}
```

- **Response:** `200 OK`

### 4. Remove from Cart

- **Endpoint:** `DELETE /api/cart/:cartItemId`
- **Description:** Remove item from cart
- **Auth Required:** Yes
- **Response:** `200 OK`

### 5. Clear Cart

- **Endpoint:** `DELETE /api/cart`
- **Description:** Clear entire shopping cart
- **Auth Required:** Yes
- **Response:** `200 OK`

---

## Coupon Routes (`/api/coupons`)

### 1. Validate Coupon

- **Endpoint:** `POST /api/coupons/validate`
- **Description:** Validate coupon code and calculate discount
- **Auth Required:** Yes
- **Body:**

```json
{
  "code": "SAVE10",
  "orderAmount": 5000
}
```

- **Response:** `200 OK`

### 2. Get All Coupons (Admin)

- **Endpoint:** `GET /api/coupons?isActive=true`
- **Description:** Get all coupons
- **Auth Required:** Yes (Admin)
- **Query Parameters:** `isActive` (optional)
- **Response:** `200 OK`

### 3. Get Coupon by ID (Admin)

- **Endpoint:** `GET /api/coupons/:id`
- **Description:** Get specific coupon details
- **Auth Required:** Yes (Admin)
- **Response:** `200 OK`

### 4. Create Coupon (Admin)

- **Endpoint:** `POST /api/coupons`
- **Description:** Create new discount coupon
- **Auth Required:** Yes (Admin)
- **Body:**

```json
{
  "code": "SAVE10",
  "description": "Save 10% on all orders",
  "discountType": "PERCENTAGE",
  "discountValue": 10,
  "minOrderAmount": 1000,
  "maxDiscountAmount": 5000,
  "validFrom": "2025-01-20T00:00:00Z",
  "validTo": "2025-12-31T23:59:59Z"
}
```

- **Response:** `201 Created`

### 5. Update Coupon (Admin)

- **Endpoint:** `PUT /api/coupons/:id`
- **Description:** Update coupon details
- **Auth Required:** Yes (Admin)
- **Body:** Same as create (all fields optional)
- **Response:** `200 OK`

### 6. Toggle Coupon Status (Admin)

- **Endpoint:** `PATCH /api/coupons/:id/toggle-status`
- **Description:** Activate/Deactivate coupon
- **Auth Required:** Yes (Admin)
- **Response:** `200 OK`

### 7. Delete Coupon (Admin)

- **Endpoint:** `DELETE /api/coupons/:id`
- **Description:** Delete coupon
- **Auth Required:** Yes (Admin)
- **Response:** `200 OK`

---

## Order Routes (`/api/orders`)

### 1. Create Order

- **Endpoint:** `POST /api/orders`
- **Description:** Create new order from cart
- **Auth Required:** Yes
- **Body:**

```json
{
  "addressId": "uuid",
  "couponId": "uuid (optional)"
}
```

- **Response:** `201 Created`

### 2. Get User Orders

- **Endpoint:** `GET /api/orders?page=1&limit=10`
- **Description:** Get authenticated user's orders
- **Auth Required:** Yes
- **Query Parameters:** `page`, `limit`
- **Response:** `200 OK`

### 3. Get Order by ID

- **Endpoint:** `GET /api/orders/:id`
- **Description:** Get specific order details
- **Auth Required:** Yes
- **Response:** `200 OK`

### 4. Cancel Order

- **Endpoint:** `PATCH /api/orders/:id/cancel`
- **Description:** Cancel pending order
- **Auth Required:** Yes
- **Response:** `200 OK`

### 5. Update Order Status (Admin)

- **Endpoint:** `PATCH /api/orders/:id/status`
- **Description:** Update order status
- **Auth Required:** Yes (Admin)
- **Body:**

```json
{
  "status": "SHIPPED"
}
```

- **Response:** `200 OK`

---

## Payment Routes (`/api/payments`)

### 1. Initiate Payment

- **Endpoint:** `POST /api/payments`
- **Description:** Initiate payment for order
- **Auth Required:** Yes
- **Body:**

```json
{
  "orderId": "uuid",
  "paymentMethod": "RAZORPAY"
}
```

- **Response:** `201 Created`

### 2. Get Payment by Order ID

- **Endpoint:** `GET /api/payments/order/:orderId`
- **Description:** Get payment details by order
- **Auth Required:** Yes
- **Response:** `200 OK`

### 3. Get Payment by ID

- **Endpoint:** `GET /api/payments/:id`
- **Description:** Get specific payment details
- **Auth Required:** Yes
- **Response:** `200 OK`

### 4. Verify Razorpay Payment

- **Endpoint:** `POST /api/payments/verify/razorpay`
- **Description:** Verify Razorpay payment signature
- **Auth Required:** Yes
- **Body:**

```json
{
  "orderId": "uuid",
  "razorpayOrderId": "order_id",
  "razorpayPaymentId": "payment_id",
  "razorpaySignature": "signature"
}
```

- **Response:** `200 OK`

### 5. Get All Payments (Admin)

- **Endpoint:** `GET /api/payments?page=1&limit=10`
- **Description:** Get all payments
- **Auth Required:** Yes (Admin)
- **Query Parameters:** `page`, `limit`
- **Response:** `200 OK`

### 6. Update Payment Status (Admin)

- **Endpoint:** `PATCH /api/payments/:id/status`
- **Description:** Update payment status
- **Auth Required:** Yes (Admin)
- **Body:**

```json
{
  "status": "COMPLETED"
}
```

- **Response:** `200 OK`

---

## Banner Routes (`/api/banners`)

### 1. Get Active Banners

- **Endpoint:** `GET /api/banners/active`
- **Description:** Get all active promotional banners
- **Response:** `200 OK`

### 2. Get Banner by ID

- **Endpoint:** `GET /api/banners/:id`
- **Description:** Get specific banner
- **Response:** `200 OK`

### 3. Get All Banners (Admin)

- **Endpoint:** `GET /api/banners?isActive=true`
- **Description:** Get all banners
- **Auth Required:** Yes (Admin)
- **Query Parameters:** `isActive` (optional)
- **Response:** `200 OK`

### 4. Create Banner (Admin)

- **Endpoint:** `POST /api/banners`
- **Description:** Create promotional banner
- **Auth Required:** Yes (Admin)
- **Body:**

```json
{
  "title": "Summer Sale",
  "imageUrl": "https://example.com/banner.jpg",
  "linkUrl": "https://example.com/summer-sale"
}
```

- **Response:** `201 Created`

### 5. Update Banner (Admin)

- **Endpoint:** `PUT /api/banners/:id`
- **Description:** Update banner details
- **Auth Required:** Yes (Admin)
- **Body:** Same as create (all fields optional)
- **Response:** `200 OK`

### 6. Toggle Banner Status (Admin)

- **Endpoint:** `PATCH /api/banners/:id/toggle-status`
- **Description:** Activate/Deactivate banner
- **Auth Required:** Yes (Admin)
- **Response:** `200 OK`

### 7. Delete Banner (Admin)

- **Endpoint:** `DELETE /api/banners/:id`
- **Description:** Delete banner
- **Auth Required:** Yes (Admin)
- **Response:** `200 OK`

---

## Order Return Routes (`/api/order-returns`)

### 1. Create Return Request

- **Endpoint:** `POST /api/order-returns`
- **Description:** Create product return request (order must be delivered)
- **Auth Required:** Yes
- **Body:**

```json
{
  "orderId": "uuid",
  "reason": "Product is damaged",
  "quantity": 1,
  "images": ["https://example.com/image1.jpg"]
}
```

- **Response:** `201 Created`

### 2. Get User Return Requests

- **Endpoint:** `GET /api/order-returns?page=1&limit=10`
- **Description:** Get user's return requests
- **Auth Required:** Yes
- **Query Parameters:** `page`, `limit`
- **Response:** `200 OK`

### 3. Get Return Request by ID

- **Endpoint:** `GET /api/order-returns/:id`
- **Description:** Get specific return request
- **Auth Required:** Yes
- **Response:** `200 OK`

### 4. Get All Return Requests (Admin)

- **Endpoint:** `GET /api/order-returns/all?page=1&limit=10&status=PENDING`
- **Description:** Get all return requests
- **Auth Required:** Yes (Admin)
- **Query Parameters:** `page`, `limit`, `status` (optional)
- **Response:** `200 OK`

### 5. Update Return Request (Admin)

- **Endpoint:** `PATCH /api/order-returns/:id`
- **Description:** Approve/Reject return request
- **Auth Required:** Yes (Admin)
- **Body:**

```json
{
  "status": "APPROVED",
  "refundAmount": 1000,
  "adminNotes": "Return approved"
}
```

- **Response:** `200 OK`

---

## Order Cancellation Routes (`/api/order-cancellations`)

### 1. Create Cancellation Request

- **Endpoint:** `POST /api/order-cancellations`
- **Description:** Request order cancellation (only pending/confirmed orders)
- **Auth Required:** Yes
- **Body:**

```json
{
  "orderId": "uuid",
  "reason": "Changed my mind"
}
```

- **Response:** `201 Created`

### 2. Get User Cancellation Requests

- **Endpoint:** `GET /api/order-cancellations?page=1&limit=10`
- **Description:** Get user's cancellation requests
- **Auth Required:** Yes
- **Query Parameters:** `page`, `limit`
- **Response:** `200 OK`

### 3. Get Cancellation Request by ID

- **Endpoint:** `GET /api/order-cancellations/:id`
- **Description:** Get specific cancellation request
- **Auth Required:** Yes
- **Response:** `200 OK`

### 4. Get All Cancellation Requests (Admin)

- **Endpoint:**
  `GET /api/order-cancellations/all?page=1&limit=10&status=PENDING`
- **Description:** Get all cancellation requests
- **Auth Required:** Yes (Admin)
- **Query Parameters:** `page`, `limit`, `status` (optional)
- **Response:** `200 OK`

### 5. Update Cancellation Request (Admin)

- **Endpoint:** `PATCH /api/order-cancellations/:id`
- **Description:** Approve/Reject cancellation request
- **Auth Required:** Yes (Admin)
- **Body:**

```json
{
  "status": "APPROVED",
  "refundAmount": 5000,
  "adminNotes": "Cancellation approved"
}
```

- **Response:** `200 OK`

---

## Error Handling

All errors are returned with appropriate HTTP status codes and error messages:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "statusCode": 400
}
```

### Common Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid authentication)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (resource already exists)
- `500` - Internal Server Error

---

## Authentication

Most routes require authentication via JWT tokens sent in cookies (httpOnly).

- **Access Token:** Valid for 15 minutes
- **Refresh Token:** Valid for 7 days

To authenticate requests, ensure cookies are sent with each request
automatically by the browser.

---

## Best Practices Implemented

✅ **Clean Code Architecture:**

- Separation of concerns (routes, controllers, services)
- Reusable middleware
- Consistent error handling

✅ **Data Validation:**

- Zod schema validation on all inputs
- Type-safe TypeScript throughout

✅ **Security:**

- Password hashing with bcrypt
- JWT authentication
- HttpOnly secure cookies
- Input sanitization

✅ **Scalability:**

- Pagination support on all list endpoints
- Indexed database queries
- Efficient database queries with proper relations

✅ **Documentation:**

- Clear endpoint descriptions
- Request/Response examples
- Error handling details

---

## Version

API Version: 1.0.0

Last Updated: January 20, 2025
