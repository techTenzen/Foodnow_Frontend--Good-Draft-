# FoodNow Backend API

A complete backend API for the FoodNow food delivery application built with Node.js, Express, Prisma, and Supabase PostgreSQL.

## 🚀 Features

- **Multi-role Authentication**: Customer, Restaurant Owner, and Admin roles
- **Restaurant Management**: Registration, approval workflow, menu management
- **Order System**: Complete order lifecycle from placement to delivery
- **Real-time Updates**: Order status tracking
- **Admin Panel**: User management, restaurant approvals, feedback handling
- **Security**: JWT authentication, bcrypt password hashing, role-based access control

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Architecture**: Spring Boot-like (Controllers → Services → Repositories)

## 📋 Prerequisites

- Node.js (v16 or higher)
- Supabase account and project
- npm or yarn

## 🔧 Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="your_supabase_database_url"
DIRECT_URL="your_supabase_direct_url"

# JWT
JWT_SECRET="your_super_secret_jwt_key_here_make_it_long_and_random"
JWT_EXPIRES_IN="24h"

# Server
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"

# Supabase (optional)
SUPABASE_URL="your_supabase_project_url"
SUPABASE_ANON_KEY="your_supabase_anon_key"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with test data
npm run db:seed
```

### 3. Start the Server

```bash
# Development mode
npm run server

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## 👥 Test Accounts

After seeding, you can use these test accounts:

- **Customer**: `customer@test.com` / `123`
- **Restaurant**: `kiranas@test.com` / `123`
- **Admin**: `admin@foodnow.com` / `admin123`

## 📚 API Documentation

### Authentication Endpoints

#### Register Customer
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91 9876543210"
}
```

#### Register Restaurant
```http
POST /api/auth/restaurant/register
Content-Type: application/json

{
  "restaurantName": "Amazing Restaurant",
  "ownerName": "John Doe",
  "email": "restaurant@example.com",
  "password": "password123",
  "phone": "+91 9876543210",
  "cuisineType": "Italian",
  "address": "123 Food Street",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "establishmentDate": "2020-01-15",
  "priceForTwo": 400
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Admin Login
```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@foodnow.com",
  "password": "admin123"
}
```

### Restaurant Endpoints

#### Get All Restaurants (Public)
```http
GET /api/restaurants?page=1&limit=10&search=pizza&cuisine=italian
```

#### Get Restaurant by ID (Public)
```http
GET /api/restaurants/:id
```

#### Get My Restaurant (Restaurant Owner)
```http
GET /api/restaurants/my/restaurant
Authorization: Bearer <token>
```

#### Update Restaurant Status (Restaurant Owner)
```http
PATCH /api/restaurants/my/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "isOpen": true,
  "acceptingOrders": true
}
```

### Menu Endpoints

#### Get Restaurant Menu (Public)
```http
GET /api/menu/restaurant/:restaurantId?category=Pizza&available=true
```

#### Create Menu Item (Restaurant Owner)
```http
POST /api/menu/my/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Margherita Pizza",
  "description": "Classic pizza with tomato and mozzarella",
  "price": 299,
  "image": "https://example.com/image.jpg",
  "category": "Pizza",
  "isVegetarian": true
}
```

#### Update Menu Item (Restaurant Owner)
```http
PUT /api/menu/my/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Pizza Name",
  "price": 349,
  "isAvailable": false
}
```

### Order Endpoints

#### Place Order (Customer)
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "restaurantId": "restaurant_id",
  "deliveryAddressId": "address_id",
  "items": [
    {
      "menuItemId": "item_id",
      "quantity": 2
    }
  ],
  "paymentMethod": "UPI",
  "specialInstructions": "Extra spicy"
}
```

#### Get My Orders (Customer)
```http
GET /api/orders/my/orders?page=1&limit=10&status=DELIVERED
Authorization: Bearer <token>
```

#### Get Restaurant Orders (Restaurant Owner)
```http
GET /api/orders/restaurant/orders?page=1&limit=10&status=PENDING
Authorization: Bearer <token>
```

#### Update Order Status (Restaurant Owner)
```http
PATCH /api/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "PREPARING",
  "estimatedDeliveryTime": "25-30 mins"
}
```

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /api/admin/dashboard/stats
Authorization: Bearer <admin_token>
```

