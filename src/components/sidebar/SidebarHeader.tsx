
import { Edit2, GripHorizontal, MinusCircle, Sparkles } from "lucide-react";
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
        <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        <div className="flex flex-col items-start">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-300% animate-gradient">
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
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
