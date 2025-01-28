import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Edit2, Move, MinusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarHeaderProps {
  isReordering: boolean;
  setIsReordering: (value: boolean) => void;
  isDisabling: boolean;
  setIsDisabling: (value: boolean) => void;
}

export const SidebarHeader = ({
  isReordering,
  setIsReordering,
  isDisabling,
  setIsDisabling,
}: SidebarHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="relative">
          <UserRound className="h-8 w-8 text-primary" />
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 animate-neon-glow dark:animate-neon-glow-dark border-2 border-white dark:border-gray-900" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">Brian</span>
          <span className="text-xs text-muted-foreground">Workspace</span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 transition-all duration-300 hover:scale-105"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => {
            setIsReordering(!isReordering);
            setIsDisabling(false);
          }}>
            <Move className="h-4 w-4 mr-2" />
            Position
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setIsDisabling(!isDisabling);
            setIsReordering(false);
          }}>
            <MinusCircle className="h-4 w-4 mr-2" />
            Disable
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};