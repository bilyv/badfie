
import { UserRound } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { defaultMenuItems } from "./sidebar/defaultMenuItems";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

export function AppSidebar() {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar className="w-64 bg-background/60 backdrop-blur-sm dark:bg-gray-900/60 border-r border-gray-200 dark:border-gray-800 rounded-tr-xl rounded-br-xl transition-all duration-300 flex flex-col h-screen">
      <SidebarHeader className="p-4 border-b border-gray-200/60 dark:border-gray-800/60 bg-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <div className="h-6 w-6 bg-primary rounded-sm"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Business Manager</span>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-grow overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {defaultMenuItems.map((item) => {
                if ('group' in item) {
                  return (
                    <Collapsible
                      key={item.id}
                      open={expandedGroups.includes(item.group)}
                      onOpenChange={() => toggleGroup(item.group)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
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
                          <SidebarMenuItem key={subItem.id}>
                            <SidebarMenuButton
                              asChild
                              className={`pl-9 transition-all duration-300 hover:scale-105 ${
                                isActive(subItem.path) ? 'bg-primary/10 text-primary' : ''
                              }`}
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
                  );
                }

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      className={`transition-all duration-300 hover:scale-105 ${
                        isActive(item.path) ? 'bg-primary/10 text-primary' : ''
                      }`}
                    >
                      <Link to={item.path} className="flex items-center gap-3 px-4">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200/60 dark:border-gray-800/60 sticky bottom-0 bg-background/60 backdrop-blur-sm dark:bg-gray-900/60 mt-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserRound className="h-8 w-8 text-primary" />
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 animate-neon-glow dark:animate-neon-glow-dark border-2 border-white dark:border-gray-900" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Brian Thompson</span>
            <span className="text-xs text-muted-foreground">Personal Workspace</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
