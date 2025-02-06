
import { Edit2, GripHorizontal, MinusCircle, UserRound, X } from "lucide-react";
import { Button } from "../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface SidebarHeaderProps {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  editMode: 'position' | 'disable' | null;
  setEditMode: (value: 'position' | 'disable' | null) => void;
}

export const SidebarHeader = ({ 
  isEditing, 
  setIsEditing, 
  editMode, 
  setEditMode 
}: SidebarHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          <UserRound className="h-8 w-8 text-primary animate-pulse" />
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 animate-neon-glow dark:animate-neon-glow-dark border-2 border-white dark:border-gray-900" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-pulse">
            Toolimark
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        {isEditing && (
          <ToggleGroup type="single" value={editMode || ''} onValueChange={(value) => setEditMode(value as 'position' | 'disable' | null)}>
            <ToggleGroupItem value="position" aria-label="Position" className="h-8 w-8">
              <GripHorizontal className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="disable" aria-label="Disable" className="h-8 w-8">
              <MinusCircle className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-all duration-300 hover:scale-105"
          onClick={() => {
            setIsEditing(!isEditing);
            setEditMode(null);
          }}
        >
          {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
