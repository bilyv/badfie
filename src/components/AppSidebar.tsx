import { 
  LayoutDashboard, 
  ShoppingBag,
  ChartBar,
  DollarSign,
  Percent,
  Users,
  Settings,
  Bell,
  Bot,
  Link2,
  Building2,
  Receipt,
  Wrench,
  Folder,
  ArrowUp,
  LineChart
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useUpgradeDialog } from "@/hooks/use-upgrade-dialog";
import { useState } from "react";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuList } from "./sidebar/SidebarMenu";
import type { MenuItem } from "@/lib/types";

const defaultMenuItems: MenuItem[] = [
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
    icon: LineChart,
    items: [
      {
        title: "Reports",
        path: "/reports",
        icon: ChartBar,
      },
      {
        title: "AI Adviser",
        path: "/ai-adviser",
        icon: Bot,
      }
    ]
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: DollarSign,
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

export function AppSidebar() {
  const { openUpgradeDialog } = useUpgradeDialog();
  const [isEditing, setIsEditing] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [menuItems, setMenuItems] = useState(defaultMenuItems);

  const handleDisableItem = (itemTitle: string) => {
    setMenuItems(prev => prev.filter(item => 
      'title' in item && item.title !== itemTitle
    ));
  };

  const handlePositionToggle = () => {
    setIsEditing(true);
    setIsDisabling(false);
  };

  const handleDisableToggle = () => {
    setIsDisabling(prev => !prev);
    setIsEditing(false);
  };

  return (
    <Sidebar className="w-64 bg-background/75 dark:bg-gray-900/75 border-r border-gray-200 dark:border-gray-800 rounded-tr-xl rounded-br-xl">
      <SidebarHeader 
        isEditing={isEditing}
        isDisabling={isDisabling}
        onEditToggle={() => setIsEditing(!isEditing)}
        onPositionToggle={handlePositionToggle}
        onDisableToggle={handleDisableToggle}
      />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuList 
              items={menuItems}
              isEditing={isEditing}
              isDisabling={isDisabling}
              onDisableItem={handleDisableItem}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full gap-2 bg-background/50 backdrop-blur-sm border-dashed hover:border-primary transition-all duration-300 hover:scale-105"
          onClick={openUpgradeDialog}
        >
          <ArrowUp className="h-4 w-4" />
          <span>Upgrade Plan</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}