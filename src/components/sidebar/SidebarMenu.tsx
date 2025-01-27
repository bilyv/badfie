import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarMenuItemComponent } from "./SidebarMenuItem";
import { useState } from "react";

interface MenuItem {
  title: string;
  path: string;
  icon: any;
  group?: string;
  items?: MenuItem[];
}

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
                key={item.title}
                draggableId={item.title}
                index={index}
                isDragDisabled={!isEditing}
              >
                {(provided, snapshot) => (
                  <SidebarMenuItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <SidebarMenuItemComponent
                      title={item.title}
                      path={item.path}
                      icon={item.icon}
                      isEditing={isEditing}
                      isDragging={snapshot.isDragging}
                    />
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