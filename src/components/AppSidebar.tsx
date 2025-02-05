
import { ArrowUp } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { Button } from "./ui/button";
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

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
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
