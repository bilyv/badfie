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
  ChevronRight,
  X,
  UserRound,
  GripHorizontal,
  MinusCircle
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

const defaultMenuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    id: "dashboard"
  },
  {
    title: "Multi-Store",
    path: "/multi-store",
    icon: Building2,
    id: "multi-store"
  },
  {
    title: "Connect",
    path: "/connect",
    icon: Link2,
    id: "connect"
  },
  {
    title: "Products",
    path: "/products",
    icon: ShoppingBag,
    id: "products"
  },
  {
    title: "Services",
    path: "/services",
    icon: Wrench,
    id: "services"
  },
  {
    title: "Sales",
    path: "/sales",
    icon: Receipt,
    id: "sales"
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
      {
        title: "Expenses",
        path: "/expenses",
        icon: DollarSign,
        id: "expenses"
      },
      {
        title: "AI Adviser",
        path: "/ai-adviser",
        icon: Lightbulb,
        id: "ai-adviser"
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

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'position' | 'disable' | null>(null);
  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [itemToDisable, setItemToDisable] = useState<string | null>(null);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMenuItems(items);
  };

  const handleDisableItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => {
      if ('group' in item) {
        return {
          ...item,
          items: item.items.filter(subItem => subItem.id !== itemId)
        };
      }
      return item.id !== itemId;
    }));
    toast({
      title: "Tab disabled",
      description: "The selected tab has been removed from the sidebar.",
    });
    setItemToDisable(null);
  };

  const confirmDisable = (itemId: string) => {
    setItemToDisable(itemId);
  };

  return (
    <>
      <Sidebar className="w-64 bg-background/60 backdrop-blur-sm dark:bg-gray-900/60 border-r border-gray-200 dark:border-gray-800 rounded-tr-xl rounded-br-xl transition-all duration-300">
        <SidebarHeader className="p-4 border-b border-gray-200/60 dark:border-gray-800/60 bg-transparent backdrop-blur-sm">
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
            <div className="flex gap-2">
              {isEditing && (
                <ToggleGroup type="single" value={editMode || ''} onValueChange={(value) => setEditMode(value as 'position' | 'disable' | null)}>
                  <ToggleGroupItem value="position" aria-label="Position" className="h-8 w-8">
                    <GripHorizontal className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="disable" aria-label="Disable" className="h-8 w-8">
                    <MinusCircle className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 transition-all duration-300 hover:scale-105"
                onClick={() => {
                  setIsEditing(!isEditing);
                  setEditMode(null);
                }}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="sidebar-menu">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
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
                                  className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 group ${editMode === 'position' ? 'animate-wiggle' : ''}`}
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
                                  <Draggable
                                    key={subItem.id}
                                    draggableId={subItem.id}
                                    index={index}
                                    isDragDisabled={editMode !== 'position'}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <SidebarMenuItem>
                                          <SidebarMenuButton
                                            asChild
                                            isActive={location.pathname === subItem.path}
                                            className={`pl-9 transition-all duration-300 hover:scale-105 group ${editMode === 'position' ? 'animate-wiggle' : ''}`}
                                          >
                                            <Link to={subItem.path} className="flex items-center justify-between w-full pr-2">
                                              <div className="flex items-center gap-3">
                                                <subItem.icon className="h-4 w-4" />
                                                <span>{subItem.title}</span>
                                              </div>
                                              {editMode === 'disable' && (
                                                <MinusCircle
                                                  className="h-4 w-4 text-destructive cursor-pointer"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    confirmDisable(subItem.id);
                                                  }}
                                                />
                                              )}
                                            </Link>
                                          </SidebarMenuButton>
                                        </SidebarMenuItem>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          ) : (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                              isDragDisabled={editMode !== 'position'}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <SidebarMenuItem>
                                    <SidebarMenuButton
                                      asChild
                                      isActive={location.pathname === item.path}
                                      className={`transition-all duration-300 hover:scale-105 group ${editMode === 'position' ? 'animate-wiggle' : ''}`}
                                    >
                                      <Link to={item.path} className="flex items-center justify-between w-full px-4">
                                        <div className="flex items-center gap-3">
                                          <item.icon className="h-4 w-4" />
                                          <span>{item.title}</span>
                                        </div>
                                        {editMode === 'disable' && (
                                          <MinusCircle
                                            className="h-4 w-4 text-destructive cursor-pointer"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              confirmDisable(item.id);
                                            }}
                                          />
                                        )}
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                </div>
                              )}
                            </Draggable>
                          )
                        ))}
                        {provided.placeholder}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-gray-200/60 dark:border-gray-800/60">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full gap-2 bg-background/50 backdrop-blur-sm border-dashed hover:border-primary transition-all duration-300 hover:scale-105"
            onClick={() => navigate('/subscription')}
          >
            <ArrowUp className="h-4 w-4" />
            <span>Upgrade Plan</span>
          </Button>
        </SidebarFooter>
      </Sidebar>

      <AlertDialog open={!!itemToDisable} onOpenChange={() => setItemToDisable(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the tab from your sidebar. You can add it back later through the settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDisableItem(itemToDisable!)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
