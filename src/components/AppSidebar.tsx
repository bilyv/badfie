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
  Link2
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
    title: "Connect",
    path: "/connect",
    icon: Link2,
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
    <Sidebar className="w-64">
      <SidebarHeader className="p-3 flex items-center gap-2 text-base font-semibold">
        <Package className="h-5 w-5" />
        <span>Inventory</span>
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
                    className="h-10 text-sm"
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex-1">
            <p className="font-medium">Business Account</p>
            <p className="text-muted-foreground text-xs">Pro features available</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1" onClick={openUpgradeDialog}>
            <ArrowUp className="h-4 w-4" />
            Upgrade
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}