import {
  LayoutDashboard,
  ShoppingBag,
  ChartBar,
  DollarSign,
  Percent,
  Users,
  Settings,
  Folder,
  Bell,
  Wrench,
  Lightbulb,
  Link2,
  Building2,
  Receipt,
  PieChart,
} from "lucide-react";
import { MenuItem } from "./types";

export const defaultMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Multi-Store",
    path: "/multi-store",
    icon: Building2,
  },
  {
    title: "Connect",
    path: "/connect",
    icon: Link2,
  },
  {
    title: "Products",
    path: "/products",
    icon: ShoppingBag,
  },
  {
    title: "Services",
    path: "/services",
    icon: Wrench,
  },
  {
    title: "Sales",
    path: "/sales",
    icon: Receipt,
  },
  {
    title: "Tax",
    path: "/tax",
    icon: Percent,
  },
  {
    title: "Reminders",
    path: "/reminders",
    icon: Bell,
  },
  {
    group: "Insights",
    icon: PieChart,
    items: [
      {
        title: "Reports",
        path: "/reports",
        icon: ChartBar,
      },
      {
        title: "Expenses",
        path: "/expenses",
        icon: DollarSign,
      },
      {
        title: "AI Adviser",
        path: "/ai-adviser",
        icon: Lightbulb,
      },
    ],
  },
  {
    title: "Docs Storage",
    path: "/docs-storage",
    icon: Folder,
  },
  {
    title: "Users",
    path: "/users",
    icon: Users,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];