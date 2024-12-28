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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    const fetchBusinessName = async () => {
      try {
        const { data: businesses, error } = await supabase
          .from('businesses')
          .select('name')
          .limit(1)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching business:', error);
          return;
        }
        
        if (businesses) {
          setBusinessName(businesses.name);
        }
      } catch (error) {
        console.error('Error in fetchBusinessName:', error);
      }
    };

    fetchBusinessName();
  }, []);

  return (
    <Sidebar className="w-64">
      <SidebarHeader className="p-2 flex items-center gap-2 text-sm font-semibold">
        <Package className="h-4 w-4" />
        <span>{businessName || "Inventory"}</span>
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
                    className="h-8 text-sm"
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