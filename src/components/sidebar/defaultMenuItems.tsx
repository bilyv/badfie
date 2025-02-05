
import { 
  LayoutDashboard, 
  ShoppingBag,
  ChartBar,
  DollarSign,
  Percent,
  Bell,
  Users,
  Settings,
  Bot,
  Link2,
  Building2,
  Receipt,
  PieChart,
  Lightbulb,
  Wrench,
  Folder,
} from "lucide-react";
import { SidebarMenuItem } from "./types";

export const defaultMenuItems: SidebarMenuItem[] = [
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
    title: "Connect",
    path: "/connect",
    icon: Link2,
    id: "connect"
  },
  {
    title: "Products",
    path: "/products",
    icon: ShoppingBag,
    id: "products"
  },
  {
    title: "Services",
    path: "/services",
    icon: Wrench,
    id: "services"
  },
  {
    title: "Sales",
    path: "/sales",
    icon: Receipt,
    id: "sales"
  },
  {
    title: "Tax",
    path: "/tax",
    icon: Percent,
    id: "tax"
  },
  {
    title: "Reminders",
    path: "/reminders",
    icon: Bell,
    id: "reminders"
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
        title: "Expenses",
        path: "/expenses",
        icon: DollarSign,
        id: "expenses"
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
