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
  ArrowUp,
  Database,
  Folder
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useUpgradeDialog } from "@/hooks/use-upgrade-dialog";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Multi-Store",
    path: "/multi-store",
    icon: Database,
  },
  {
    title: "Products",
    path: "/products",
    icon: ShoppingBag,
  },
  {
    title: "Sales",
    path: "/sales",
    icon: ChartBar,
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: DollarSign,
  },
  {
    title: "Tax",
    path: "/tax",
    icon: Percent,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    title: "Users",
    path: "/users",
    icon: Users,
  },
  {
    title: "Docs Storage",
    path: "/docs-storage",
    icon: Folder,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { openUpgradeDialog } = useUpgradeDialog();

  return (
    <Sidebar className="w-64 backdrop-blur-sm bg-white/75 dark:bg-gray-900/75 border-r border-gray-200 dark:border-gray-800 transition-all duration-300">
      <SidebarHeader className="p-4 flex items-center gap-2 text-sm font-semibold border-b border-gray-200 dark:border-gray-800">
        <Package className="h-5 w-5 text-primary" />
        <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Inventory Pro
        </span>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={location.pathname === item.path}
                    className="h-10 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 group"
                  >
                    <Link to={item.path} className="flex items-center gap-3 px-4">
                      <item.icon className="h-4 w-4 transition-colors group-hover:text-primary" />
                      <span className="transition-colors group-hover:text-primary">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex-1">
            <p className="font-medium">Business Account</p>
            <p className="text-muted-foreground text-xs">Pro features available</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 group" 
            onClick={openUpgradeDialog}
          >
            <ArrowUp className="h-4 w-4 transition-colors group-hover:text-primary" />
            <span className="transition-colors group-hover:text-primary">Upgrade</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}