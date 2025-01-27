import { LucideIcon, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarMenuItemProps {
  title?: string;
  group?: string;
  path?: string;
  icon: React.ComponentType;
  isEditing: boolean;
  isDragging?: boolean;
  isDisabling?: boolean;
  onDisable?: () => void;
  className?: string;
}

export const SidebarMenuItemComponent: React.FC<SidebarMenuItemProps> = ({ 
  title, 
  group,
  path, 
  icon: Icon,
  isEditing,
  isDragging,
  isDisabling,
  onDisable,
  className
}) => {
  const location = useLocation();
  const isActive = path ? location.pathname === path : false;
  const displayText = title || group;
  const [isHovered, setIsHovered] = useState(false);

  const buttonContent = (
    <div className="flex items-center justify-between w-full px-4">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        <span>{displayText}</span>
      </div>
      {isDisabling && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDisable?.();
          }}
          className="p-1 hover:bg-red-500 hover:text-white rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  const combinedClassName = cn(
    "transition-all duration-300 hover:scale-105 group relative",
    isEditing && !isDisabling && isHovered && "animate-[wiggle_0.3s_ease-in-out]",
    isDisabling && "animate-pulse text-red-500",
    isDragging && "opacity-50",
    className
  );

  return (
    <SidebarMenuButton
      asChild={!!path}
      isActive={isActive}
      className={combinedClassName}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {path ? (
        <Link to={path}>{buttonContent}</Link>
      ) : (
        buttonContent
      )}
    </SidebarMenuButton>
  );
};