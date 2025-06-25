# DigitalStock Backend API

A robust Node.js/TypeScript backend API for the DigitalStock restaurant management system, built with Express.js and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Inventory Management**: Complete stock tracking with low-stock alerts
- **Sales Processing**: Transaction handling with automatic stock updates
- **Expense Tracking**: Comprehensive expense management and categorization
- **Reporting & Analytics**: Detailed business reports and insights
- **User Management**: Multi-role user system (Admin, Manager, Staff, User)
- **Supplier Management**: Vendor tracking and management
- **Category Management**: Product categorization system

## 🛠️ Tech Stack

- **Runtime**: Node.js with Bun
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.ts      # Main config
│   │   └── database.ts   # Database connection
│   ├── controllers/      # Route controllers (future)
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # Authentication middleware
│   │   ├── errorHandler.ts # Error handling
│   │   └── rateLimiter.ts # Rate limiting
│   ├── routes/           # API routes
│   │   ├── auth.ts       # Authentication routes
│   │   ├── users.ts      # User management
│   │   ├── inventory.ts  # Inventory management
│   │   ├── sales.ts      # Sales processing
│   │   ├── expenses.ts   # Expense tracking
│   │   ├── reports.ts    # Reports and analytics
│   │   ├── categories.ts # Category management
│   │   └── suppliers.ts  # Supplier management
│   ├── database/         # Database related files
│   │   ├── main.sql      # Main schema file
│   │   ├── schemas/      # Individual table schemas
│   │   ├── migrate.ts    # Migration script
│   │   └── seed.ts       # Seeding script
│   └── index.ts          # Main server file
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Bun package manager
- PostgreSQL (v12 or higher)

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=digitalstock
   DB_USER=postgres
   DB_PASSWORD=your_password_here

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here

   # Server Configuration
   PORT=3001
   ```

4. **Ensure PostgreSQL database exists**
   Your database "saas" should already be available with:
   - Host: localhost:5432
   - Database: saas
   - Username: postgres
   - Password: 7878

5. **Run database migrations**
   ```bash
   bun run db:migrate
   ```

6. **Seed the database (optional)**
   ```bash
   bun run db:seed
   ```

7. **Start the development server**
   ```bash
   bun run dev
   ```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api/v1
```

### Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user profile
- `PUT /auth/change-password` - Change password

#### Users (Admin/Manager only)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user (Admin only)
- `PUT /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)
- `GET /users/stats/overview` - Get user statistics

#### Inventory
- `GET /inventory` - Get all inventory items
- `GET /inventory/:id` - Get inventory item by ID
- `POST /inventory` - Create new inventory item
- `PUT /inventory/:id` - Update inventory item
- `DELETE /inventory/:id` - Delete inventory item
- `POST /inventory/stock-movement` - Record stock movement

#### Sales
- `GET /sales` - Get all sales
- `GET /sales/:id` - Get sale by ID
- `POST /sales` - Create new sale

#### Expenses
- `GET /expenses` - Get all expenses
- `GET /expenses/:id` - Get expense by ID
- `POST /expenses` - Create new expense
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense
- `GET /expenses/stats/summary` - Get expense statistics

#### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /categories/stats/overview` - Get category statistics

#### Suppliers
- `GET /suppliers` - Get all suppliers
- `GET /suppliers/:id` - Get supplier by ID
- `POST /suppliers` - Create new supplier
- `PUT /suppliers/:id` - Update supplier
- `DELETE /suppliers/:id` - Delete supplier

#### Reports
- `GET /reports/sales` - Get sales report
- `GET /reports/inventory` - Get inventory report
- `GET /reports/expenses` - Get expenses report
- `GET /reports/profit-loss` - Get profit & loss report

### Default User Accounts (after seeding)

- **Admin**: `admin@digitalstock.com` / `admin123456`
- **Manager**: `manager@digitalstock.com` / `manager123456`
- **Staff**: `staff@digitalstock.com` / `staff123456`

## 🗄️ Database Schema

The system uses PostgreSQL with the following main tables:

- **users** - User accounts and authentication
- **categories** - Product categories
- **suppliers** - Vendor/supplier information
- **inventory** - Stock and product management
- **stock_movements** - Inventory movement tracking
- **sales** - Sales transactions
- **sale_items** - Individual items in sales
- **expenses** - Expense tracking
- **reports** - Generated reports

## 🔧 Available Scripts

```bash
# Development
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server

# Database
bun run db:migrate       # Run database migrations
bun run db:seed          # Seed database with sample data
bun run db:reset         # Reset database (drop all tables)

# Utilities
bun run lint             # Run ESLint
bun run test             # Run tests (when implemented)
```

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** using bcryptjs
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configurable origins
- **Helmet** for security headers
- **Input Validation** using Zod schemas
- **SQL Injection Protection** via parameterized queries

## 🚀 Deployment

1. **Build the application**
   ```bash
   bun run build
   ```

2. **Set production environment variables**
   ```bash
   NODE_ENV=production
   ```

3. **Start the production server**
   ```bash
   bun run start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.
