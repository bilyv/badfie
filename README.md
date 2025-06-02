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

3. **Start development server**
   ```bash
   bun run dev
   ```

4. **Open your browser**
   ```
   http://localhost:8080
   ```

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
├── src/
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
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |

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