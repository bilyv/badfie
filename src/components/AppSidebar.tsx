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
  ChevronDown,
  ChevronRight,
  X,
  UserRound,
  GripVertical,
  MinusCircle
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";

interface MenuItem {
  title: string;
  path: string;
  icon: any;
  group?: string;
  items?: MenuItem[];
}

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
        icon: Bot,
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
  const [editMode, setEditMode] = useState<'position' | 'disable' | null>(null);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;

    const newItems = [...menuItems];
    const [draggedItem] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    
    setMenuItems(newItems);
  };

  const handleDisableItem = (index: number) => {
    setMenuItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Sidebar className="w-64 bg-background/60 backdrop-blur-sm dark:bg-gray-900/60 border-r border-gray-200 dark:border-gray-800 rounded-tr-xl rounded-br-xl transition-all duration-300">
      <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <UserRound className="h-8 w-8 text-primary" />
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 animate-neon-glow dark:animate-neon-glow-dark border-2 border-white dark:border-gray-900" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">Brian</span>
              <span className="text-xs text-muted-foreground">Workspace</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 transition-all duration-300 hover:scale-105"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setIsEditing(true);
                setEditMode('position');
              }}>
                <GripVertical className="mr-2 h-4 w-4" />
                Position
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setIsEditing(true);
                setEditMode('disable');
              }}>
                <MinusCircle className="mr-2 h-4 w-4" />
                Disable
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

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
                        className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 group ${editMode === 'position' || editMode === 'disable' ? 'animate-vibrate' : ''}`}
                        draggable={editMode === 'position'}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.group}</span>
                        </div>
                        <div className="flex items-center">
                          {editMode === 'disable' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 mr-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDisableItem(index);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                          {expandedGroups.includes(item.group) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {item.items?.map((subItem, subIndex) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={location.pathname === subItem.path}
                            className={`pl-9 transition-all duration-300 hover:scale-105 group ${editMode === 'position' || editMode === 'disable' ? 'animate-vibrate' : ''}`}
                            draggable={editMode === 'position'}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                          >
                            <Link to={subItem.path} className="flex items-center justify-between w-full pr-2">
                              <div className="flex items-center gap-3">
                                <subItem.icon className="h-4 w-4" />
                                <span>{subItem.title}</span>
                              </div>
                              {editMode === 'disable' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDisableItem(index);
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
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
                      className={`transition-all duration-300 hover:scale-105 group ${editMode === 'position' || editMode === 'disable' ? 'animate-vibrate' : ''}`}
                      draggable={editMode === 'position'}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      <Link to={item.path} className="flex items-center justify-between w-full px-4">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                        {editMode === 'disable' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDisableItem(index);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
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