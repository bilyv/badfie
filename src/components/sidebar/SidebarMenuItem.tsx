import { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarMenuItemProps {
  title?: string;
  group?: string;
  path?: string;
  icon: React.ComponentType;
  isEditing: boolean;
  isDragging?: boolean;
  className?: string;
}

export const SidebarMenuItemComponent = ({ 
  title, 
  group,
  path, 
  icon: Icon,
  isEditing,
  isDragging,
  className
}: SidebarMenuItemProps) => {
  const location = useLocation();
  const isActive = path ? location.pathname === path : false;
  const displayText = title || group;

  const content = (
    <div className={cn("flex items-center gap-3 w-full px-4", className)}>
      <Icon className="h-4 w-4" />
      <span>{displayText}</span>
    </div>
  );

  return (
    <SidebarMenuButton
      asChild={!!path}
      isActive={isActive}
      className={cn(
        "transition-all duration-300 hover:scale-105 group",
        isEditing && "animate-wiggle",
        isDragging && "opacity-50"
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