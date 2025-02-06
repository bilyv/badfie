
import { Link } from "react-router-dom";
import { MinusCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem as BaseSidebarMenuItem,
} from "@/components/ui/sidebar";

interface MenuGroupProps {
  item: {
    group: string;
    icon: any;
    items: any[];
  };
  editMode: 'position' | 'disable' | null;
  expandedGroups: string[];
  toggleGroup: (groupName: string) => void;
  confirmDisable: (itemId: string) => void;
}

export function SidebarMenuGroup({
  item,
  editMode,
  expandedGroups,
  toggleGroup,
  confirmDisable,
}: MenuGroupProps) {
  return (
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
        {item.items.map((subItem: any) => (
          <BaseSidebarMenuItem key={subItem.id}>
            <SidebarMenuButton
              asChild
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
          </BaseSidebarMenuItem>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
