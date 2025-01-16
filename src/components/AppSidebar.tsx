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
  Folder,
  Bell,
  Wrench,
  Bot,
  Edit2,
  X,
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
import { useState } from "react";
import { cn } from "@/lib/utils";

const defaultMenuItems = [
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
    title: "Connect",
    path: "/connect",
    icon: Link2,
  },
  {
    title: "Users",
    path: "/users",
    icon: Users,
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
    title: "Reminders",
    path: "/reminders",
    icon: Bell,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    title: "Docs Storage",
    path: "/docs-storage",
    icon: Folder,
  },
  {
    title: "AI Adviser",
    path: "/ai-adviser",
    icon: Bot,
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
  const [isEditing, setIsEditing] = useState(false);
  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    if (!isEditing) return;
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!isEditing || draggedItem === null) return;

    const newMenuItems = [...menuItems];
    const draggedItemContent = newMenuItems[draggedItem];
    newMenuItems.splice(draggedItem, 1);
    newMenuItems.splice(index, 0, draggedItemContent);
    setMenuItems(newMenuItems);
    setDraggedItem(index);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setMenuItems(menuItems.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Sidebar className="w-64 bg-background/75 dark:bg-gray-900/75 border-r border-gray-200 dark:border-gray-800">
      <SidebarHeader className="p-4 flex items-center justify-between text-sm font-semibold border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <span>Inventory Pro</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem 
                  key={item.title}
                  draggable={isEditing}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  className={cn(
                    isEditing && "cursor-move",
                    isEditing && "animate-[wiggle_0.3s_ease-in-out_infinite]"
                  )}
                >
                  <SidebarMenuButton 
                    asChild 
                    tooltip={item.title}
                    isActive={location.pathname === item.path}
                    className="h-10 text-sm transition-all duration-300 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-800 group"
                  >
                    <Link to={item.path} className="flex items-center gap-3 px-4">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-auto opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveItem(index);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
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
            className="gap-1 transition-all duration-300 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-800" 
            onClick={openUpgradeDialog}
          >
            <ArrowUp className="h-4 w-4" />
            <span>Upgrade</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}