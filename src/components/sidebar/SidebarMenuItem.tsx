import { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarMenuItemProps {
  title: string;
  path: string;
  icon: LucideIcon;
  isEditing: boolean;
  isDragging?: boolean;
}

export const SidebarMenuItemComponent = ({ 
  title, 
  path, 
  icon: Icon,
  isEditing,
  isDragging
}: SidebarMenuItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className={cn(
        "transition-all duration-300 hover:scale-105 group",
        isEditing && "animate-wiggle",
        isDragging && "opacity-50"
      )}
    >
      <Link to={path} className="flex items-center gap-3 w-full px-4">
        <Icon className="h-4 w-4" />
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  );
};