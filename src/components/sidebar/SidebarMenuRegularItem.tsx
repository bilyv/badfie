
import { Link } from "react-router-dom";
import { MinusCircle } from "lucide-react";
import {
  SidebarMenuButton,
  SidebarMenuItem as BaseSidebarMenuItem,
} from "@/components/ui/sidebar";

interface RegularMenuItemProps {
  item: {
    id: string;
    path: string;
    icon: any;
    title: string;
  };
  editMode: 'position' | 'disable' | null;
  confirmDisable: (itemId: string) => void;
  provided: any;
}

export function SidebarMenuRegularItem({
  item,
  editMode,
  confirmDisable,
  provided
}: RegularMenuItemProps) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <BaseSidebarMenuItem>
        <SidebarMenuButton
          asChild
          className={`transition-all duration-300 hover:scale-105 group ${editMode === 'position' ? 'animate-wiggle' : ''}`}
        >
          <Link to={item.path} className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </div>
            {editMode === 'disable' && (
              <MinusCircle
                className="h-4 w-4 text-destructive cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  confirmDisable(item.id);
                }}
              />
            )}
          </Link>
        </SidebarMenuButton>
      </BaseSidebarMenuItem>
    </div>
  );
}
