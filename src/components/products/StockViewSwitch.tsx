import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList, SwitchCamera } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface StockViewSwitchProps {
  layout: 'list' | 'grid';
  onLayoutChange: (layout: 'list' | 'grid') => void;
  onViewChange: (view: 'real-time' | 'movement' | 'damaged' | 'expiry') => void;
}
export const StockViewSwitch = ({
  layout,
  onLayoutChange,
  onViewChange
}: StockViewSwitchProps) => {
  return <div className="flex justify-end gap-2 mb-4">
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SwitchCamera className="h-4 w-4" />
            Switch View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onViewChange('real-time')}>
            Real-time Stock
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('movement')}>
            Stock Movement
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('damaged')}>
            Damaged
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewChange('expiry')}>
            Expiry Dates
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>;
};