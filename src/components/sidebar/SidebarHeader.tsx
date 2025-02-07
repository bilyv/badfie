import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface SidebarHeaderProps {
  isEditing: boolean;
  editMode: 'position' | 'disable' | null;
  setEditMode: (mode: 'position' | 'disable' | null) => void;
  setIsEditing: (value: boolean) => void;
}

export function SidebarHeader({ isEditing, editMode, setEditMode, setIsEditing }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Star className="h-8 w-8 text-primary animate-wiggle" />
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-pulse">
          Toolimark
        </span>
      </div>
      <div className="flex gap-2">
        {isEditing && (
          <ToggleGroup type="single" value={editMode || ''} onValueChange={(value) => setEditMode(value as 'position' | 'disable' | null)}>
            <ToggleGroupItem value="position" aria-label="Position" className="h-8 w-8">
              <span className="h-4 w-4">↕</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="disable" aria-label="Disable" className="h-8 w-8">
              <span className="h-4 w-4">-</span>
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
          <span className="h-4 w-4">{isEditing ? '×' : '✎'}</span>
        </Button>
      </div>
    </div>
  );
}