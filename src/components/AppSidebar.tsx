import { 
  LayoutDashboard, 
  ShoppingBag, 
  ChartBar, 
  DollarSign, 
  Percent, 
  FileText, 
  Users,
  Settings,
  Database,
  Folder,
  Bell,
  Wrench,
  Bot,
  Edit2,
  ChevronDown,
  ChevronUp,
  Package,
  Store,
  Brain
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
    icon: Store,
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
    title: "Insights",
    isFolder: true,
    icon: Brain,
    items: [
      {
        title: "Reports",
        path: "/reports",
        icon: FileText,
      },
      {
        title: "Expenses",
        path: "/expenses",
        icon: DollarSign,
      },
      {
        title: "AI Adviser",
        path: "/ai-adviser",
        icon: Bot,
      }
    ]
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
  const location = useLocation();
  const { openUpgradeDialog } = useUpgradeDialog();
  const [isEditing, setIsEditing] = useState(false);
  const [menuItems] = useState(defaultMenuItems);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const toggleFolder = (folderTitle: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderTitle) 
        ? prev.filter(title => title !== folderTitle)
        : [...prev, folderTitle]
    );
  };

  return (
    <Sidebar className="w-64 bg-background/75 dark:bg-gray-900/75 border-r border-gray-200 dark:border-gray-800 rounded-tr-xl rounded-br-xl">
      <SidebarHeader className="p-4 flex items-center justify-between text-sm font-semibold border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <span>Inventory Pro</span>
        </div>
      </SidebarHeader>

      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-between"
          onClick={() => setIsEditing(!isEditing)}
        >
          <span>Show Disabled Features</span>
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <div key={item.title}>
                  {item.isFolder ? (
                    <div className="space-y-1">
                      <SidebarMenuItem>
                        <Button
                          variant="ghost"
                          className="w-full justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                          onClick={() => toggleFolder(item.title)}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          {expandedFolders.includes(item.title) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </SidebarMenuItem>
                      {expandedFolders.includes(item.title) && item.items?.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton 
                            asChild 
                            isActive={location.pathname === subItem.path}
                            className="pl-9 transition-all duration-300 hover:scale-105"
                          >
                            <Link to={subItem.path} className="flex items-center gap-3">
                              <subItem.icon className="h-4 w-4" />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location.pathname === item.path}
                        className="transition-all duration-300 hover:scale-105"
                      >
                        <Link to={item.path} className="flex items-center gap-3 px-4">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-gray-200 dark:border-gray-800">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full bg-primary/5 hover:bg-primary/10 border-primary/10"
          onClick={openUpgradeDialog}
        >
          Upgrade to Pro
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}