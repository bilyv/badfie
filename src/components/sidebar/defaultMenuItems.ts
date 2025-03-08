
import { 
  LayoutDashboard, 
  ShoppingBag,
  ChartBar,
  DollarSign,
  Percent,
  FileText,
  Users,
  Settings,
  Package,
  Database,
  Folder,
  Bell,
  Wrench,
  Bot,
  Edit2,
  Link2,
  Building2,
  Receipt,
  PieChart,
  Lightbulb,
  Calendar,
  Clock,
  UserSquare
} from "lucide-react";

export const defaultMenuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    id: "dashboard"
  },
  {
    title: "Multi-Store",
    path: "/multi-store",
    icon: Building2,
    id: "multi-store"
  },
  {
    title: "Services",
    path: "/services",
    icon: Wrench,
    id: "services"
  },
  {
    title: "Client Management",
    path: "/clients",
    icon: UserSquare,
    id: "clients"
  },
  {
    title: "Appointments",
    path: "/appointments",
    icon: Calendar,
    id: "appointments"
  },
  {
    title: "Reminders",
    path: "/reminders",
    icon: Bell,
    id: "reminders"
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: DollarSign,
    id: "expenses"
  },
  {
    group: "Insights",
    icon: PieChart,
    id: "insights",
    items: [
      {
        title: "Reports",
        path: "/reports",
        icon: ChartBar,
        id: "reports"
      },
      {
        title: "AI Adviser",
        path: "/ai-adviser",
        icon: Lightbulb,
        id: "ai-adviser"
      },
    ],
  },
  {
    title: "Docs Storage",
    path: "/docs-storage",
    icon: Folder,
    id: "docs-storage"
  },
  {
    title: "Users",
    path: "/users",
    icon: Users,
    id: "users"
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
    id: "settings"
  },
];
