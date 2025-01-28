import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";
import { SidebarHeader as CustomSidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuItemComponent } from "./sidebar/SidebarMenuItem";
import { defaultMenuItems } from "./sidebar/defaultMenuItems";
import { MenuItem } from "./sidebar/types";

export function AppSidebar() {
  const navigate = useNavigate();
  const [isReordering, setIsReordering] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    
    if (active?.id && over?.id && active.id !== over.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex(item => 
          'title' in item ? item.title === active.id : item.group === active.id
        );
        const newIndex = items.findIndex(item => 
          'title' in item ? item.title === over.id : item.group === over.id
        );
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = [...items];
          const [movedItem] = newItems.splice(oldIndex, 1);
          newItems.splice(newIndex, 0, movedItem);
          return newItems;
        }
        return items;
      });
    }
  };

  const handleDisableItem = (title: string) => {
    setMenuItems(prev => prev.filter(menuItem => 
      'title' in menuItem ? menuItem.title !== title : true
    ));
  };

  return (
    <Sidebar className="w-64 bg-background/40 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 rounded-tr-xl rounded-br-xl transition-all duration-300">
      <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-800 bg-background/40 backdrop-blur-md">
        <CustomSidebarHeader
          isReordering={isReordering}
          setIsReordering={setIsReordering}
          isDisabling={isDisabling}
          setIsDisabling={setIsDisabling}
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={menuItems.map(item => 'title' in item ? item.title : item.group)}
                  strategy={verticalListSortingStrategy}
                >
                  {menuItems.map((item) => (
                    <SidebarMenuItemComponent
                      key={'title' in item ? item.title : item.group}
                      item={item}
                      isReordering={isReordering}
                      isDisabling={isDisabling}
                      onDisable={handleDisableItem}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
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
  );
}