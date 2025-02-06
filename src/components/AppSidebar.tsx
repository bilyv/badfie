
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { UserRound } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { defaultMenuItems } from "./sidebar/defaultMenuItems";
import { SidebarHeader as CustomSidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuComponent } from "./sidebar/SidebarMenu";
import { SidebarMenuItem } from "./sidebar/types";
import { useLocation } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'position' | 'disable' | null>(null);
  const [menuItems, setMenuItems] = useState<SidebarMenuItem[]>(defaultMenuItems);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [itemToDisable, setItemToDisable] = useState<string | null>(null);

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
    toast({
      title: "Tab disabled",
      description: "The selected tab has been removed from the sidebar.",
    });
    setItemToDisable(null);
  };

  const confirmDisable = (itemId: string) => {
    setItemToDisable(itemId);
  };

  return (
    <>
      <Sidebar className="w-64 bg-background/60 backdrop-blur-sm dark:bg-gray-900/60 border-r border-gray-200 dark:border-gray-800 rounded-tr-xl rounded-br-xl transition-all duration-300">
        <SidebarHeader className="p-4 border-b border-gray-200/60 dark:border-gray-800/60 bg-transparent backdrop-blur-sm">
          <CustomSidebarHeader
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editMode={editMode}
            setEditMode={setEditMode}
          />
        </SidebarHeader>

        <SidebarContent>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="sidebar-menu">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {menuItems.map((item, index) => (
                          <SidebarMenuComponent
                            key={('group' in item) ? item.group : item.id}
                            item={item}
                            index={index}
                            editMode={editMode}
                            expandedGroups={expandedGroups}
                            toggleGroup={toggleGroup}
                            confirmDisable={confirmDisable}
                            location={location}
                          />
                        ))}
                        {provided.placeholder}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-gray-200/60 dark:border-gray-800/60">
          <div className="flex items-center gap-2">
            <UserRound className="h-6 w-6 text-primary animate-pulse" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">Brian</span>
              <span className="text-xs text-muted-foreground">Workspace</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <AlertDialog open={!!itemToDisable} onOpenChange={() => setItemToDisable(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the tab from your sidebar. You can add it back later through the settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDisableItem(itemToDisable!)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
