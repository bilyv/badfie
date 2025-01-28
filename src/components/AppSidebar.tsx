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
  Move,
  Ban
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
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

const SortableMenuItem = ({ item, isEditing, onRemove }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          className={`transition-all duration-300 hover:scale-105 group ${isEditing ? 'animate-wiggle' : ''}`}
        >
          <Link to={item.path} className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </div>
            {isEditing && (
              <X 
                className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemove(item.id);
                }}
              />
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </div>
  );
};

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'position' | 'disable' | null>(null);
  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <Sidebar className="w-64 bg-background/60 backdrop-blur-sm dark:bg-gray-900/60 border-r border-gray-200 dark:border-gray-800 rounded-tr-xl rounded-br-xl transition-all duration-300">
      <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-800 bg-transparent">
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
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => {
                setIsEditing(true);
                setEditMode('position');
              }}>
                <Move className="mr-2 h-4 w-4" />
                <span>Position</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setIsEditing(true);
                setEditMode('disable');
              }}>
                <Ban className="mr-2 h-4 w-4" />
                <span>Disable</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={menuItems.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {menuItems.map((item) => (
                    'group' in item ? (
                      <Collapsible
                        key={item.group}
                        open={expandedGroups.includes(item.group)}
                        onOpenChange={() => toggleGroup(item.group)}
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 group"
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
                            <SortableMenuItem
                              key={subItem.id}
                              item={subItem}
                              isEditing={isEditing}
                              onRemove={handleRemoveItem}
                            />
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SortableMenuItem
                        key={item.id}
                        item={item}
                        isEditing={isEditing}
                        onRemove={handleRemoveItem}
                      />
                    )
                  ))}
                </SortableContext>
              </DndContext>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
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
  );
}