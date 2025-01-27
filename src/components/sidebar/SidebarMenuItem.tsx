import { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarMenuItemProps {
  title: string;
  path?: string;
  icon: React.ComponentType;
  isEditing: boolean;
  isDragging?: boolean;
  className?: string;
}

export const SidebarMenuItemComponent = ({ 
  title, 
  path, 
  icon: Icon,
  isEditing,
  isDragging,
  className
}: SidebarMenuItemProps) => {
  const location = useLocation();
  const isActive = path ? location.pathname === path : false;

  const content = (
    <div className="flex items-center gap-3 w-full px-4">
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </div>
  );

  return (
    <SidebarMenuButton
      asChild={!!path}
      isActive={isActive}
      className={cn(
        "transition-all duration-300 hover:scale-105 group",
        isEditing && "animate-wiggle",
        isDragging && "opacity-50",
        className
      )}
    >
      {path ? (
        <Link to={path}>{content}</Link>
      ) : (
        content
      )}
    </SidebarMenuButton>
  );
};