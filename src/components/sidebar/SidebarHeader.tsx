import { Package, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  isEditing: boolean;
  onEditToggle: () => void;
}

export const SidebarHeader = ({ isEditing, onEditToggle }: SidebarHeaderProps) => {
  return (
    <div className="p-4 flex items-center justify-between text-sm font-semibold border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        <span>Inventory Pro</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onEditToggle}
      >
        <Edit2 className={`h-4 w-4 ${isEditing ? 'text-primary' : ''}`} />
      </Button>
    </div>
  );
};