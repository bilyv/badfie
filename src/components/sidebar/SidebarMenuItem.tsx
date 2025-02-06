
import { SidebarMenuGroup } from "./SidebarMenuGroup";
import { SidebarMenuRegularItem } from "./SidebarMenuRegularItem";

interface MenuItemProps {
  item: any;
  index: number;
  editMode: 'position' | 'disable' | null;
  expandedGroups: string[];
  toggleGroup: (groupName: string) => void;
  confirmDisable: (itemId: string) => void;
  provided: any;
}

export function SidebarMenuItemComponent({
  item,
  editMode,
  expandedGroups,
  toggleGroup,
  confirmDisable,
  provided
}: MenuItemProps) {
  if ('group' in item) {
    return (
      <SidebarMenuGroup
        item={item}
        editMode={editMode}
        expandedGroups={expandedGroups}
        toggleGroup={toggleGroup}
        confirmDisable={confirmDisable}
      />
    );
  }

  return (
    <SidebarMenuRegularItem
      item={item}
      editMode={editMode}
      confirmDisable={confirmDisable}
      provided={provided}
    />
  );
}
