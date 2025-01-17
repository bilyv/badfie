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
  Link2,
  Building2,
  Receipt,
  PieChart,
  Lightbulb,
  ChevronDown,
  ChevronRight
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

const defaultMenuItems = [
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

export function AppSidebar() {
  const location = useLocation();
  const { openUpgradeDialog } = useUpgradeDialog();
  const [isEditing, setIsEditing] = useState(false);
  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
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
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 absolute right-4 top-16"
        onClick={() => setIsEditing(!isEditing)}
      >
        <Edit2 className="h-4 w-4" />
      </Button>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                'group' in item ? (
                  <Collapsible
                    key={item.group}
                    open={expandedGroups.includes(item.group)}
                    onOpenChange={() => toggleGroup(item.group)}
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.group}</span>
                        </div>
                        {expandedGroups.includes(item.group) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {item.items.map((subItem) => (
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
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
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
                )
              ))}
            </SidebarMenu>
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