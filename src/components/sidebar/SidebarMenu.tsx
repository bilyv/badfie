import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarMenuItemComponent } from "./SidebarMenuItem";
import { useState } from "react";
import type { MenuItem } from "@/lib/types";

interface SidebarMenuListProps {
  items: MenuItem[];
  isEditing: boolean;
  isDisabling: boolean;
  onDisableItem?: (title: string) => void;
}

export const SidebarMenuList = ({ 
  items: initialItems, 
  isEditing,
  isDisabling,
  onDisableItem 
}: SidebarMenuListProps) => {
  const [menuItems, setMenuItems] = useState(initialItems);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(menuItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setMenuItems(newItems);
  };

  const renderMenuItem = (item: MenuItem) => {
    if ('title' in item) {
      return (
        <SidebarMenuItemComponent
          title={item.title}
          path={item.path}
          icon={item.icon}
          isEditing={isEditing}
          isDisabling={isDisabling}
          onDisable={() => onDisableItem?.(item.title)}
        />
      );
    }
    return null;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sidebar-menu">
        {(provided) => (
          <SidebarMenu
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {menuItems.map((item, index) => (
              <Draggable
                key={'title' in item ? item.title : index.toString()}
                draggableId={'title' in item ? item.title : index.toString()}
                index={index}
                isDragDisabled={!isEditing || isDisabling}
              >
                {(provided, snapshot) => (
                  <SidebarMenuItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {renderMenuItem(item)}
                  </SidebarMenuItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </SidebarMenu>
        )}
      </Droppable>
    </DragDropContext>
  );
};