#### Get Pending Restaurants
```http
GET /api/admin/restaurants/pending?page=1&limit=10
Authorization: Bearer <admin_token>
```

#### Approve Restaurant
```http
PATCH /api/admin/restaurants/:id/approve
Authorization: Bearer <admin_token>
```

#### Get All Users
```http
GET /api/admin/users?page=1&limit=10&role=CUSTOMER&search=john
Authorization: Bearer <admin_token>
```

### User Management Endpoints

#### Get User Addresses
```http
GET /api/users/addresses
Authorization: Bearer <token>
```

#### Create Address
```http
POST /api/users/addresses
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "HOME",
  "address": "123 Main Street",
  "landmark": "Near Metro Station",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "isDefault": true
}
```

### Feedback Endpoints

#### Submit Feedback (Customer)
```http
POST /api/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "REVIEW",
  "title": "Great food!",
  "message": "The food was delicious and delivered on time.",
  "rating": 5,
  "restaurantId": "restaurant_id",
  "orderId": "order_id"
}
```

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "role": "CUSTOMER|RESTAURANT_OWNER|ADMIN"
}
```

### Protected Routes
- All routes under `/api/users/*` require authentication
- Restaurant management routes require `RESTAURANT_OWNER` role
- Admin routes require `ADMIN` role
- Order placement requires `CUSTOMER` role

### Headers
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## 📊 Database Schema

### Key Entities
- **Users**: Customer, Restaurant Owner, Admin accounts
- **Restaurants**: Restaurant information and status
- **MenuItems**: Restaurant menu with categories
- **Orders**: Order details and status tracking
- **OrderItems**: Individual items in an order
- **Addresses**: User delivery addresses
- **Feedback**: Reviews and complaints

### Order Status Flow
```
PLACED → CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
                                    ↓
                               CANCELLED (only from PLACED/CONFIRMED)
```

### Restaurant Status Flow
```
PENDING → APPROVED/REJECTED
APPROVED → SUSPENDED (by admin)
```

## 🚨 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "errors": [] // For validation errors
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request / Validation Error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

## 🔄 Business Logic

### Restaurant Approval Workflow
1. Restaurant registers with business details
2. Status set to `PENDING`
3. Admin reviews and approves/rejects
4. Only `APPROVED` restaurants can login and appear to customers

### Order Processing
1. Customer places order with multiple items
2. System validates restaurant availability and menu items
3. Calculates totals (items + delivery + tax)
4. Creates order with `PLACED` status
5. Restaurant can update status through defined stages
6. Customer receives real-time updates

### Rating System
- Customers can rate orders (1-5 stars)
- Restaurant rating automatically calculated from all reviews
- Ratings affect restaurant visibility and ranking

## 🛡️ Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-based Access Control**: Granular permissions
- **Input Validation**: Comprehensive validation using express-validator
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **CORS Configuration**: Proper cross-origin setup

## 📈 Performance Considerations

- **Database Indexing**: Proper indexes on frequently queried fields
- **Pagination**: All list endpoints support pagination
- **Efficient Queries**: Optimized database queries with proper includes
- **Connection Pooling**: Prisma handles connection pooling automatically

## 🧪 Testing

The API includes comprehensive seed data for testing:
- Pre-configured test accounts for all roles
- Sample restaurant with menu items
- Sample orders with different statuses
- Sample feedback and reviews

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV="production"
DATABASE_URL="production_database_url"
JWT_SECRET="strong_production_secret"
FRONTEND_URL="https://your-frontend-domain.com"
```

### Health Check
```http
GET /health
```

Returns server status and timestamp for monitoring.

## 📝 Development Notes

### Architecture Pattern
The codebase follows Spring Boot-like architecture:
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic layer
- **Repositories**: Data access layer (Prisma)
- **Middleware**: Authentication, validation, error handling

### Code Organization
```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic
├── middleware/      # Auth, validation, error handling
├── routes/          # Route definitions
├── utils/           # Helper functions
├── config/          # Database and app configuration
└── database/        # Seed scripts
```

This backend provides a solid foundation for the FoodNow application with proper security, scalability, and maintainability considerations.