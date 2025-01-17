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
  ChevronDown,
  ChevronUp,
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
    title: "Analytics",
    isFolder: true,
    icon: Folder,
    items: [
      {
        title: "Reports",
        path: "/reports",
        icon: FileText,
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
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const disabledTabs = [
  {
    title: "Advanced Analytics",
    icon: ChartBar,
    description: "Access detailed business analytics and insights"
  },
  {
    title: "Custom Reports",
    icon: FileText,
    description: "Create and customize your own reports"
  },
  {
    title: "AI Predictions",
    icon: Bot,
    description: "Get AI-powered business predictions"
  }
];

export function AppSidebar() {
  const location = useLocation();
  const { openUpgradeDialog } = useUpgradeDialog();
  const [isEditing, setIsEditing] = useState(false);
  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [selectedDisabledTab, setSelectedDisabledTab] = useState<string | null>(null);

  const toggleFolder = (folderTitle: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderTitle) 
        ? prev.filter(title => title !== folderTitle)
        : [...prev, folderTitle]
    );
  };

  const handleDisabledTabClick = (title: string) => {
    setSelectedDisabledTab(prev => prev === title ? null : title);
  };

  return (
    <Sidebar className="w-64 bg-background/75 dark:bg-gray-900/75 border-r border-gray-200 dark:border-gray-800 rounded-tr-xl rounded-br-xl">
      <SidebarHeader className="p-4 flex items-center justify-between text-sm font-semibold border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <span>Inventory Pro</span>
        </div>
      </SidebarHeader>
      
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

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between"
            onClick={() => setIsEditing(!isEditing)}
          >
            <span>Show Disabled Features</span>
            <Edit2 className="h-4 w-4" />
          </Button>

          {isEditing && (
            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              {disabledTabs.map((tab) => (
                <div key={tab.title} className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-3 transition-all duration-300",
                      selectedDisabledTab === tab.title && "scale-105"
                    )}
                    onClick={() => handleDisabledTabClick(tab.title)}
                  >
                    <tab.icon className="h-4 w-4" />
                    {selectedDisabledTab === tab.title ? (
                      <div className="text-left">
                        <p className="font-medium">{tab.title}</p>
                        <p className="text-xs text-muted-foreground">{tab.description}</p>
                      </div>
                    ) : (
                      <span>{tab.title}</span>
                    )}
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2" 
                onClick={openUpgradeDialog}
              >
                Upgrade to Pro
              </Button>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <div className="flex-1">
              <p className="font-medium">Business Account</p>
              <p className="text-muted-foreground text-xs">Pro features available</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}