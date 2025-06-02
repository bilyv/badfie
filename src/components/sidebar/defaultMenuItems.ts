
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
  Receipt,
  PieChart,
  Contact,
  Wine,
  ChefHat
} from "lucide-react";

export const defaultMenuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    id: "dashboard"
  },
  {
    title: "Products",
    path: "/products",
    icon: ShoppingBag,
    id: "products"
  },
  {
    title: "Contacts",
    path: "/contacts",
    icon: Contact,
    id: "contacts"
  },
  {
    title: "Sales",
    path: "/sales",
    icon: Receipt,
    id: "sales"
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: DollarSign,
    id: "expenses"
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
    title: "Bar Management",
    path: "/bar-management",
    icon: Wine,
    id: "bar-management"
  },
  {
    title: "Kitchen Management",
    path: "/kitchen-management",
    icon: ChefHat,
    id: "kitchen-management"
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
