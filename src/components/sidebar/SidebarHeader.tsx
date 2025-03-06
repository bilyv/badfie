
import { AppWindow, X, Edit2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDeviceContext } from "@/App";

interface SidebarHeaderProps {
  isEditing: boolean;
  editMode: 'position' | 'disable' | null;
  setEditMode: (mode: 'position' | 'disable' | null) => void;
  setIsEditing: (value: boolean) => void;
}

export function SidebarHeader({ isEditing, editMode, setEditMode, setIsEditing }: SidebarHeaderProps) {
  const deviceType = useDeviceContext();

  return (
    <div className="flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Star 
            className={`${deviceType === "mobile" ? "h-6 w-6" : "h-8 w-8"} text-primary animate-pulse transform rotate-12 hover:rotate-45 transition-all duration-500`}
            strokeWidth={1.5}
            fill="currentColor"
            fillOpacity={0.2}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className={`${deviceType === "mobile" ? "text-base" : "text-lg"} font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-pulse transition-all duration-300`}>
            Toolimark
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        {isEditing && (
          <ToggleGroup type="single" value={editMode || ''} onValueChange={(value) => setEditMode(value as 'position' | 'disable' | null)}>
            <ToggleGroupItem value="position" aria-label="Position" className={`${deviceType === "mobile" ? "h-6 w-6" : "h-8 w-8"} transition-all duration-300`}>
              <AppWindow className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="disable" aria-label="Disable" className={`${deviceType === "mobile" ? "h-6 w-6" : "h-8 w-8"} transition-all duration-300`}>
              <X className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`${deviceType === "mobile" ? "h-6 w-6" : "h-8 w-8"} transition-all duration-300 hover:scale-105`}
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
}
