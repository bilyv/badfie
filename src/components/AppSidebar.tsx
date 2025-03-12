
import { UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useState, useEffect } from "react";
import { defaultMenuItems } from "./sidebar/defaultMenuItems";
import { SidebarHeader as CustomSidebarHeader } from "./sidebar/SidebarHeader";
import { DisableItemDialog } from "./sidebar/DisableItemDialog";
import { SidebarMenuList } from "./sidebar/SidebarMenuList";

interface AppSidebarProps {
  mode?: "product" | "service";
}

export function AppSidebar({ mode = "product" }: AppSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'position' | 'disable' | null>(null);
  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  const [filteredMenuItems, setFilteredMenuItems] = useState(defaultMenuItems);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [itemToDisable, setItemToDisable] = useState<string | null>(null);

  // Update sidebar menu items based on mode
  useEffect(() => {
    if (mode === "product") {
      setFilteredMenuItems(menuItems.filter(item => {
        if ('id' in item) {
          // Keep items that don't have a mode specified, or have mode="product"
          return !item.mode || item.mode === 'product';
        }
        return true;
      }));
    } else {
      setFilteredMenuItems(menuItems.filter(item => {
        if ('id' in item) {
          // Keep items that don't have a mode specified, or have mode="service"
          return !item.mode || item.mode === 'service';
        }
        return true;
      }));
    }
  }, [mode, menuItems]);

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
    setItemToDisable(null);
  };

  return (
    <>
      <Sidebar className="w-64 bg-background/60 backdrop-blur-sm dark:bg-gray-900/60 border-r border-gray-200 dark:border-gray-800 rounded-tr-xl rounded-br-xl transition-all duration-300 flex flex-col h-screen">
        <SidebarHeader className="p-4 border-b border-gray-200/60 dark:border-gray-800/60 bg-transparent backdrop-blur-sm">
          <CustomSidebarHeader 
            isEditing={isEditing}
            editMode={editMode}
            setEditMode={setEditMode}
            setIsEditing={setIsEditing}
          />
        </SidebarHeader>

        <SidebarContent className="flex-grow overflow-y-auto">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="sidebar-menu">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenuList
                        menuItems={filteredMenuItems}
                        editMode={editMode}
                        expandedGroups={expandedGroups}
                        toggleGroup={toggleGroup}
                        setItemToDisable={setItemToDisable}
                      />
                      {provided.placeholder}
                    </SidebarGroupContent>
                  </SidebarGroup>
                </div>
              )}
            </Droppable>
          </DragDropContext>
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

      <DisableItemDialog 
        itemToDisable={itemToDisable}
        setItemToDisable={setItemToDisable}
        handleDisableItem={handleDisableItem}
      />
    </>
  );
}
