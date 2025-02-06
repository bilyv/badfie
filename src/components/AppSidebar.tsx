
import { ArrowUp } from "lucide-react";
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
import { useState } from "react";
import { defaultMenuItems } from "./sidebar/defaultMenuItems";
import { SidebarHeader as CustomSidebarHeader } from "./sidebar/SidebarHeader";
import { DisableItemDialog } from "./sidebar/DisableItemDialog";
import { SidebarMenuList } from "./sidebar/SidebarMenuList";

export function AppSidebar() {
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'position' | 'disable' | null>(null);
  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [itemToDisable, setItemToDisable] = useState<string | null>(null);
  const navigate = useNavigate();

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
      <Sidebar className="w-64 bg-background/60 backdrop-blur-sm dark:bg-gray-900/60 border-r border-gray-200 dark:border-gray-800 rounded-tr-xl rounded-br-xl transition-all duration-300">
        <SidebarHeader className="p-4 border-b border-gray-200/60 dark:border-gray-800/60 bg-transparent backdrop-blur-sm">
          <CustomSidebarHeader 
            isEditing={isEditing}
            editMode={editMode}
            setEditMode={setEditMode}
            setIsEditing={setIsEditing}
          />
        </SidebarHeader>

        <SidebarContent>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="sidebar-menu">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenuList
                        menuItems={menuItems}
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

      <DisableItemDialog 
        itemToDisable={itemToDisable}
        setItemToDisable={setItemToDisable}
        handleDisableItem={handleDisableItem}
      />
    </>
  );
}
