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
  MinusCircle
} from "lucide-react";
import type { LucideProps } from 'lucide-react'; // Add this import for LucideProps
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
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type BaseMenuItem = {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

type RegularMenuItem = BaseMenuItem & {
  title: string;
  path: string;
}

type GroupMenuItem = BaseMenuItem & {
  group: string;
  items: RegularMenuItem[];
}

type MenuItem = RegularMenuItem | GroupMenuItem;

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
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [isReordering, setIsReordering] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    
    if (active && over && active.id !== over.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex(item => 
          'title' in item ? item.title === active.id : item.group === active.id
        );
        const newIndex = items.findIndex(item => 
          'title' in item ? item.title === over.id : item.group === over.id
        );
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const SortableMenuItem = ({ item }: { item: MenuItem }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({
      id: 'title' in item ? item.title : item.group
    });
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    if ('title' in item) {
      return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={location.pathname === item.path}
              className={`transition-all duration-300 hover:scale-105 group ${isReordering || isDisabling ? 'animate-wiggle' : ''}`}
            >
              <Link to={item.path} className="flex items-center justify-between w-full px-4">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                {isDisabling && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuItems(prev => prev.filter(menuItem => 
                        'title' in menuItem ? menuItem.title !== item.title : true
                      ));
                    }}
                  >
                    <MinusCircle className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
      );
    }

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Collapsible
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
              <SidebarMenuItem key={subItem.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === subItem.path}
                  className="pl-9 transition-all duration-300 hover:scale-105 group"
                >
                  <Link to={subItem.path} className="flex items-center justify-between w-full pr-2">
                    <div className="flex items-center gap-3">
                      <subItem.icon className="h-4 w-4" />
                      <span>{subItem.title}</span>
                    </div>
                    {isDisabling && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.preventDefault();
                          setMenuItems(prev => {
                            return prev.map(menuItem => {
                              if ('group' in menuItem && menuItem.group === item.group) {
                                return {
                                  ...menuItem,
                                  items: menuItem.items.filter(i => i.title !== subItem.title)
                                };
                              }
                              return menuItem;
                            });
                          });
                        }}
                      >
                        <MinusCircle className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  return (
    <Sidebar className="w-64 bg-background/40 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 rounded-tr-xl rounded-br-xl transition-all duration-300">
      <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-800 bg-background/40 backdrop-blur-md">
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
                setIsReordering(!isReordering);
                setIsDisabling(false);
              }}>
                <Move className="h-4 w-4 mr-2" />
                Position
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setIsDisabling(!isDisabling);
                setIsReordering(false);
              }}>
                <MinusCircle className="h-4 w-4 mr-2" />
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={menuItems.map(item => 'title' in item ? item.title : item.group)}
                  strategy={verticalListSortingStrategy}
                >
                  {menuItems.map((item) => (
                    <SortableMenuItem key={'title' in item ? item.title : item.group} item={item} />
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
