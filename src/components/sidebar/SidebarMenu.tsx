
import { ChevronDown, ChevronRight, MinusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Draggable } from "react-beautiful-dnd";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { MenuItem, MenuGroup, SidebarMenuItem as TSidebarMenuItem } from "./types";

interface SidebarMenuComponentProps {
  item: TSidebarMenuItem;
  index: number;
  editMode: 'position' | 'disable' | null;
  expandedGroups: string[];
  toggleGroup: (groupName: string) => void;
  confirmDisable: (itemId: string) => void;
  location: { pathname: string };
}

export const SidebarMenuComponent = ({
  item,
  index,
  editMode,
  expandedGroups,
  toggleGroup,
  confirmDisable,
  location,
}: SidebarMenuComponentProps) => {
  if ('group' in item) {
    const groupItem = item as MenuGroup;
    return (
      <Collapsible
        key={groupItem.group}
        open={expandedGroups.includes(groupItem.group)}
        onOpenChange={() => toggleGroup(groupItem.group)}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 group ${editMode === 'position' ? 'animate-wiggle' : ''}`}
          >
            <div className="flex items-center gap-3">
              <groupItem.icon className="h-4 w-4" />
              <span>{groupItem.group}</span>
            </div>
            {expandedGroups.includes(groupItem.group) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {groupItem.items.map((subItem) => (
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
    );
  }

  const menuItem = item as MenuItem;
  return (
    <Draggable
      key={menuItem.id}
      draggableId={menuItem.id}
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
              isActive={location.pathname === menuItem.path}
              className={`transition-all duration-300 hover:scale-105 group ${editMode === 'position' ? 'animate-wiggle' : ''}`}
            >
              <Link to={menuItem.path} className="flex items-center justify-between w-full px-4">
                <div className="flex items-center gap-3">
                  <menuItem.icon className="h-4 w-4" />
                  <span>{menuItem.title}</span>
                </div>
                {editMode === 'disable' && (
                  <MinusCircle
                    className="h-4 w-4 text-destructive cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      confirmDisable(menuItem.id);
                    }}
                  />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>
      )}
    </Draggable>
  );
};
