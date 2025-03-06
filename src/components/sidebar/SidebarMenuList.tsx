
import { SidebarMenu } from "@/components/ui/sidebar";
import { Draggable } from 'react-beautiful-dnd';
import { SidebarMenuItemComponent } from "./SidebarMenuItem";

interface SidebarMenuListProps {
  menuItems: any[];
  editMode: 'position' | 'disable' | null;
  expandedGroups: string[];
  toggleGroup: (groupName: string) => void;
  setItemToDisable: (itemId: string) => void;
}

export function SidebarMenuList({
  menuItems,
  editMode,
  expandedGroups,
  toggleGroup,
  setItemToDisable
}: SidebarMenuListProps) {
  return (
    <SidebarMenu>
      {menuItems.map((item, index) => (
        <Draggable
          key={item.id}
          draggableId={item.id}
          index={index}
          isDragDisabled={editMode !== 'position'}
        >
          {(provided) => (
            <SidebarMenuItemComponent
              item={item}
              index={index}
              editMode={editMode}
              expandedGroups={expandedGroups}
              toggleGroup={toggleGroup}
              confirmDisable={setItemToDisable}
              provided={provided}
            />
          )}
        </Draggable>
      ))}
    </SidebarMenu>
  );
}
