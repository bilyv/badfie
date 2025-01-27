import { Package, Edit2, Move, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarHeaderProps {
  isEditing: boolean;
  isDisabling: boolean;
  onEditToggle: () => void;
  onPositionToggle: () => void;
  onDisableToggle: () => void;
}

export const SidebarHeader = ({ 
  isEditing, 
  isDisabling,
  onEditToggle,
  onPositionToggle,
  onDisableToggle,
}: SidebarHeaderProps) => {
  return (
    <div className="p-4 flex items-center justify-between text-sm font-semibold border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        <span>Inventory Pro</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8", 
              (isEditing || isDisabling) && "text-primary"
            )}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onPositionToggle}>
            <Move className="mr-2 h-4 w-4" />
            <span>Position</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDisableToggle}>
            <Ban className="mr-2 h-4 w-4" />
            <span>Disable</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};