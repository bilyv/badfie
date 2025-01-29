import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MinusCircle } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem as BaseSidebarMenuItem } from "@/components/ui/sidebar";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MenuItem } from "./types";

interface SidebarMenuItemProps {
  item: MenuItem;
  isReordering: boolean;
  isDisabling: boolean;
  onDisable: (title: string) => void;
}

export const SidebarMenuItemComponent = ({
  item,
  isReordering,
  isDisabling,
  onDisable,
}: SidebarMenuItemProps) => {
  const location = useLocation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: 'title' in item ? item.title : item.group
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if ('title' in item) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <BaseSidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={location.pathname === item.path}
            className={`transition-all duration-300 hover:scale-105 group ${isReordering || isDisabling ? 'animate-wiggle' : ''}`}
          >
            <Link to={item.path} className="flex items-center justify-between w-full px-4">
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </div>
              {isDisabling && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    onDisable(item.title);
                  }}
                >
                  <MinusCircle className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </Link>
          </SidebarMenuButton>
        </BaseSidebarMenuItem>
      </div>
    );
  }

  return null;
};