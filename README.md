# 🍽️ DigitalStock

> **Modern Restaurant Management System**
> A comprehensive solution for inventory management, sales tracking, and restaurant operations built with cutting-edge web technologies.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

### 📊 **Dashboard & Analytics**
- Real-time restaurant metrics and KPIs
- Interactive charts and data visualization
- Performance tracking and insights

### 🏪 **Inventory Management**
- Product catalog with detailed information
- Stock level monitoring and alerts
- Supplier and vendor management

### 💰 **Sales & Financial Tracking**
- Sales transaction recording
- Revenue analytics and reporting
- Expense tracking and categorization

### 👥 **User & Contact Management**
- Customer relationship management
- Staff and user role management
- Contact information and communication

### 🍺 **Bar & Kitchen Operations**
- Bar inventory and drink management
- Kitchen stock and ingredient tracking
- Recipe and menu management

### 📋 **Additional Features**
- Document storage and management
- Reminder and notification system
- Tax calculation and reporting
- Subscription and billing management

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Bun** (recommended) - [Install Bun](https://bun.sh/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd digitalstock
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up the backend** (see Backend Setup section below)

4. **Start development server**
   ```bash
   bun run dev
   ```

   Or start both frontend and backend:
   ```bash
   bun run dev:full
   ```

5. **Open your browser**
   ```
   Frontend: http://localhost:8080
   Backend API: http://localhost:3001
   ```

---

## 🗄️ Backend Setup

The backend is a separate Node.js/TypeScript API server with PostgreSQL database.

### Prerequisites
- PostgreSQL (v12 or higher)
- Node.js (v18 or higher)
- Bun package manager

### Setup Steps

1. **Ensure your PostgreSQL database exists:**
   Your database "saas" should already be available with the following credentials:
   - Host: localhost
   - Port: 5432
   - Database: saas
   - Username: postgres
   - Password: 7878

2. **Install backend dependencies**:
   ```bash
   bun run install:backend
   ```

3. **Configure environment variables**:
   ```bash
   cd backend
   cp .env.example .env
   ```

   The `.env` file is already configured with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=saas
   DB_USER=postgres
   DB_PASSWORD=7878
   JWT_SECRET=digitalstock_super_secret_jwt_key_2024_restaurant_management_system
   ```

4. **Run database migrations**:
   ```bash
   cd backend
   bun run db:migrate
   ```

5. **Seed the database** (optional):
   ```bash
   cd backend
   bun run db:seed
   ```

### Default User Accounts (after seeding)
- **Admin**: `admin@digitalstock.com` / `admin123456`
- **Manager**: `manager@digitalstock.com` / `manager123456`
- **Staff**: `staff@digitalstock.com` / `staff123456`

For detailed backend documentation, see [backend/README.md](backend/README.md).

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components

### **State Management & Data**
- **TanStack Query** - Powerful data synchronization
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### **UI & UX**
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Recharts** - Responsive chart library
- **Next Themes** - Dark/light mode support

---

## 📁 Project Structure

```
digitalstock/
├── src/                    # Frontend source code
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (shadcn/ui)
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   ├── products/       # Product management components
│   │   └── sidebar/        # Navigation components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and types
│   └── main.tsx           # Application entry point
├── backend/                # Backend API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── database/       # Database schemas and migrations
│   │   └── index.ts        # Main server file
│   ├── package.json        # Backend dependencies
│   └── README.md          # Backend documentation
├── public/                 # Static assets
└── package.json           # Frontend dependencies and scripts
```

---

## 🔧 Available Scripts

### Frontend & Full Stack
| Command | Description |
|---------|-------------|
| `bun run dev` | Start frontend development server |
| `bun run build` | Build frontend for production |
| `bun run preview` | Preview frontend production build |
| `bun run dev:full` | Start both frontend and backend servers |
| `bun run backend:dev` | Start backend development server |
| `bun run backend:build` | Build backend for production |
| `bun run backend:start` | Start backend production server |
| `bun run install:backend` | Install backend dependencies |
| `bun run lint` | Run ESLint on frontend |

### Backend Only (from backend/ directory)
| Command | Description |
|---------|-------------|
| `bun run dev` | Start backend development server |
| `bun run build` | Build backend for production |
| `bun run start` | Start backend production server |
| `bun run db:migrate` | Run database migrations |
| `bun run db:seed` | Seed database with sample data |
| `bun run db:reset` | Reset database (drop all tables) |
| `bun run lint` | Run ESLint on backend |

---

## 🎨 Design System

DigitalStock uses a modern design system built on:

- **Color Palette**: Carefully crafted dark/light themes
- **Typography**: Outfit font family for clean readability
- **Components**: Consistent, accessible UI components
- **Responsive Design**: Mobile-first approach
- **Animations**: Subtle, meaningful motion design

---

## 🔐 Authentication

Currently implements a mock authentication system using localStorage for development purposes. Features include:

- Login/Register forms with validation
- Password reset functionality
- Session management
- Protected routes

---

## 📱 Responsive Design

DigitalStock is fully responsive and optimized for:

- 📱 **Mobile devices** (320px+)
- 📱 **Tablets** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large screens** (1440px+)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">
  <p>Made with ❤️ for restaurant management</p>
  <p>
    <a href="#-digitalstock">Back to top</a>
  </p>
</div>