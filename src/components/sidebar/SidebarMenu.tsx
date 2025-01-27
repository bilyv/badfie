import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarMenuItemComponent } from "./SidebarMenuItem";
import { useState } from "react";
import type { MenuItem } from "@/lib/types";

interface SidebarMenuListProps {
  items: MenuItem[];
  isEditing: boolean;
}

export const SidebarMenuList = ({ items: initialItems, isEditing }: SidebarMenuListProps) => {
  const [menuItems, setMenuItems] = useState(initialItems);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(menuItems);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setMenuItems(newItems);
  };

  const renderMenuItem = (item: MenuItem) => {
    if ('group' in item) {
      return (
        <>
          <SidebarMenuItemComponent
            title={item.group}
            icon={item.icon}
            isEditing={isEditing}
          />
          {item.items?.map((subItem, subIndex) => (
            <SidebarMenuItemComponent
              key={subItem.title}
              {...subItem}
              isEditing={isEditing}
              className="ml-4"
            />
          ))}
        </>
      );
    }
    
    return (
      <SidebarMenuItemComponent
        {...item}
        isEditing={isEditing}
      />
    );
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
                key={'group' in item ? item.group : item.title}
                draggableId={'group' in item ? item.group : item.title}
                index={index}
                isDragDisabled={!isEditing}
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